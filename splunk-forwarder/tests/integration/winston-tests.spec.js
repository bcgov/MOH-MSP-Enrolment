import * as fs from "fs";
import * as crypto from "crypto";
import { tryServer, doesPathExist } from "../test-helpers.js";
const { exec } = require("node:child_process");

//used to generate log commands and file names in tests
const fileLogLevel = "debug"; //or info, error, etc

const generatePortNumber = () => {
  //IANA officially recommends 49152-65535 for ephemeral ports.
  const min = Math.ceil(49152);
  const max = Math.floor(65535);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateLogCommand = (override) => {
  if ((override && typeof override !== "object") || Array.isArray(override)) {
    throw new Error("The generateLogCommand() function needs to be passed an object!");
  }
  const options = {
    LOG_LEVEL: "debug",
    PORT: "8080",
    SERVICE_PORT: "8080",
    USE_SPLUNK: true,
    ONLY_LOG_WHEN_SPLUNK_FAILS: false,
    LOG_DIR_NAME: "./logs",
    FILE_LOG_LEVEL: fileLogLevel,
    APPEND_POD_NAME_TO_FILE: false,
    SPLUNK_URL: "http://localhost:3000/mock-logger",
    RETRY_COUNT: 2,
    MAX_FILES: 1,
    MAX_BYTE_SIZE_PER_FILE: 78643200,
    timeout: "5s",
  };

  Object.assign(options, override);

  return `LOG_LEVEL=${options.LOG_LEVEL} PORT=${options.PORT} NODE_ENV=development SERVICE_PORT=${options.SERVICE_PORT} USE_SPLUNK=${options.USE_SPLUNK} ONLY_LOG_WHEN_SPLUNK_FAILS=${options.ONLY_LOG_WHEN_SPLUNK_FAILS} SERVICE_USE_AUTH=false SERVICE_AUTH_TOKEN=aaa SPLUNK_AUTH_TOKEN=aaa CA_CERT=aaa LOG_DIR_NAME=${options.LOG_DIR_NAME} FILE_LOG_LEVEL=${options.FILE_LOG_LEVEL} APPEND_POD_NAME_TO_FILE=${options.APPEND_POD_NAME_TO_FILE} SPLUNK_URL=${options.SPLUNK_URL} RETRY_COUNT=${options.RETRY_COUNT} MAX_FILES=${options.MAX_FILES} MAX_BYTE_SIZE_PER_FILE=${options.MAX_BYTE_SIZE_PER_FILE} timeout ${options.timeout} node src/index.js server`;
};

const startLocalForwarderWith = async (command) => {
  await exec(command, () => {
    ///err, stdout, stderr
  });
};

const createFilePath = async () => {
  return new Promise((resolve, reject) => {
    fs.mkdtemp("temp-", (err, folder) => {
      if (err) {
        reject("There was an error while making the temporary directory");
      } else {
        console.log("The temporary folder path is:", folder);
        resolve(folder);
      }
    });
  });
};

const deleteFilePath = async (pathToDelete) => {
  await fs.promises.rmdir(pathToDelete, { recursive: true }, () => {});
};

const tryFilePath = async (filePath) => {
  if (filePath == null) {
    return new Promise((resolve, reject) => {
      reject(`Filepath isn't valid: [${filePath}]`);
    });
  }

  const retryAttempts = 10;

  for (let i = 0; i < retryAttempts; i++) {
    // try {
    const result = await doesPathExist(filePath);
    if (result === true) {
      // console.log(`successfully reached ${filePath}!`);
      return new Promise((resolve) => {
        resolve();
      });
    } else {
      // console.log(`failed to reach ${filePath}, attempt `, i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  return new Promise((resolve, reject) => {
    reject(`Couldn't reach ${filePath} (tried ${retryAttempts} times and gave up)`);
  });
};

const generateFakeAuditFile = (tempFolder) => {
  return {
    keep: {
      days: false,
      amount: 5,
    },
    auditLog: `./${tempFolder}/${fileLogLevel}-audit.json`,
    files: [
      {
        date: 1733783410178,
        name: `${tempFolder}/2024-12-01-sf.log`,
        hash: `${crypto
          .createHash("sha256")
          .update(tempFolder + "/2024-12-01-sf.log" + "LOG_FILE" + "1733783410178")
          .digest("hex")}`,
      },
      {
        date: 1733783410178,
        name: `${tempFolder}/2024-12-02-sf.log`,
        hash: `${crypto
          .createHash("sha256")
          .update(tempFolder + "/2024-12-02-sf.log" + "LOG_FILE" + "1733783410178")
          .digest("hex")}`,
      },
      {
        date: 1733783410178,
        name: `${tempFolder}/2024-12-03-sf.log`,
        hash: `${crypto
          .createHash("sha256")
          .update(tempFolder + "/2024-12-03-sf.log" + "LOG_FILE" + "1733783410178")
          .digest("hex")}`,
      },
    ],
    hashType: "sha256",
  };
};

describe("doesPathExist()", () => {
  it("correctly identifies paths that exist", async () => {
    const path = "package.json";
    const result = await doesPathExist(path);
    expect(result).toEqual(true);
  });
  it("correctly identifies paths that do not exist", async () => {
    const path = "foobar";
    const result = await doesPathExist(path);
    expect(result).toEqual(false);
  });
});

describe("winston file basics", () => {
  let tempFolder;
  beforeAll(async () => {
    await createFilePath().then(
      (data) => {
        // console.log("beforeAll() successfully created folder: ", data);
        tempFolder = data;
      },
      () => {
        // error
        // console.log("beforeAll() failed to create folder because: ", err);
      }
    );
    await tryFilePath(tempFolder);
  }, 30000);

  afterAll(async () => {
    await deleteFilePath(tempFolder);
  }, 30000);

  it("can access the newly made temp folder", async () => {
    await doesPathExist(tempFolder).then((response) => {
      expect(response).toEqual(true);
    });
  });

  it("can start a splunk forwarder that can also reach the newly made temp folder", async () => {
    const port = generatePortNumber();
    const command = generateLogCommand({
      LOG_DIR_NAME: `./${tempFolder}`,
      PORT: port,
      SERVICE_PORT: port,
    });
    // console.log("command: ", command)
    await startLocalForwarderWith(command);
    const testPath = `${tempFolder}/${fileLogLevel}-audit.json`;
    await tryFilePath(testPath);
    const result = await doesPathExist(testPath);
    expect(result).toEqual(true);
  }, 30000);
});

describe("winston logrotate", () => {
  const fakeWinstonLogFile = "{}{}";
  let tempFolder;

  //In order to test the logrotate functionality, it's necessary to create logs with timestamps in the past
  //The easiest way to do this is for Winston to handle the timestamps automatically under the hood
  //Unfortunately, I couldn't find a way to mock the system clock in a way Winston would honor
  //So I ended up manually creating the past logs for these tests
  //Reference: https://github.com/rogerc/file-stream-rotator/blob/e3ad4149758aab55241125962f4e5ee593f151d8/src/AuditManager.ts#L66
  //Sorry if it gets flaky later

  beforeEach(async () => {
    await createFilePath().then(
      (data) => {
        // console.log("beforeAll() successfully created folder: ", data);
        tempFolder = data;
      },
      () => {
        // error
        // console.log("beforeAll() failed to create folder because: ", err);
      }
    );
    await tryFilePath(tempFolder);
  }, 30000);

  afterEach(async () => {
    await deleteFilePath(tempFolder);
  }, 30000);

  it("logrotates when logs exceed maximum files", async () => {
    //note that max_files is set to one in the command
    //that means logrotate should delete all but one of the logs
    //(which will be the one it generates when it boots up)
    const port = generatePortNumber();
    const command = generateLogCommand({
      LOG_DIR_NAME: `./${tempFolder}`,
      PORT: port,
      SERVICE_PORT: port,
      MAX_FILES: 1,
    });

    const fakeWinstonAuditFile = generateFakeAuditFile(tempFolder);

    await fs.promises.writeFile(`${tempFolder}/2024-12-01-sf.log`, fakeWinstonLogFile, (err) => {
      if (err) console.log(err);
    });
    await fs.promises.writeFile(`${tempFolder}/2024-12-02-sf.log`, fakeWinstonLogFile, (err) => {
      if (err) console.log(err);
    });
    await fs.promises.writeFile(`${tempFolder}/2024-12-03-sf.log`, fakeWinstonLogFile, (err) => {
      if (err) console.log(err);
    });

    await fs.promises.writeFile(
      `${tempFolder}/${fileLogLevel}-audit.json`,
      JSON.stringify(fakeWinstonAuditFile),
      (err) => {
        if (err) console.log(err);
      }
    );

    //check that all manual files created successfully
    await doesPathExist(`${tempFolder}/2024-12-01-sf.log`).then((response) => {
      expect(response).toEqual(true);
    });
    await doesPathExist(`${tempFolder}/2024-12-02-sf.log`).then((response) => {
      expect(response).toEqual(true);
    });
    await doesPathExist(`${tempFolder}/2024-12-03-sf.log`).then((response) => {
      expect(response).toEqual(true);
    });
    await doesPathExist(`${tempFolder}/${fileLogLevel}-audit.json`).then((response) => {
      expect(response).toEqual(true);
    });

    //start log forwarder
    await startLocalForwarderWith(command);
    const localForwarderUrl = `http://localhost:${port}`;
    await tryServer(localForwarderUrl, "GET");

    // optional timeout if the test becomes flaky
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    //check that the logrotate removed the correct files
    await doesPathExist(`${tempFolder}/2024-12-01-sf.log`).then((response) => {
      expect(response).toEqual(false);
    });
    await doesPathExist(`${tempFolder}/2024-12-02-sf.log`).then((response) => {
      expect(response).toEqual(false);
    });
    await doesPathExist(`${tempFolder}/2024-12-03-sf.log`).then((response) => {
      expect(response).toEqual(false);
    });
    await doesPathExist(`${tempFolder}/${fileLogLevel}-audit.json`).then((response) => {
      expect(response).toEqual(true);
    });
  }, 30000);

  it("does not logrotate when logs are below maximum files", async () => {
    //note that in this example, the max_files is set to 5
    //which means this test should not delete any previous log files
    const port = generatePortNumber();
    const command = generateLogCommand({
      LOG_DIR_NAME: `./${tempFolder}`,
      PORT: port,
      SERVICE_PORT: port,
      MAX_FILES: 5,
    });

    const fakeWinstonAuditFile = generateFakeAuditFile(tempFolder);

    await fs.promises.writeFile(`${tempFolder}/2024-12-01-sf.log`, fakeWinstonLogFile, (err) => {
      if (err) console.log(err);
    });
    await fs.promises.writeFile(`${tempFolder}/2024-12-02-sf.log`, fakeWinstonLogFile, (err) => {
      if (err) console.log(err);
    });
    await fs.promises.writeFile(`${tempFolder}/2024-12-03-sf.log`, fakeWinstonLogFile, (err) => {
      if (err) console.log(err);
    });

    await fs.promises.writeFile(
      `${tempFolder}/${fileLogLevel}-audit.json`,
      JSON.stringify(fakeWinstonAuditFile),
      (err) => {
        if (err) console.log(err);
      }
    );

    //check that all manual files created successfully
    await doesPathExist(`${tempFolder}/2024-12-01-sf.log`).then((response) => {
      expect(response).toEqual(true);
    });
    await doesPathExist(`${tempFolder}/2024-12-02-sf.log`).then((response) => {
      expect(response).toEqual(true);
    });
    await doesPathExist(`${tempFolder}/2024-12-03-sf.log`).then((response) => {
      expect(response).toEqual(true);
    });
    await doesPathExist(`${tempFolder}/${fileLogLevel}-audit.json`).then((response) => {
      expect(response).toEqual(true);
    });

    //start log forwarder
    await startLocalForwarderWith(command);
    const localForwarderUrl = `http://localhost:${port}`;
    await tryServer(localForwarderUrl, "GET");

    // optional timeout if the test becomes flaky
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    //check that the logrotate removed the correct files
    await doesPathExist(`${tempFolder}/2024-12-01-sf.log`).then((response) => {
      expect(response).toEqual(true);
    });
    await doesPathExist(`${tempFolder}/2024-12-02-sf.log`).then((response) => {
      expect(response).toEqual(true);
    });
    await doesPathExist(`${tempFolder}/2024-12-03-sf.log`).then((response) => {
      expect(response).toEqual(true);
    });
    await doesPathExist(`${tempFolder}/${fileLogLevel}-audit.json`).then((response) => {
      expect(response).toEqual(true);
    });
  }, 30000);
});
