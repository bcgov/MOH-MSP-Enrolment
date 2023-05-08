import { formatCurrencyNumber } from "@/helpers/fpc-helpers";

describe("formatCurrencyNumber()", () => {
  it("returns $0 when passed no input", async () => {
    expect(formatCurrencyNumber()).toBe("$0");
  });

  it("returns $0 when passed non-numerical input", async () => {
    expect(formatCurrencyNumber("a")).toBe("$0");
  });

  it("returns input with a dollar sign in front when passed numerical input", async () => {
    expect(formatCurrencyNumber(3)).toBe("$3");
    expect(formatCurrencyNumber(3.01)).toBe("$3.01");
  });

  it("adds commas to large numbers", async () => {
    expect(formatCurrencyNumber(314159)).toBe("$314,159");
  });

  it("cuts off decimals at two digits", async () => {
    expect(formatCurrencyNumber(31.314159)).toBe("$31.31");
  });
});
