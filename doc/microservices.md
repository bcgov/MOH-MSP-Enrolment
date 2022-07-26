# Overview

This document explains the openshift architecture for our microservices, including the addressService, captchaService, the spaEnvServer, the mspService, and the splunk-forwarder. These are all similarly built express APIs and use the same deployment resources. For an explanation of their purpose, see [the repo structure doc](/doc/RepoStructure.md).

## Architecture

For each microservice, their directory contains a `/openshift` subdirectory you can use to view the templates that created them. For each of them, they have two sets of resources, one for building and one for deployment.

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

The base builder image will run common npm commands to build, `npm install` and `npm build`, and by default the output container will use `npm start` as its startup command. Any microservices using this pattern should ensure to use `build` and `start` for their npm scripts. For more complicated builds, `gulp` scripts are used in the `npm run build` script, for example in the `address-service`.

_**Note:** The openshift documentation on this is quite light unfortunately, and only mentions running the `assemble` script. However, I believe the builder image openshift uses is based on [these builder images](https://github.com/sclorg/s2i-nodejs-container). The actual assemble and run scripts can be found in the `<node-version>/s2i/bin/` directory, e.g. the node 10 assemble script is [here](https://github.com/sclorg/s2i-nodejs-container/blob/master/10/s2i/bin/assemble). Note that it runs `npm install` and `npm run build`, and by default the container run script will use `npm start`._

Builds can be triggered either through the `oc start-build <buildname>` command or through github actions. The actions responsible for the builds can be found in the [.github/workflows](/.github/workflows/) folder and under the name \<microservice\>.yaml, e.g `captcha-service.yaml`. Each of these workflows kicks off the buildConfig with the `oc start-build` command. They are set to run on all push events to that directories `src` folder or updates to it's dependencies, so builds will run continuously.

### Deploying

Deployments for our microservices use the following resources:

- **A DeploymentConfig**: Used to manage the running pods. The deploymentConfigs rollout on two triggers. Either the associated imageStreamTag (dev,test, or prod) points to a new image, or any configuration in their pod template changes. This includes their environment variables, which will trigger an update.
- **A service**: Required to expose the deployment config pods to other openshift resources.
- **A route**: Required to expose the service to an accessible URL.

**Updating Deployments**: There are deployments for each service in all environments, i.e dev, test and prod. Changing the image running in an environment only requires changing the associated imageStreamTag to point to the new image, since the deploymentConfig updates on image changes. E.g `oc tag -n f0463d-tools f0463d-tools/msp-service:latest f0463d-tools/msp-service:prod` will update the prod environments image to the latest build of msp-service.

**Service Details**: The service just needs to be selecting the associated deployment config by name:

``` yaml
selector:
  deploymentconfig: ${API_NAME}
```

and exposing the correct port, usually 8080 in our services:

``` yaml
ports:
  - name: 8080-tcp
    port: 8080
    protocol: TCP
    targetPort: 8080
```

Note that the port is given the name 8080-tcp here.

**Route Details**: Finally, the route just needs to select the service to expose the application:

``` yaml
to:
  kind: Service
  name: ${API_NAME}
  weight: 100
```

here the parmeter ${API_NAME} should match the services name to select it.
The route can grab the service's port to listen to by the name the service assigned to it, `8080-tcp`:

``` yaml
port:
  targetPort: 8080-tcp
```


## NetworkPolicies

NetworkPolicies are required to allow communication with other openshift resources, since a `deny-all-by-default` policy is used on the platform services cluster. See the [msp-to-all](/openshift/templates/quickmspweb-toall.yaml) template for an example set. The policy to allow jha and msp to talk to the captcha service is shown below:

``` yaml
spec:
  podSelector:
    matchLabels:
      role: captchaservice
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: mspfrontend
      ports:
        - protocol: TCP
          port: 8080
```

This selects all pods given the label `role=captchaservice`, and allows them to receive ingress traffic from any pods with the label `role=mspfrontend`. The deploymentConfigs for the captcha service, jha, and msp all give their pods these roles in the pod template section, allowing those web-apps to use the captcha service. 

If services are failing to communicate, check the network policy allowing them to exists and that the selector labels are correct on the relevant pods or services.