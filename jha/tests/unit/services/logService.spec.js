import logService from "@/services/log-service";
import axios from "axios";

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(() => {
    return Promise.resolve();
  }),
}));

const spyOnAxiosPost = jest.spyOn(axios, "post");

const spyOnSendLog = jest.spyOn(logService, "_sendLog");

const mockResponse = {};

axios.post.mockImplementation(() => Promise.resolve(mockResponse));

describe("LogService", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("logSubmission calls _sendLog()", () => {
    logService.logSubmission("1", "2", "3");
    expect(spyOnSendLog).toHaveBeenCalledWith("info", "1", "2", "3");
  });

  it("logError calls _sendLog()", () => {
    logService.logError("1", "2");
    expect(spyOnSendLog).toHaveBeenCalledWith("error", "1", "2");
  });

  it("logInfo calls _sendLog()", () => {
    logService.logInfo("1", "2");
    expect(spyOnSendLog).toHaveBeenCalledWith("info", "1", "2");
  });

  it("logNavigation calls _sendLog()", () => {
    logService.logNavigation("1", "2", "3");
    expect(spyOnSendLog).toHaveBeenCalled();
  });
});

describe("LogService _sendLog", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("calls axios", () => {
    logService.logSubmission("1", "2", "3");
    expect(spyOnAxiosPost).toHaveBeenCalled();
  });
});
