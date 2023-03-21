import { bcPostalCodeValidator, nameValidator } from "@/helpers/validators";

describe.only("bcPostalCodeValidator()", () => {
  it("returns false when passed no input", async () => {
    expect(bcPostalCodeValidator()).toBe(false);
  });

  it("returns true when passed a valid BC postal code", async () => {
    expect(bcPostalCodeValidator("V8W1L4")).toBe(true);
  });

  it("returns true when passed a valid BC postal code with a space in it", async () => {
    expect(bcPostalCodeValidator("V8W 1L4")).toBe(true);
  });

  it("returns false when passed a postal code that doesn't start with V", async () => {
    expect(bcPostalCodeValidator("A8W1L4")).toBe(false);
  });

  it("returns false when passed a postal code that doesn't start with V and has a space in it", async () => {
    expect(bcPostalCodeValidator("A8W 1L4")).toBe(false);
  });

  it("returns false when passed input containing non-alphanumeric characters", async () => {
    expect(bcPostalCodeValidator("V8W1L@")).toBe(false);
  });

  it("returns false when passed input more than 8 characters long", async () => {
    expect(bcPostalCodeValidator("V8W 1L4AAAAAA")).toBe(false);
  });

  it("returns false when passed input fewer than 6 characters long", async () => {
    expect(bcPostalCodeValidator("V8W1L")).toBe(false);
  });
});

describe("nameValidator()", () => {
  it("returns true when passed no input", async () => {
    expect(nameValidator()).toBe(true);
  });

  it("returns true when passed passing input", async () => {
    expect(nameValidator("Smith")).toBe(true);
  });

  it("returns true when passed certain special characters as long as it starts with a letter", async () => {
    expect(nameValidator("A-.' -.' -.' -.' -.' ")).toBe(true);
  });

  it("returns false when passed certain special characters and it does not start with a letter", async () => {
    expect(nameValidator("-.' -.' -.' -.' -.' ")).toBe(false);
  });

  it("returns false when passed special characters", async () => {
    expect(nameValidator("%%%")).toBe(false);
  });

  it("returns false when passed special characters (2)", async () => {
    expect(nameValidator("¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼¼")).toBe(false);
  });
});
