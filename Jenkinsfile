// invoke other pipelines, to be tested if it works
pipeline
{
  agent 
  {
    node {
      label 'main'
    }

  }

  stages
  {
    stage('spa-env-server') {
      steps {
        echo "======"
        echo "Building spa-env-server"
        dir ('spa-env-server') {
          build job: 'spa-env-server', parameters: [
            string(name: 'APP_NAME', value: "spa-env-server")
          ]
        }
      }	    
    }
    stage('splunk-forwarder') {
      steps {
        echo "======"
        echo "Building splunk-forwarder" 
        dir ('splunk-forwarder') {
          build job: 'splunk-forwarder', parameters: [
            string(name: 'APP_NAME', value: "splunk-forwarder")
          ]
        }
      }	    
    }
    stage('MyGovBC-MSP-Service') {
      steps {
        echo "======"
        echo "Building MyGovBC-MSP-Service" 
        dir ('MyGovBC-MSP-Service') {
          build job: 'MyGovBC-MSP-Service', parameters: [
            string(name: 'APP_NAME', value: "MyGovBC-MSP-Service")
          ]
        }
      }	    
    }
    stage('MyGovBC-CAPTCHA-Service') {
      steps {
        echo "======"
        echo "Building MyGovBC-CAPTCHA-Service" 
        dir ('MyGovBC-CAPTCHA-Service') {
          build job: 'MyGovBC-CAPTCHA-Service', parameters: [
            string(name: 'APP_NAME', value: "MyGovBC-CAPTCHA-Service")
          ]
        }
      }	    
    }
  }	    
}
