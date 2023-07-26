import spaEnvService from "@/services/spa-env-service";
import axios from "axios";

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(() => {
    return Promise.resolve();
  }),
}));

const mockResponse = {
  data: {
    SPA_ENV_PPPP_MAINTENANCE_FLAG: "false",
    SPA_ENV_PPPP_MAINTENANCE_START: "2019-06-30 6:50:00 PM",
    SPA_ENV_PPPP_MAINTENANCE_END: "2020-01-24 12:00:00 PM",
    SPA_ENV_PPPP_MAINTENANCE_MESSAGE:
      "System will be down from time A to time B.",
  },
  status: 200,
  statusText: "OK",
  headers: {
    "access-control-allow-credentials": "true",
    "access-control-allow-headers":
      "Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-origin": "https://my.gov.bc.ca",
    "access-control-expose-headers": "Authorization",
    "cache-control": "no-store",
    connection: "close",
    "content-length": "234",
    "content-security-policy":
      "default-src * data: blob: filesystem: 'unsafe-inline' 'unsafe-eval'",
    "content-type": "application/json; charset=utf-8",
    date: "Fri, 01 Oct 2021 22:57:39 GMT",
    etag: 'W/"ea-tzf3/NWQkLPWx1npl0ySoE7ObH0"',
    pragma: "no-cache",
    server: "nginx",
    "strict-transport-security": "max-age=86400; includeSubDomains",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "x-powered-by": "Express",
    "x-xss-protection": "1",
  },
  config: {
    url: "/pppp/api/env",
    method: "post",
    data: null,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
      SPA_ENV_NAME:
        '{"SPA_ENV_PPPP_MAINTENANCE_FLAG":"","SPA_ENV_PPPP_MAINTENANCE_START":"","SPA_ENV_PPPP_MAINTENANCE_END":"","SPA_ENV_PPPP_MAINTENANCE_MESSAGE":""}',
    },
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
  },
  request: {},
};

axios.post.mockImplementation(() => Promise.resolve(mockResponse));

describe("SpaEnvService test", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("renders", () => {
    expect(spaEnvService.loadEnvs()).toBeDefined();
  });
});

describe("SpaEnvService loadEnvs()", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("returns an object", async () => {
    const result = await expect(spaEnvService.loadEnvs());
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(typeof result).toBe("object");
  });
});
