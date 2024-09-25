FORWARDER_PORT=8080 #needs to match the forwarder port used in start-local-forwarder.sh

curl -XPOST -H "Authorization: Api-Token XXX" -H "Content-Type: application/json" -d '{"body": "xyz", "logsource":"test curl request" }' localhost:${FORWARDER_PORT}/log