import * as scroll from "@/helpers/scroll.js";
import { nextTick } from "vue";

const spyOnWindowScrollTo = jest
  .spyOn(window, "scrollTo")
  .mockImplementation(jest.fn);

const spyOnScrollToElement = jest.spyOn(scroll, "scrollToElement");
const spyOnScrollTo = jest.spyOn(scroll, "scrollTo");

describe("Helper scroll.js scrollTo()", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("calls window.scrollTo() when helperscrollTo() is called", () => {
    scroll.scrollTo(0);
    expect(spyOnWindowScrollTo).toHaveBeenCalled();
  });
});

//unfortunately, due to the nested function calls,
//further testing is not possible without refactoring the source code
//more details available in this SO link:
//https://stackoverflow.com/questions/51269431/jest-mock-inner-function/55193363#55193363
//I've left the half-finished tests skipped below in case somebody gets them working later

describe.skip("Helper scroll.js scrollToError()", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("calls scrollToElement() when scrollToError() is called", async () => {
    jest.useFakeTimers();
    scroll.scrollToError();
    // scroll.scrollToElement();
    jest.advanceTimersByTime(5);
    await nextTick();
    expect(spyOnScrollToElement).toHaveBeenCalled();
  });
});

describe.skip("Helper scroll.js scrollToElement()", () => {
  // const fakeElement = {
  //   getBoundingClientRect: () => {
  //     return {
  //       top: 100,
  //     };
  //   },
  // };

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("returns undefined when scrollToElement() is called without arguments", () => {
    expect(scroll.scrollToElement()).toBeUndefined();
  });

  it("calls spyOnScrollTo when called with an argument", async () => {
    jest.useFakeTimers();
    // scroll.scrollToElement(fakeElement);
    scroll.scrollTo();
    jest.advanceTimersByTime(5);
    await nextTick();
    expect(spyOnScrollTo).toHaveBeenCalled();
  });
});
