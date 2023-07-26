import mixin from "@/mixins/page-content-mixin";

describe("mixin methods", () => {
  it("returns 0 when the offsets all add up to 0", async () => {
    jest.spyOn(document, "querySelector").mockImplementation((selector) => {
      switch (selector) {
        case "header":
          return { offsetHeight: 0 };
        case "footer":
          return { offsetHeight: 0 };
        case ".progress-bar-component":
          return { offsetHeight: 0 };
        case ".continue-bar":
          return { offsetHeight: 0 };
      }
    });
    expect(mixin.methods.getPageContentDeltaHeight()).toBe(0);
  });

  it("returns 100 when the offsets all add up to 100", async () => {
    jest.spyOn(document, "querySelector").mockImplementation((selector) => {
      switch (selector) {
        case "header":
          return { offsetHeight: 10 };
        case "footer":
          return { offsetHeight: 20 };
        case ".progress-bar-component":
          return { offsetHeight: 30 };
        case ".continue-bar":
          return { offsetHeight: 40 };
      }
    });
    expect(mixin.methods.getPageContentDeltaHeight()).toBe(100);
  });
});
