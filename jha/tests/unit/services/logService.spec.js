import logService from "@/services/log-service";
import axios from "axios";
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("axios");

const spyOnAxiosPost = vi.spyOn(axios, "post");

const spyOnSendLog = vi.spyOn(logService, "_sendLog");

const mockResponse = {};

axios.post.mockImplementation(() => Promise.resolve(mockResponse));

describe("LogService", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
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
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("calls axios", () => {
    logService.logSubmission("1", "2", "3");
    expect(spyOnAxiosPost).toHaveBeenCalled();
  });
});
