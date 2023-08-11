import { isPastPath, isEQPath, enrolmentRouteStepOrder, eqRoutes } from "@/router/routes";

describe("isPastPath()", () => {
  it("returns false when passed no input", async () => {
    expect(isPastPath()).toBe(false);
  });

  it("returns false when passed a toPath that comes after a fromPath", async () => {
    //argument order: (toPath, fromPath)
    expect(
      isPastPath(enrolmentRouteStepOrder[2].path, enrolmentRouteStepOrder[1].path)
    ).toBe(false);
  });
  it("returns false when passed a nonsense toPath and valid fromPath", async () => {
    //argument order: (toPath, fromPath)
    expect(isPastPath("potato", enrolmentRouteStepOrder[2].path)).toBe(false);
  });

  it("returns true when passed a nonsense fromPath and valid toPath", async () => {
    //argument order: (toPath, fromPath)
    expect(isPastPath(enrolmentRouteStepOrder[1].path, "potato")).toBe(true);
  });
  it("returns true when passed a toPath that comes after a fromPath", async () => {
    //argument order: (toPath, fromPath)
    expect(
      isPastPath(enrolmentRouteStepOrder[1].path, enrolmentRouteStepOrder[2].path)
    ).toBe(true);
  });
  it("returns false when passed two nonsense paths", async () => {
    //argument order: (toPath, fromPath)
    expect(isPastPath("potato", "potato")).toBe(false);
  });
});

describe("isEQPath()", () => {
  it("returns false when passed no input", async () => {
    expect(isEQPath()).toBe(false);
  });
  it("returns false when passed input that's not in eqRoutes", async () => {
    expect(isEQPath("potato")).toBe(false);
  });
  it("returns false when passed an object with data that is in eqRoutes", async () => {
    expect(isEQPath(eqRoutes[1])).toBe(false);
  });
  it("returns true when passed a path name that is contained within an object in eqRoutes", async () => {
    expect(isEQPath(eqRoutes[1].path)).toBe(true);
  });
});
