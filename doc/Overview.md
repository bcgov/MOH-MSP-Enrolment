# Maximus DE Overview

Several Maximus DE applications are deployed to Redhat OpenShift clusters. These projects include the following: MSP and JHA (Angular app, Vue app respectively and Node.js services, repo name: MOH-MSP-Enrolment), FPCare and FPCare Income Review (Angular apps and Node.js services, repo name: MOH-FPC-Enrolment), SiteReg (Angular app and Node.js services, repo name: MOH-IAM-Enrolment), BCP (Angular app and Node.js services, repo name: MOH-BCP-Enrolment), AOP and OOP (Vue apps and Node.js services, repo name: MOH-AOP-OOP), and PPPP (Vue app and Node.js services, repo name: MOH-PPPP-Enrolment). The container platform and resource allocation is managed by bcgov, the configuration and deployment of the individual clusters is managed by Maximus.

Below I will document the structure of one of these repos as they all follow the same approach, albeit with different applications and slightly different Node.js services. We will look at MOH-MSP-Enrolment.

## MOH-MSP-Enrolment Repo Structure

### .github/
Where GitHub actions are stored. These make use of two GitHub repository secrets, which can be modified or removed through GitHub UI on the repo by navigating to Settings -> Secrets -> Actions. They are "OpenShiftServerURL" and "OpenShiftToken", which correspond to "https://api.silver.devops.gov.bc.ca:6443" (available from ‘copy login command’ in OpenShift console) and one of the two "github-cicd-token"'s found in the OpenShift console under Developer -> <NAMESPACE>-tools -> Secrets OR Administrator -> <NAMESPACE>-tools -> Workloads -> Secrets. Here NAMESPACE refers to the project namespace, ie. f0463d if in MOH-MSP-Enrolment cluster.

These GitHub actions exist to make it 'easy' to deploy the apps and services to dev, test, and prod via image tagging. More on that later.

### jha/ and msp/
The Vue and Angular apps respectfully. These are deployed on NGINX servers built from a Dockerfile.

### address-service
As are all the services in the repo/cluster, address-service is a Node.js server running from a standard Node.js image. address-service handles requests from the frontend, forwarding them to AddressDoctor, a 3rd party API for address lookup, and returns formatted results to the frontend. Several OpenShift environment variables configure this service.

### captcha-service
captcha-service sends audio and captcha svg to the frontend upon request, and handles verification of submitted answers, as well as supplying the final JWT if the submitted answer is correct. It is an old program and a replacement was under investigation using Google recaptcha but was never released (both developers left before the project was approved.) Several environment variables exist in this service to dictate things like whether there is a bypass text that works regardless of what the captcha actually is. 

### msp-service
msp-service forwards submissions to the middleware from the frontend with some added auth via certificates and username+password. This info is stored in environment variables either plainly or in OpenShift secrets form.

### spa-env-server
Because our single page apps deployed with OpenShift via NGINX don't have access to process.env, the spa-env-server service exists to supply them. SPAs make a POST request with headers to spa-env-server and receive whatever variables they specify, for things like maintenance periods etc. These variables live in the OpenShift environment variables as they do in the other services.

### splunk-forwarder
splunk-forwarder is exactly what it sounds like, it handles requests from the frontend to create logs and extracts details to send to Splunk. This service is configured with environment variables including certificate(s) etc. which can be found in the OpenShift console unless they are stored as OpenShift secrets. 

## Environment variable storage and configuration
OpenShift secrets (some environment variables like certificate keys etc. are sensitive) are stored on Maximus' servers in a Bitbucket repo (contact one of the developers for access)

The above-mentioned repo should be updated whenever secrets are updated and contains the oc (OpenShift command-line tool) commands to set them. Environment variables vary between the different environments (dev, test, prod). 

## OpenShift Documentation

For documentation regarding the OpenShift setup for web apps, refer to [WebAppResources.md](./WebAppResources.md). For a deep dive into a specific web app, refer to [jhaResources.md](./jhaResources.md). For documentation regarding the OpenShift setup for microservices, such as captcha-service, refer to [MicroServiceResources.md](./MicroServiceResources.md).