import { it, describe, expect, beforeEach, afterEach, vi, mock } from "vitest";

const SplunkLoggerTemplate = require("../src/splunklogger.js");

const defaultSettings = {
  token: "foobar",
  cacert: "foobar",
  level: "info",
  url: "https://jsonplaceholder.typicode.com/",
  maxRetries: 3,
  batchInterval: 0,
};

describe("SplunkLogger._disableTimer()", () => {
  let splunkLogger;
  beforeEach(() => {
    splunkLogger = new SplunkLoggerTemplate(defaultSettings);
  });

  it("should not call clearInterval when timerID is null", () => {
    const spy = vi.spyOn(global, "clearInterval");
    splunkLogger._disableTimer();
    expect(splunkLogger._timerID).toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });
  //TO DO: add tests that pass down _timerID to test that clearInterval is called
});

describe("SplunkLogger._enableTimer()", () => {
  let splunkLogger;
  beforeEach(() => {
    splunkLogger = new SplunkLoggerTemplate(defaultSettings);
  });

  it("throws an error when passed a null value", () => {
    expect(() => splunkLogger._enableTimer()).toThrowError();
  });
  it("calls setInterval, sets _timerId when passed a zero", () => {
    const spy = vi.spyOn(global, "setInterval");
    splunkLogger._enableTimer(0);
    expect(splunkLogger._timerID).not.toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("calls setInterval, sets _timerId when passed a positive number", () => {
    const spy = vi.spyOn(global, "setInterval");
    splunkLogger._enableTimer(1);
    expect(splunkLogger._timerID).not.toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("SplunkLogger._initializeConfig()", () => {
  let splunkLogger;
  beforeEach(() => {
    splunkLogger = new SplunkLoggerTemplate(defaultSettings);
  });

  it("throws an error when passed a null value", () => {
    expect(() => splunkLogger._initializeConfig()).toThrowError();
  });
  it("returns a formatted config", () => {
    const result = splunkLogger._initializeConfig(defaultSettings);
    expect(() =>
      splunkLogger._initializeConfig(defaultSettings)
    ).not.toThrowError();
    expect(typeof result).toEqual("object");
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("cacert");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("level");
    expect(result).toHaveProperty("host");
    expect(result).toHaveProperty("path");
    expect(result).toHaveProperty("protocol");
    expect(result).toHaveProperty("port");
    expect(result).toHaveProperty("maxRetries");
    expect(result).toHaveProperty("maxBatchCount");
    expect(result).toHaveProperty("maxBatchSize");
    expect(result).toHaveProperty("batchInterval");
  });
});

describe("SplunkLogger._initializeRequestOptions()", () => {
  let splunkLogger;
  beforeEach(() => {
    splunkLogger = new SplunkLoggerTemplate(defaultSettings);
  });

  it("returns a specifically formatted object", () => {
    const result = splunkLogger._initializeRequestOptions();
    expect(typeof result).toEqual("object");
    expect(result).toHaveProperty("json");
    expect(result).toHaveProperty("strictSSL");
    expect(result).toHaveProperty("headers");
  });
});

describe("SplunkLogger._validateMessage()", () => {
  let splunkLogger;
  beforeEach(() => {
    splunkLogger = new SplunkLoggerTemplate(defaultSettings);
  });

  it("throws an error when passed a null value", () => {
    expect(() => splunkLogger._validateMessage()).toThrowError();
  });
  it("throws an error when passed an undefined value", () => {
    expect(() => splunkLogger._validateMessage(undefined)).toThrowError();
  });
  it("does not throw an error when passed a string", () => {
    expect(() => splunkLogger._validateMessage("foobar")).not.toThrowError();
  });
});

describe("SplunkLogger._initializeMetadata()", () => {
  let splunkLogger;
  beforeEach(() => {
    splunkLogger = new SplunkLoggerTemplate(defaultSettings);
  });

  it("returns an empty object when passed a null value", () => {
    const result = splunkLogger._initializeMetadata();
    expect(typeof result).toEqual("object");
  });
  it("returns specifically formatted object when passed an object", () => {
    const testObject = {
      metadata: {
        time: "111",
        host: "222",
        source: "333",
        sourcetype: "444",
        index: "555",
      },
    };
    const result = splunkLogger._initializeMetadata(testObject);
    expect(typeof result).toEqual("object");
    expect(result.time).toEqual(testObject.metadata.time);
    expect(result.host).toEqual(testObject.metadata.host);
    expect(result.source).toEqual(testObject.metadata.source);
    expect(result.sourcetype).toEqual(testObject.metadata.sourcetype);
    expect(result.index).toEqual(testObject.metadata.index);
  });
});

describe("SplunkLogger._initializeContext()", () => {
  let splunkLogger;
  beforeEach(() => {
    splunkLogger = new SplunkLoggerTemplate(defaultSettings);
  });

  it("throws an error when passed a null value", () => {
    expect(() => splunkLogger._initializeContext()).toThrowError();
  });
  it("throws an error when passed a string", () => {
    expect(() => splunkLogger._initializeContext("foobar")).toThrowError();
  });
  it("throws an error when passed an object missing the message property", () => {
    expect(() => splunkLogger._initializeContext({})).toThrowError();
  });
  it("does not throw an error when passed on object with the message property", () => {
    expect(() =>
      splunkLogger._initializeContext({ message: "" })
    ).not.toThrowError();
  });
  it("returns a specifically formatted object", () => {
    const result = splunkLogger._initializeContext({ message: "" });
    expect(typeof result).toEqual("object");
    expect(result).toHaveProperty("message");
    expect(result).toHaveProperty("severity");
    expect(result).toHaveProperty("metadata");
  });
});

describe("SplunkLogger._makeBody()", () => {
  let splunkLogger;
  beforeEach(() => {
    splunkLogger = new SplunkLoggerTemplate(defaultSettings);
  });

  it("throws an error when passed a null value", () => {
    expect(() => splunkLogger._makeBody()).toThrowError();
  });
  it("does not throw an error when passed a string", () => {
    expect(() => splunkLogger._makeBody("foobar")).not.toThrowError();
  });
  it("returns a specifically formatted object", () => {
    const result = splunkLogger._makeBody("foobar");
    expect(typeof result).toEqual("object");
    expect(result).toHaveProperty("time");
    expect(result).toHaveProperty("event");
  });
});

describe("SplunkLogger._post()", () => {
  vi.mock("request");
  let splunkLogger;
  beforeEach(() => {
    splunkLogger = new SplunkLoggerTemplate(defaultSettings);
  });

  it("throws an error when passed a null value", () => {
    expect(() => splunkLogger._post()).toThrowError();
  });
});

// describe.only("SplunkLogger asdf", () => {
//   let splunkLogger;
//   beforeEach(() => {
//     splunkLogger = new SplunkLoggerTemplate(defaultSettings);
//   });

//   it("throws an error when passed a null value", () => {
//     expect(() => splunkLogger._enableTimer()).toThrowError();
//   });
// });

// SplunkLogger.prototype._post
// SplunkLogger.prototype._sendEvents
// SplunkLogger.prototype.send
// SplunkLogger.prototype.flush
