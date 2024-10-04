const { exec } = require("node:child_process");

//these need to match the values in start-local-forwarder.sh
const monitorUsername = "monitorusername";
const monitorPassword = "monitorpassword";
const mockLoggerUrl = "http://localhost:3000";
const localForwarderUrl = "http://localhost:8080";


const startMockLogger = async () => {
  //create child process to run the mock-logger for the duration of the tests
  //vitest doesn't always close child processes out when it finishes, so there's a timeout here to make extra sure they close
  const childProcess = await exec(
    "timeout 45s node bin/mock-logger.js",
    (err, stdout, stderr) => {}
  );
};

const startLocalForwarder = async () => {
  const childProcess = await exec(
    "timeout 45s bin/start-local-forwarder.sh --test",
    (err, stdout, stderr) => {}
  );
};

const tryServer = async (website, HTTPMethod) => {
  const retryAttempts = 10;

  for (let i = 0; i < retryAttempts; i++) {
    try {
      await fetch(website, {
        method: HTTPMethod,
      });
      // console.log(`successfully reached ${website}!`);
      return new Promise((resolve, reject) => {
        resolve();
      });
    } catch (error) {
      // console.log(`failed to reach ${website}, attempt `, i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  return new Promise((resolve, reject) => {
    reject(
      `Couldn't reach ${website} (tried ${retryAttempts} times and gave up)`
    );
  });
};


describe("Start local servers, test APIs", async () => {
  beforeAll(async () => {
    await startMockLogger();
    await startLocalForwarder();
    await tryServer(mockLoggerUrl, "HEAD");
    await tryServer(localForwarderUrl, "GET");
  }, 30000);

  it("(Mock logger) Should respond with a 200 to the / endpoint", async () => {
    const response = await fetch(`${mockLoggerUrl}`, {
      method: "HEAD",
    });
    expect(response.status).toBe(200);
  });

  it("(Mock logger) Should respond with a non-404 to the /mock-logger endpoint", async () => {
    const response = await fetch(`${mockLoggerUrl}/mock-logger`, {
      method: "POST",
    });
    expect(response.status).not.toEqual(404);
  });

  it("(Mock logger) Should respond with a 501 to the /log endpoint", async () => {
    const response = await fetch(`${mockLoggerUrl}/log`, {
      method: "POST",
    });
    expect(response.status).toBe(501);
  });

  it("(Log forwarder) Should respond with a 200 to the /hello endpoint", async () => {
    const response = await fetch(`${localForwarderUrl}/hello`, {
      method: "GET",
    });
    expect(response.status).toBe(200);
  });

  it("(Log forwarder) Should respond with a 401 to the /monitor endpoint when unauthorized", async () => {
    const response = await fetch(`${localForwarderUrl}/monitor`, {
      method: "GET",
    });
    expect(response.status).toBe(401);
  });

  it("(Log forwarder) Should respond with a 200 to the /monitor endpoint when authorized", async () => {
    let headers = new Headers();
    headers.set(
      "Authorization",
      "Basic " +
        Buffer.from(monitorUsername + ":" + monitorPassword, "utf-8").toString(
          "base64"
        )
    );
    const response = await fetch(`${localForwarderUrl}/monitor`, {
      method: "GET",
      headers,
    });
    expect(response.status).toBe(200);
  });

  it("(Log forwarder) Should respond with a 200 to the /log endpoint", async () => {
    const response = await fetch(`${localForwarderUrl}/log`, {
      method: "POST",
    });
    expect(response.status).toBe(200);
  });
});
