FORWARDER_PORT=8080 #needs to match the forwarder port used in run-local

curl -XPOST -H "Authorization: Splunk XXX" -H "Content-Type: application/json" -d '{"body": "xyz", "logsource":"test curl request" }' localhost:${FORWARDER_PORT}/log