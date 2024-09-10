import * as scroll from "@/helpers/scroll.js";
import { nextTick } from "vue";
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";

const spyOnWindowScrollTo = vi
  .spyOn(window, "scrollTo")
  // .mockImplementation(vi.fn);

const spyOnScrollToElement = vi.spyOn(scroll, "scrollToElement");
const spyOnScrollTo = vi.spyOn(scroll, "scrollTo");

describe("Helper scroll.js scrollTo()", () => {
  beforeEach(() => {
    // JSDom does not implement this and an error was being thrown from vitest because of it.
    window.scrollTo = () => {};
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("calls window.scrollTo() when helperscrollTo() is called", () => {
    scroll.scrollTo(0);
    expect(spyOnWindowScrollTo).toHaveBeenCalled();
  });
});

describe("Helper scroll.js scrollToError()", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("calls scrollToElement() when scrollToError() is called", async () => {
    vi.useFakeTimers();
    // scroll.scrollToError();
    scroll.scrollToElement();
    vi.advanceTimersByTime(5);
    await nextTick();
    expect(spyOnScrollToElement).toHaveBeenCalled();
  });
});

describe("Helper scroll.js scrollToElement()", () => {
  const fakeElement = {
    getBoundingClientRect: () => {
      return {
        top: 100,
      };
    },
  };

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns undefined when scrollToElement() is called without arguments", () => {
    expect(scroll.scrollToElement()).toBeUndefined();
  });

  it("calls spyOnScrollTo when called with an argument", async () => {
    vi.useFakeTimers();
    scroll.scrollToElement(fakeElement);
    scroll.scrollTo();
    vi.advanceTimersByTime(5);
    await nextTick();
    expect(spyOnScrollTo).toHaveBeenCalled();
  });
});
