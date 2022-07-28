# Web Application Openshift Resources

The DE team has a number of web applications, including JHA and MSP in this repository, that follow a similar pattern for building and deploying to openshift. This document gives a general overview of how the process works.

## Pre-requisites

To understand how our web-apps build, deploy, and communicate, you should be familiar with the openshift objects below:
- [BuildConfigs](https://docs.openshift.com/container-platform/4.10/cicd/builds/understanding-buildconfigs.html)
- [Images, ImageStreams, and ImageStreamTags](https://docs.openshift.com/container-platform/4.10/openshift_images/index.html). _I would reading this whole page if you are unfamiliar with how openshift handles container images._
- [DeploymentConfigs](https://docs.openshift.com/container-platform/4.10/applications/deployments/what-deployments-are.html)
- [NetworkPolicies](https://docs.openshift.com/container-platform/4.10/networking/network_policy/about-network-policy.html)
- [Routes](https://docs.openshift.com/container-platform/4.10/networking/routes/route-configuration.html)

As well as the following core kubernetes objects:

- [Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/)

# Overview

## Openshift Projects

Our openshift setup uses 4 projects for a given web application (or group of web applications):

1. **Tools**: This namespace contains common tools, like build configurations and their outputs (ImageStreams and ImageStreamTags)
1. **Dev**: Environment for the development version of the web app. This version continuously deploys when new code is pushed to github.
1. **Test**: A more stable environment for testing versions of the app. Deployments are manually triggered when new features are ready for testing.
1. **Prod**: The production version of the web-app. Deployments are manually triggered.

## Openshift templates

Throughout the github repositories for our web-apps and microservices, there are `openshift` folders.<sup id="a1">[1](#f1)</sup> These usually include the templates used to create the web-app's openshift objects and can be referred to for more details on the specific configurations. The templates can also be seen in the cluster using `oc get templates`.

## Building Applications

Our applications are built using single-page-application (SPA) frameworks, served with nginx, and run in containers on openshift. In order to build and deploy apps using this architecture, we use the following steps:

1. Compile the frontend javascript (vuejs or angular app) into web artifacts (html, css, javascript bundles).
1. Store those artifacts in a container image on openshift (referred to as the artifacts-image going forward).
1. Copy the web-artifacts from the artifacts-image into a new container image that includes the nginx server (referred to as the server-image going forward).
1. Run containers with the server-image on openshift.

Our openshift setup has two different **BuildConfigs** to handle this, one for compiling the artifacts, and one for the full server. Our pipelines will log into openshift and kick off those builds, waiting for the artifact build to complete before the server build to make sure the artifacts update. The second build outputs the nginx server image, and gives it two tags, _latest_ and _dev_ (latest gets added by default in openshift). These **BuildConfigs** and their output **ImageStreams** and **ImageStreamTags** can be found in the tools namespace. <sup id="a2">[2](#f2)</sup>

The two **BuildConfigs** use different strategies to create the images:

  - **artifacts-build**: To build the artifacts-image, this **BuildConfig** uses a source-to-image strategy, pointing to github for the source. This means it will use whatever is on the provided github repository and branch as the source code, and using a nodejs builder image run the npm `install` and `build` commands to create the artifacts as you would locally.

  - **server-build**: This **BuildConfig** uses the output artifacts-image as a source and copies the artifacts over into a base nginx image.

## Deploying Applications

Our running web applications use the following objects:

- **DeploymentConfig**: A deployment config to manage pods running the server-image. It runs the server-image associated with the **ImageStreamTag** named after it's environment, e.g _dev_, _test_, or _prod_. Since the build process gives the newly built server-image the _dev_ tag, the dev environment redeploys on new builds. To deploy test and prod, point the _test_ and _prod_ **ImageStreamTags** to the image you want to use. For example to upgrade test to use the latest image run `oc tag ${TOOLS_NAMESPACE}/${IMAGE_NAME}:latest ${TOOLS_NAMESPACE}/${IMAGE_NAME}:test`. These commands are included in our github actions so that they can be run easily without having to login to the cluster. The **DeploymentConfig** is also setup to redeploy whenever the pod template changes (including the mounted nginx **ConfigMap**).
- **Service**: A service to expose the deployment config.
- **Route**: A route for the url to the web-app.
- **ConfigMap**: A configmap for the nginx server config file.


## NetworkPolicies

On the platform-services cluster, new projects have a `deny-all` default **NetworkPolicy** setup, so that any communication between objects needs to be allowed explicitly. For example, communication with different microservices like the captcha-service. See [quickmspweb-toall](/openshift/templates/quickmspweb-toall.yaml) for the example msp and jha application policies. In these policy templates, it is selecting using the label `role=mspfrontend`, which is applied to both jha and msp pods.

## Footnotes

<b id="f1">1</b> If you have any issues applying the templates, make sure that any parameter references are only used in the `objects` array of the yaml file.
 [↩](#a1)

<b id="f2">2</b> This build process could potentially be simplified to a single build config by using a multi-stage docker file. For example:
``` docker
FROM node:12 AS builder
WORKDIR <root-dir-name>
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
```
 [↩](#a2)
