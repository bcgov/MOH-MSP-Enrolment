# Overview

This document explains the openshift architecture for our microservices, including the addressService, captchaService, the spaEnvServer, the mspService, and the splunk-forwarder. These are all similarly built express APIs and use the same deployment resources. For an explanation of their purpose, see [add link to explainer doc]()

## Architecture

For each microservice, you can view their corresponding openshit directory in their directory to view the templates used to create them. For each of them, they have two sets of resources, one for building and one for deployment.

### Building

Each microservice follows the same build pattern, with two resources:

1. **BuildConfig**: A buildconfig is required to build the container image.
1. **ImageStream**: An imageStream is required to hold the compiled container image from the build process.

These resources will be in the tools namespace.

The buildconfigs use the source-to-image strategy, pointing to this repositories main branch and their respective subdirectory to build from. This means whenever a build is triggered, it will be what is on the main branch that actually builds. The section for this in the build.yaml file is shown below:

``` yaml    
source:
  contextDir: ${SOURCE_CONTEXT_DIR}
  git:
    ref: ${GIT_REF}
    uri: ${GIT_REPO_URL}
  type: Git
```

_**Note**: See the parameters section in any build.yaml file for the injected variables._

These builds are then piped into the imageStream. The base image to build on top of is generally `nodejs:10`, but can be easily changed by altering the template parameters.

The base builder image will run common npm commands to build, `npm install` and `npm build`, and by default the output container will use `npm start` as its startup command. Any microservices using this pattern should ensure to use `build` and `start` for their npm scripts. For more complicated builds, `gulp` scripts have been run via `npm run build`, e.g in the `address-service`.

_**Note:** The openshift documentation on this is quite light unfortunately, and only mentions running the `assemble` script. However, I believe the builder image openshift uses is based on [these builder images](https://github.com/sclorg/s2i-nodejs-container). The actual assemble and run scripts can be found in the `<node-version>/s2i/bin/` directory, e.g. the node 10 assemble script is [here](https://github.com/sclorg/s2i-nodejs-container/blob/master/10/s2i/bin/assemble). Note that it runs `npm install` and `npm run build`, and by default the container run script will use `npm start`._

As long as your build command
https://github.com/sclorg/s2i-nodejs-container

Builds are triggered manually, either through the `oc start-build <buildname>` command or through github actions. The actions responsible for the builds can be found in the [.github/workflows](/.github/workflows/) folder and under the name \<microservice\>.yaml, e.g `captcha-service.yaml`. Each of these workflows kicks off the buildConfig with the `oc start-build` command. They are set to run on all push events to that directories `src` folder or updates to it's dependencies, so builds will run continuously.

### Deploying

Deployments for our microservices use the following resources:

- **A DeploymentConfig**: Used to manage the running pods. The deploymentConfigs rollout on two triggers. Either the associated imageStreamTag (dev,test, or prod) points to a new image, or any configuration in their pod template changes. This includes their environment variables, which will trigger an update.
- **A service**: Required to expose the deployment config pods to other openshift resources.
- **A route**: Required to expose the service to an accessible URL.

There are deployments for each service in all environments, i.e dev, test and prod. Changing an environments base image only requires changing the associated imageStreamTag to point to the new image, since the deploymentConfig updates on image changes. e.g `oc tag -n f0463d-tools f0463d-tools/msp-service:latest f0463d-tools/msp-service:prod` to update the prod environments image to the latest build of msp-service.

The service just needs to be selecting the associated deployment config by name:

``` yaml
selector:
  deploymentconfig: ${API_NAME}
```

and exposing the correct port, usually 8080:

``` yaml
ports:
  - name: 8080-tcp
    port: 8080
    protocol: TCP
    targetPort: 8080
```

Note that the port is given the name 8080-tcp here. Finally, the route just needs to select the service to expose the application:

``` yaml
to:
  kind: Service
  name: ${API_NAME}
  weight: 100
```

here the parmeter ${API_NAME} should match the services name to select it.