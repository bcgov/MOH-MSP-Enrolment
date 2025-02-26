mkdir -p logs

FORWARDER_PORT=8080
MOCK_LOGGER_PORT=3000

export LOG_LEVEL=debug
export PORT=${FORWARDER_PORT}
export NODE_ENV=development
export SERVICE_PORT=${FORWARDER_PORT}
export USE_SPLUNK=true
export ONLY_LOG_WHEN_SPLUNK_FAILS=false
export SERVICE_USE_AUTH=false
export SERVICE_AUTH_TOKEN=aaa #never copy live tokens into this file
export SPLUNK_AUTH_TOKEN=aaa  #never copy live tokens into this file
export CA_CERT=aaa            #never copy live certificates into this file
export MONITOR_USERNAME=monitorusername #never copy live credentials into this file
export MONITOR_PASSWORD=monitorpassword #never copy live credentials into this file
export LOG_DIR_NAME=./logs
export FILE_LOG_LEVEL=info
export APPEND_POD_NAME_TO_FILE=false
export SPLUNK_URL=http://localhost:${MOCK_LOGGER_PORT}/mock-logger #changing out this URL for the live logging endpoint won't work due to the firewall. Work of that nature will need to be done from within OpenShift
export RETRY_COUNT=2
export MAX_FILES=1
export MAX_BYTE_SIZE_PER_FILE=78643200

if [ $1 = "--test" ]; then
    echo "Running in test mode (local forwarder only)"
    node src/index.js server 
else
    echo "Running in development mode (mock-logger and forwarder)"
    nodemon bin/mock-logger.js & nodemon src/index.js server
fi


