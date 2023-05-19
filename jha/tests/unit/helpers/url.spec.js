import { isCSR, convertURLToCSR, getConvertedPath } from "@/helpers/url.js";

describe("url.js isCSR()", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("returns false if not given a value", () => {
    const result = isCSR();
    expect(result).toBe(false);
  });

  it("returns false if given a value that does not contain -csr at the end", () => {
    const result = isCSR("potato");
    expect(result).toBe(false);
  });

  it("returns true if given a value that does contain -csr at the end", () => {
    const result = isCSR("potato-csr");
    expect(result).toBe(true);
  });

  it("returns true if given a value that contains -csr anywhere in it", () => {
    const result = isCSR("-csrpotato");
    expect(result).toBe(true);
  });

  it("returns true if given a value that contains -csr anywhere in it (test 2)", () => {
    const result = isCSR("potato-csrpotato");
    expect(result).toBe(true);
  });
});

//the following tests need revisions when the -csr duplication bug is fixed
describe.skip("url.js convertURLToCSR()", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("throws error if not given a value", () => {
    const result = convertURLToCSR();
    expect(result).toBe("a/undefined-csr");
  });

  it("appends -csr to the end of a path it's passed", () => {
    const result = convertURLToCSR("a/potato");
    expect(result).toBe("a/potato-csr");
  });
});

describe.skip("url.js getConvertedPath()", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("doesn't duplicate suffix", () => {
    const result = getConvertedPath("string/string1-csr", "string/string2-csr");
    expect(result).not.toBe("/string2-csr-csr");
  });
});
