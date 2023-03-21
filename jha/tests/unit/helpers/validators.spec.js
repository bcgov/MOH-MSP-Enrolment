import { bcPostalCodeValidator, nameValidator, yesValidator, nonBCValidator } from "@/helpers/validators";

describe("bcPostalCodeValidator()", () => {
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

describe("yesValidator()", () => {
  it("returns false when passed no input", async () => {
    expect(yesValidator()).toBe(false);
  });

  it("returns true when passed the letter Y", async () => {
    expect(yesValidator("Y")).toBe(true);
  });

  it("returns false when passed the letter N", async () => {
    expect(yesValidator("N")).toBe(false);
  });

  it("returns false when passed a non-alphanumeric input", async () => {
    expect(yesValidator("%")).toBe(false);
  });
});

describe.only("nonBCValidator()", () => {
  it("returns true when passed no input", async () => {
    expect(nonBCValidator()).toBe(true);
  });

  it("returns false when passed the letters BC", async () => {
    expect(nonBCValidator("BC")).toBe(false);
  });

  it("returns false when passed 'British Columbia'", async () => {
    expect(nonBCValidator("British Columbia")).toBe(false);
  });

  it("returns true when passed the letters AB", async () => {
    expect(nonBCValidator("AB")).toBe(true);
  });

  it("returns true when passed 'Alberta'", async () => {
    expect(nonBCValidator("Alberta")).toBe(true);
  });

  it("returns true when passed non-alphanumeric characters", async () => {
    expect(nonBCValidator("#$%$#")).toBe(true);
  });
});

// describe("yesValidator()", () => {
//   it("returns false when passed no input", async () => {
//     expect(yesValidator()).toBe(false);
//   });
// });