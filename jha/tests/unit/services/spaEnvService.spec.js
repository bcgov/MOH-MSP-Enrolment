import spaEnvService from "@/services/spa-env-service";
import axios from "axios";
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("axios");

const mockResponse = {
  data: {
    SPA_ENV_JHA_MAINTENANCE_FLAG: "false",
    SPA_ENV_JHA_MAINTENANCE_START: "2019-06-30 6:50:00 PM",
    SPA_ENV_JHA_MAINTENANCE_END: "2020-01-24 12:00:00 PM",
    SPA_ENV_JHA_MAINTENANCE_MESSAGE:
      "System will be down from time A to time B.",
  },
  status: 200,
  statusText: "OK",
  request: {},
};

axios.post.mockImplementation(() => Promise.resolve(mockResponse));

describe("SpaEnvService test", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(spaEnvService.loadEnvs()).toBeDefined();
  });
});

describe("SpaEnvService loadEnvs()", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns an object", async () => {
    const result = await expect(spaEnvService.loadEnvs());
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(typeof result).toBe("object");
  });
});
