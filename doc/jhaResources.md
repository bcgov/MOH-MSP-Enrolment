# JHA Deployment

**Table of Contents**

- [Overview](#overview)
  - [Building the application container images](#building-container-images)
  - [Openshift Resources to expose the container images](#openshift-resources)
- [Resources](#resources)
  - [Tools Namespace](#tools-namespace)
    - [2 buildConfigs (jha-web-artifact-build, jha-web-image-build)](#buildconfigs)
      - [jha-web-artifact-build](#jha-web-artifact-build)
      - [jha-web-image-build](#jha-web-image-build)
    - [2 ImageStreams (jha-web, jha-web-artifacts)](#imagestreams)
      - [jha-web](#jha-web)
      - [jha-web-artifacts](#jha-web-artifacts)
    - [5 ImageStreamTags (jha-web:prod, jha-web:test, jha-web:dev, jha-web:latest, jha-web-artifacts:latest)](#imagestreamtags)
  - [Environment Namespaces](#environment-namespaces)
    - [1 DeploymentConfig (jha-web)](#deploymentconfig)
    - [2 Routes (jha-web, jha-web-to-api)](#route)
    - [1 Service](#service)
    - [1 ConfigMap](#configmap)
    - [1 - 6 NetworkPolicies](#networkpolicies)
- [Additional Notes](#additional-notes)
  - [Openshift Templates](#openshift-templates)
  - [Rolling back](#rolling-back)

This document gives a general overview of the openshift resources and deployment process for JHA. There are additional microservices, like the addressService and captchaService that the app uses but are external to it. They are not covered here.

# Overview
There are two important pieces that make up the JHA deployment process:

1. [Building the application container images](#building-container-images)
1. [Openshift Resources to expose the container images](#openshift-resources)

## Building Container Images

The build process for all of our environments (dev, test, and prod) is handled in the `f0463d-tools` namespace. This includes the ImageStreams, their associated tags (ImageStreamTags), and the build configurations to define how and when to build the images.

The general workflow for building our application's container images is:

1. Build an image of the vuejs web artifacts, i.e the html, css, and javascript bundles. Similar to the output of running `npm run build` locally.
1. Build a full web-server image, using nginx as the server, that includes and exposes the web artifacts built above.
1. Give the newly built web-server image the appropriate environment tag (either dev, test, or prod) to automatically redeploy that namespace's application.

_**Note**: The deployment of the new build is not covered in this section. See the [Deployment Configurations](#deploymentconfig) section for more information on deploying._ 

The build configurations can be triggered either by logging into openshift and starting a build manually (`oc start-build <build-name>`), or automatically through our github actions. The [jha-web](/.github/workflows/jha-web.yaml) github action is responsible for this. The `image-build` job within that action does the build in 4 important steps:

1. Kicks off the build of the web artifacts; `oc start-build jha-web-artifact-build -n f0463d-tools --follow`. By default this gives the newly built image the `latest` tag.
1. Change the `dev` tag to point at the latest image; `tag -n f0463d-tools f0463d-tools/jha-web-artifacts:latest f0463d-tools/jha-web-artifacts:dev`
1. Kicks off the build of the web server; `oc start-build jha-web-image-build -n f0463d-tools --follow`. By default this gives the newly built image the `latest` tag.
1. Change the `dev` tag to point at the latest image; `tag -n f0463d-tools f0463d-tools/jha-web:latest f0463d-tools/jha-web:dev`

So this updates both of the container images, and continuously deploys them to the dev environment. The additional github actions [jha-web-to-test](/.github/workflows/jha-web-to-test.yaml) and [jha-web-to-prod](/.github/workflows/jha-web-to-prod.yaml) simply point the test and prod tags to the latest server image, since it would have already been built.

_**Note**: I don't believe the second step is actually required here, since the build configuration for the web server always uses the `latest` tag of the web artifacts, updating the dev tag is not necessary._

_**Note**: there is some potential confusion for the default arguments in these actions since they always upgrade the environment to use the `latest` tag. This means deploying to prod will use whichever code was most recently merged to the main branch, it does not upgrade the test image to prod. To change that, you would want to specify the `test` tag instead of `latest` when running `jha-web-to-prod`._

More details on the build configurations can be found in the [Build Configurations](#buildconfigs) section. Key concepts for them are:

- They use a source-to-image strategy, with our github repository as the source. This means then whenever a build is started, it looks at the main branch of this github repository to build off of.
- Builds are not kicked off automatically within openshift, they can be started either by using github actions, or manually by running `oc start-build`.
- There are two different required images, one for the full server, and one for just the artifacts. The server build requires the artifacts build to have completed first, or it will use an older image of the vuejs application. It always builds off of the artifacts `latest` tag, not the specific environment tag.

The tools namespace also includes the ImageStreams for the two output images and a set of environment tags to control where they deploy. For more information on how the tags actually update the application, see the [Deployment Configurations](#deploymentconfig) section.

In addition to these, there are a few supporting resources to allow github actions to access tools:
- **Secrets**: There are a few secrets, such as the github cicd-token for the github actions service account. These are most easily seen through the cli with `oc get secrets`.
- **ServiceAccount**: A service account for github actions. For details on setting it up, refer to the [setup dev environment](./SetupDevEnvironment.md) markdown file.

## Openshift Resources

To actually run the built container images, our application has a few openshift resources. These are environment specific, and exist in each of dev, test, and prod. This repository contains a number of templates that define them and can be used for reference. The resources are listed below:

- **1 DeploymentConfig**: This controls running the pods with the web-server image. It has automatic triggers to update itself whenever any configuration is changed, or when the underlying image its environment tag points to changes (e.g when the `jha-web:dev` ImageStreamTag points to a new image, the f0463d-dev deploymentConfig will re-rollout with the new image).
- **1 Service**: This service exposes the pods of the deployment config, so they can connect with other openshift resources.
- **2 Routes**: There are two routes, one for the frontend app and one for the api. Only the frontend route is currently used, the other is missing a service. The frontend route is responsible for exposing the above service to an externally accessible domain. 
- **1 ConfigMap**: This configMap contains the nginx server configuration, and gets mounted to the DeploymentConfig. The DeploymentConfig is set to automatically redeploy when its configurations change, so updating this configMap will redeploy the web-app automatically. For more information on how it gets mounted, see the [Deployment Configurations](#deploymentconfig) section.

The template for the configMap can be found [here](/jha/openshift/templates/config.yaml). The other resources are all defined in the [deploy.yaml file](/jha/openshift/templates/deploy.yaml).

In addition to these, there are a few supporting network policies to allow traffic between resources. See the [Network Policies](#networkpolicies) section for details.

# Resources

This section covers the openshift API objects required by the JHA application in more detail.

## Tools Namespace

### **BuildConfigs**

The BuildConfigs for jha are responsible for building the container images that the pods will run. There are two of them, one to build the vuejs web artifacts 
and one to run an nginx server to serve them. The openshift template for them can be found [here](/jha/openshift/templates/build.yaml). See below for specifics on each one.

1. ### **jha-web-artifact-build**
    This is responsible for generating the web artifacts (html, css, and js bundles) similar to running `npm run build` in the local environment. It uses the source-to-image (S2I) strategy to build the image directly from our github repository, see [here for more on S2I](https://docs.openshift.com/container-platform/4.7/cicd/builds/build-strategies.html#builds-strategy-s2i-build_build-strategies). See below for the yaml snippet with important fields explained: 

    _**Tip**: To see the actual in-use yaml definition, you can run the `get` command with `-o yaml`. e.g `oc get bc jha-web-artifact-build -o yaml`, where `bc` is short for buildconfig._

    ``` yaml
    - apiVersion: v1
      kind: BuildConfig
      metadata:
        name: ${NAME}-web-artifact-build
        labels:
          app: ${NAME}-web
          name: ${NAME}-web-artifact-build
      spec:
        successfulBuildsHistoryLimit: 1
        failedBuildsHistoryLimit: 1
        output:
          to:
            kind: ImageStreamTag 
            name: ${NAME}-web-artifacts:${OUTPUT_IMAGE_TAG}
        resources:
          limits:
            cpu: ${CPU_LIMIT}
            memory: ${MEMORY_LIMIT}
          requests:
            cpu: ${CPU_REQUEST}
            memory: ${MEMORY_REQUEST}
        runPolicy: Serial
        source:
          contextDir: ${SOURCE_CONTEXT_DIR}
          git:
            ref: ${GIT_REF}
            uri: ${GIT_REPO_URL}
          type: Git
        strategy:
          sourceStrategy:
            env:
            - name: BUILD_LOGLEVEL
              value: "5"
            from:
              kind: ImageStreamTag
              name: ${SOURCE_IMAGE_NAME}:${SOURCE_IMAGE_TAG}
              namespace: ${SOURCE_IMAGE_NAMESPACE}
            incremental: false
          type: Source
    ```
    *Note: See the parameters section of the template for the variable values*

    - The `output` field gives the generated image an ImageStreamTag that can be referred to by other resources. For this build, it outputs to the `jha-web-artifacts:latest` image tag.

    - The `source` field defines where to build from. It sets the git URI to this repo, the ref to the branch `main`, and the context directory to `jha`. This allows openshift to pull whatever is in the jha folder on the main branch when this build gets triggered.

    - The `strategy` field defines an image to build on top of, referenced by it's imageStreamTag. For the default parameters, its built on top of nodejs:12. The base image for nodejs is aware of common build scripts, so this build config will run the common npm `install` and `build` commands to create the `dist` folder like you would locally.

1. ### **jha-web-image-build**

    This build config creates the actual nginx server with the web artifacts included, so that the application can be fully run. It's section in the template is:

    ``` yaml
    - apiVersion: v1
      kind: BuildConfig
      metadata:
        name: ${NAME}-web-image-build
        labels:
          app: ${NAME}-web
          name: ${NAME}-web-image-build
      spec:
        successfulBuildsHistoryLimit: 3
        failedBuildsHistoryLimit: 3
        output:
          to:
            kind: ImageStreamTag 
            name: ${NAME}-web:${OUTPUT_IMAGE_TAG}
        resources:
          limits:
            cpu: ${CPU_LIMIT}
            memory: ${MEMORY_LIMIT}
          requests:
            cpu: ${CPU_REQUEST}
            memory: ${MEMORY_REQUEST}
        runPolicy: Serial
        source:
          type: Dockerfile
          dockerfile: |-
            FROM registry.redhat.io/ubi8/nginx-118:latest
            COPY dist /opt/app-root/src
            CMD nginx -g "daemon off;"
          images:
          - from: 
              kind: ImageStreamTag
              name: jha-web-artifacts:latest
            paths: 
            - sourcePath: /opt/app-root/src/dist/
              destinationDir: "."
        strategy:
          dockerStrategy:
            from: 
              kind: DockerImage
              name: registry.redhat.io/ubi8/nginx-118:latest
          type: Docker
    ```

    - The `output` field gives the generated image an ImageStreamTag that can be referred to by other resources to use the generated artifacts. The tag for the full server is `jha-web:latest`.

    - The `source` field describes how to source the new image, and uses what was built in the artifacts image. The `source.images` field tells it to use the `jha-web-artifacts:latest` image generated from the above build config, and the `source.images.paths` is used to copy the generated web artifacts (which compiled into src/dist) into the root of the container. The `source.dockerfile` field is used to define a simple inline dockerfile, which in this case builds off an nginx server image and copies over the dist folder from our web artifacts. Since this build uses the image from the artifacts build, make sure to run the artifact build first if the underlying vuejs bundles need to be updated.

    _**Note: The configuration for the nginx server is not added at build time, and is connected later as a volume mount. This allows nginx configuration to be changed without needing a full image build._

### **ImageStreams**

Image streams are used to map images to their associated imageStreamTags. JHA uses two imagestreams, one for the web artifacts and one for the full server. The template responsible for them [lives here](/jha/openshift/templates/build.yaml). These image streams are used to contain the output images from the two builds.

1. ### **jha-web**
    This refers to the full image, including the nginx server.

1. ### **jha-web-artifacts**
    This refers to just the web artifacts, and is used by the image above to include them with the server. See the [BuildConfigs](#buildconfigs) section for details.

### **ImageStreamTags**

Image stream tags are used to point to different versions of the images made from the buildconfigs. For the artifacts, the `latest` tag is what will be used by the server build. For the full server image, it includes a `latest`, `dev`, `test`, and `prod` tag. Changing the image these tags point to will trigger a rollout for that environment.

## Environment Namespaces
This section is for the openshift resources that get deployed into the dev, test, and prod namespaces.  There are some sub-resources not mentioned here, like pods and replication controllers for jha. This is because they are handled by the DeploymentConfig, and do not need to be created or managed manually.

_**Tip**: In the f0463d-\<env\> namespaces, jha resources are labelled with `app=jha-enrolment-web`. So to quickly view the jha resources you can run `oc get all -l app=jha-enrolment-web`, where the -l flag is for label._

### **DeploymentConfig**
The deployment config controls the pods running the `jha-web` image. This includes when to rollout pods with new images, how many to run, the memory and cpu they require, environment variables, etc. It's template can be found [here](/jha/openshift/templates/deploy.yaml). Some important sections to note:

- **Triggers**: The triggers are set here:
  ``` yaml
  triggers:
    - type: ConfigChange
    - type: ImageChange
      imageChangeParams:
        automatic: true
        containerNames:
          - ${NAME}
        from:
          kind: ImageStreamTag
          name: ${SOURCE_IMAGE_NAME}:${SOURCE_IMAGE_TAG}
          namespace: ${SOURCE_IMAGE_NAMESPACE}
  ```
  _**Note**: See [here](https://docs.openshift.com/container-platform/4.7/applications/deployments/managing-deployment-processes.html#deployments-triggers_deployment-operations) for documentation_

  The `ImageChange` section tells openshift to re-rollout (redeploy pods with any updates) whenever the image stream tag (jha-web:\<env\>) is pointing to a new base image. So simply moving the dev, test, or prod tag to point to a new base image will redeploy the application. The image for the container is left out of the template, but running `oc describe dc jha-web` will show the actual jha-web image is being used.

  The `ConfigChange` parameter will trigger a rollout whenever any changes in the pod template are detected (`spec.template` section). While any template change causes a rollout, there are a few most common reasons the pod template will be changed; environment variable updates, and configMap updates. The environment variables available can be seen in this section of the template:

  ``` yaml
  env:
    - name: LOG_LEVEL
      value: ${LOG_LEVEL}
    - name: SERVICE_PORT
      value: "8080"
    - name: SERVICE_IP
      value: "0.0.0.0"
    - name: SOURCE_IMAGE_NAME
      value: "jha-web"
    - name: RealIpFrom
      value: ${RealIpFrom}
    - name: IpFilterRules
      value: ${IpFilterRules}
    - name: AdditionalRealIpFromRules
      value: ${AdditionalRealIpFromRules}
    - name: USE_SPLUNK_FORWARDER
      value: ${USE_SPLUNK_FORWARDER}
    - name: HTTP_BASIC
      value: ""
    - name: HTTP_BASIC_USERNAME
      value: ${HTTP_BASIC_USERNAME}
    - name: HTTP_BASIC_PASSWORD
      value: ${HTTP_BASIC_PASSWORD}
    - name: SPLUNK_AUTH_TOKEN
      valueFrom:
        secretKeyRef:
          name: msp-web-splunk-auth-token
          key: token
    - name: SPA_ENV_AUTH_TOKEN
      valueFrom:
        secretKeyRef:
          name: msp-web-spa-env-auth-token
          key: token
    - name: JHA_ENV
      value: ${JHA_ENV}
    - name: JHA_VERSION
      value: ${JHA_VERSION}
    - name: ROUTER_DEFAULT_SERVER_TIMEOUT
      value: ${ROUTER_DEFAULT_SERVER_TIMEOUT}
    - name: ROUTER_DEFAULT_CLIENT_TIMEOUT
      value: ${ROUTER_DEFAULT_CLIENT_TIMEOUT}
  ```

  Updating these will trigger a redeploy automatically. The configMap section is attached through a volume, in this part of the template:

  ``` yaml
  volumes:
    - name: config-vol
      configMap:
        name: jha-web-config
  ```

  This configMap has details for the nginx server. So any changes to the underlying nginx configMap will also trigger a redeploy.
- **Network Policies**:
  Another important point to note is that in the pod spec, the label `role: mspfrontend` is given to jha pods. This is used for our networkPolicies, which target both the msp and jha app using this role, and allow jha to work without duplicating the msp policies.

### **Route**

Routes are used to expose a url to visit a service. The most important thing about routes is they simply select a service to listen to and expose its traffic. So if you have a deploymentConfig, with an associated service, add a route to that service to expose the traffic. There are two routes for our app, with templates defined [here](/jha/openshift/templates/deploy.yaml), one of which appears to be unused, and one to view the frontend.

1. `jha-web`: Route to expose the frontend. The main thing to note for routes is which service and port they select, defined in the template here:

    ``` yaml
    port:
      targetPort: 8080-tcp
    tls:
      termination: edge
    to:
      kind: Service
      name: ${NAME}
      weight: 100
    ```

    In this case, the route points to the `jha-web` service, which exposes our front-end deployment config. It selects the port by its name, `8080-tcp`, which is the name given to port 8080 in the services yaml.


1. `jha-web-to-api`: 
    This one seems to be unused, at least in the dev environment. It is currently pointing to a service `${API_SERVICE_NAME}`, literally, since that variable is not defined in the template. It appears to have been intended to expose an API for jha if needed, which is not required at this time. We should probably remove the route, or fix the service reference/add the service.

### **Service**

There is one service for jha, `jha-web`, defined [here](/jha/openshift/templates/deploy.yaml). Services are used to expose groups of pods as one endpoint abstraction, to save from having to track the individual IP address of each pod, which may change randomly as pods get rebooted. For our service, the definition is:

``` yaml
- apiVersion: v1
  kind: Service
  metadata:
    labels:
      app: jha-enrolment-web
    name: ${NAME}
  spec:
    selector:
      deploymentconfig: ${NAME}
    ports:
      - name: 8080-tcp
        port: 8080
        protocol: TCP
        targetPort: 8080
```

- The `selector` field tells the service to grab any pod controlled by the deployment config `jha-web` (The ${NAME} parameter)
- The service listens to traffic from the deployment config pod's port 8080, and exposes it under 8080 port again.
- the exposed port is given the name `8080-tcp`, which is referred to by the route which re-exposes 8080 under a domain.

### **Configmap**

A configmap is used to connect the nginx server configuration to the deployment config. It's template definition can be found [here](/jha/openshift/templates/config.yaml). It is used as a separate volume outside the image to make it easy to change configuration variables without needing to re-build. When updated, it will trigger a rollout of the deployment config. 

### **NetworkPolicies**

There are a number of network policies to make all of our miocro-services talk to each other. A template for them can be found [here](/openshift/templates/quickmspweb-toall.yaml). Important to note is that platform-services requires the `deny-all` default policy in it's namespaces, and allowed traffic requires additional policies to override that base one. So if any pods or services need to communicate, a policy will be required to allow it. For jha, note that it's pods are all given the tag `role=mspfrontend`, so the policies allowing the old MSP app to talk to microservies like the addressService and captchaService apply to jha as well.

## Additional Notes
This section includes notes on gotchas, bugs, and other unexpected behaviours you may come across.

### **Openshift Templates**

Templates in openshift get applied to the cluster, then used with the `oc process` command. Because of this, some of the templates are already in the cluster, and don't need to be reapplied. You can view which ones are there with the command `oc get templates`. 

When re-creating the templates, some of them have some small errors, where they use parameters outside of the `objects` array. If you come across this when applying a template, ensure the top metadata section isn't using parameter values.

### **Rolling back**

Our deployment process uses the tags dev, test, and prod to tell each environment which image to run. This can make rolling back a bit difficult, since images are not tagged with their semantic version. To view which images a specific tag was previously using, you can run `oc describe is jha-web` in the tools namespace to see the history of the image stream. The output will include a section for each tag, for example:

``` sh
dev
  tagged from jha-web@sha256:90c002417c5f23382f457e0689019032065bf5734b45c5f818837c5400071e08

  * image-registry.openshift-image-registry.svc:5000/f0463d-tools/jha-web@sha256:90c002417c5f23382f457e0689019032065bf5734b45c5f818837c5400071e08
      2 days ago
    image-registry.openshift-image-registry.svc:5000/f0463d-tools/jha-web@sha256:186c392d486ed99ba278c7644ad99b0bd03c0723f01bd232ecbaaa93564a8ce0
      2 days ago
    image-registry.openshift-image-registry.svc:5000/f0463d-tools/jha-web@sha256:b68133a2c55a86796c6eb25fbc18f19946410108d54f0efda4d5f268e8c5b7e6
      3 days ago
    image-registry.openshift-image-registry.svc:5000/f0463d-tools/jha-web@sha256:642df6660506b4d4c9f1226911ece03d0e300f1bbd7d9062a316d87ccb4378c7
      4 days ago
```

You can use this history to point the environment tag to an older image sha directly and roll back to it. For example, here pointing the `dev` tag to `jha-web@sha256:642df6660506b4d4c9f1226911ece03d0e300f1bbd7d9062a316d87ccb4378c7` to go to the image from 4 days ago.