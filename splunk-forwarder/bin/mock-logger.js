//This test server is used to return API responses in the dev environment
//This simulates the real-life behavior of Splunk or Dynatrace, who ordinarily return 200 or 204 codes when logs are successfully submitted to them.

const express = require("express");
const app = express();

const MOCK_LOGGER_PORT = 3000; //needs to match the SPLUNK_URL in start-local-forwarder.sh
const responseCode = 200; //set this to whatever you like, eg. 200, 204, or 500

app.listen(MOCK_LOGGER_PORT, () => {
  console.log(`Mock logger listening on port ${MOCK_LOGGER_PORT}`);
});

app.post("/log", (req, res) => {
  const date = new Date().toLocaleDateString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const message =
    "Whoops! Wrong server. Calls to /log need to go through the local-forwarder, not the mock-logger.";
  console.log(date, message);
  res.status(501);
  res.send(message).end();
});

app.post("/mock-logger", (req, res) => {
  const date = new Date().toLocaleDateString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  console.log("[MOCKLOGGER] ", date, "-- Responded with ", responseCode, "(POST)");
  res.status(responseCode).end();
});

app.head("/", (req, res) => {
  const date = new Date().toLocaleDateString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  console.log("[MOCKLOGGER] ", date, "-- Responded with 200 (HEAD)");
  res.status(200).end();
});