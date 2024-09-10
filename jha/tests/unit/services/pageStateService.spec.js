import pageStateService from "@/services/page-state-service";
import { enrolmentRoutes } from "@/router/routes";
import { cloneDeep } from "lodash";
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";

const stepRoutes = [
  { ...enrolmentRoutes.MSP_ELIGIBILITY_PAGE },
  { ...enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE },
  { ...enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE },
];

//only use for passing. for assertions, use pages[] path
const testPath = stepRoutes[0].path;

describe("pageStateService test", () => {
  beforeEach(() => {
    pageStateService.pages = [];
    pageStateService.importPageRoutes(cloneDeep(stepRoutes));
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("imports a defined service", () => {
    expect(pageStateService).toBeDefined();
  });
});

describe("pageStateService importPageRoutes()", () => {
  beforeEach(() => {
    pageStateService.pages = [];
    pageStateService.importPageRoutes(cloneDeep(stepRoutes));
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("sets PageStateService pages array to routes", () => {
    expect(pageStateService.pages).not.toEqual([]);
  });

  it("sets isVisited to false for all routes", () => {
    expect(pageStateService.pages[0].isVisited).toBe(false);
  });
});

describe("setPageIncomplete()", () => {
  beforeEach(() => {
    pageStateService.pages = [];
    pageStateService.importPageRoutes(cloneDeep(stepRoutes));
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("sets to incomplete", () => {
    expect(pageStateService.pages[0].isComplete).toBeUndefined();
    pageStateService.setPageIncomplete(testPath);
    expect(pageStateService.pages[0].isComplete).toBe(false);
  });
});

describe("setPageComplete()", () => {
  beforeEach(() => {
    pageStateService.pages = [];
    pageStateService.importPageRoutes(cloneDeep(stepRoutes));
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("sets to complete", () => {
    expect(pageStateService.pages[0].isComplete).toBeUndefined();
    pageStateService.setPageComplete(testPath);
    expect(pageStateService.pages[0].isComplete).toBe(true);
  });
});

describe("isPageComplete()", () => {
  beforeEach(() => {
    pageStateService.pages = [];
    pageStateService.importPageRoutes(cloneDeep(stepRoutes));
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns true if isComplete equals true", () => {
    pageStateService.pages[0].isComplete = true;
    const result = pageStateService.isPageComplete(testPath);
    expect(result).toBe(true);
  });

  it("returns false if isComplete equals false", () => {
    pageStateService.pages[0].isComplete = false;
    const result = pageStateService.isPageComplete(testPath);
    expect(result).toBe(false);
  });
});

describe("visitPage()", () => {
  beforeEach(() => {
    pageStateService.pages = [];
    pageStateService.importPageRoutes(cloneDeep(stepRoutes));
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("sets isVisited to true for path passed", () => {
    expect(pageStateService.pages[0].isVisited).toBe(false);
    pageStateService.visitPage(testPath);
    expect(pageStateService.pages[0].isVisited).toBe(true);
  });

  it("doesn't break if path not found", () => {
    expect(pageStateService.pages[0].isVisited).toBe(false);
    pageStateService.visitPage("potato");
    expect(pageStateService.pages[0].isVisited).toBe(false);
  });
});

describe("isPageVisited()", () => {
  beforeEach(() => {
    pageStateService.pages = [];
    pageStateService.importPageRoutes(cloneDeep(stepRoutes));
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns false when isVisited is false", () => {
    const result = pageStateService.isPageVisited(testPath);
    expect(result).toBe(false);
  });

  it("returns true when isVisited is true", () => {
    pageStateService.pages[0].isVisited = true;
    const result = pageStateService.isPageVisited(testPath);
    expect(result).toBe(true);
  });

  it("returns undefined when passed a path that doesn't exist", () => {
    const result = pageStateService.isPageVisited("potato");
    expect(result).toBeUndefined();
  });
});
