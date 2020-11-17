
## Setup Tools

Add the Network Security Policy (NSP) to your `tools` namespace to allow any builds to access the internet; they often need to do this to pull in resources like `npm` packages:

**Make sure you're in -tools**

```console
oc process -f openshift/templates/nsp-tools.yaml \
  -p NAMESPACE=$(oc project --short) | \
  oc create -f -
```

Next, create a service account that GitHub can use to run `oc` commands on the cluster. This service account has very limited access to trigger builds, list images, and create tags:

```console
oc process -f openshift/templates/cicd.yaml \
  -p NAMESPACE=$(oc project --short) | \
  oc create -f -
```

You should see a few secrets have been created (and a service account):

```console
➜  MOH-MSP-Enrolment git:(main) ✗ oc get secrets |grep github
github-cicd-dockercfg-pn4x6   kubernetes.io/dockercfg               1      76s
github-cicd-token-c74j8       kubernetes.io/service-account-token   4      76s
github-cicd-token-p69fn       kubernetes.io/service-account-token   4      76s
```

Use one of the tokens (any one will work) and grab the token then base64 encode it. You'll paste this info into your repository's secrets on GitHub:

```console
oc get secret/github-cicd-token-hzq6t -o json | \
  jq '.data.token' | \
  tr -d "\"" | \
  base64 -d | \
  pbcopy
```

![Add Token as Secret](./add_token.gif)

ProTip: The command above needs `jq` installed (`brew install jq`) and assumes your on macOS; `pbcopy` just copies the output to the clipboard so you can paste it.

Next, add the OCP4 URL as another git hub secret (you can find the url when you copy the logon command):

![Add URL as Secret](./add_ocp_url.gif)

## `spa-env-server` Build & Deployment

### Build

### Deploy

## `msp`  Build & Deployment

### Build

### Deploy
