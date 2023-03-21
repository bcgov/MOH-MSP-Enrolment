import {
  bcPostalCodeValidator,
  nameValidator,
  yesValidator,
  nonBCValidator,
  nonCanadaValidator,
  dateDataRequiredValidator,
  dateDataValidator
} from "@/helpers/validators";

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

describe("nonBCValidator()", () => {
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

describe("nonCanadaValidator()", () => {
  it("returns true when passed no input", async () => {
    expect(nonCanadaValidator()).toBe(true);
  });

  it("returns false when passed 'Canada'", async () => {
    expect(nonCanadaValidator("Canada")).toBe(false);
  });

  it("returns true when passed 'United States'", async () => {
    expect(nonCanadaValidator("United States")).toBe(true);
  });

  it("returns true when passed non-alphanumeric characters", async () => {
    expect(nonCanadaValidator("#$%$#")).toBe(true);
  });
});

describe("dateDataRequiredValidator()", () => {
  it("returns false when dateData is not passed", async () => {
    expect(dateDataRequiredValidator().$validator()).toBe(false);
  });

  it("returns false when passed specific dateData", async () => {
    //null year, null day, month can't be a number
    expect(
      dateDataRequiredValidator({
        date: null,
        month: "a",
        day: null,
        year: null,
      }).$validator()
    ).toBe(false);
  });

  it("returns true when passed any other format of dateData", async () => {
    expect(
      dateDataRequiredValidator({
        date: null,
        month: 5,
        day: 1,
        year: 2023,
      }).$validator()
    ).toBe(true);
  });
});

describe("dateDataValidator()", () => {
  it("returns true when dateData is not passed", async () => {
    expect(dateDataValidator().$validator()).toBe(true);
  });

  it("returns true when passed specific dateData", async () => {
    //null year, null day, month can't be a number
    expect(
      dateDataValidator({
        date: null,
        month: "a",
        day: null,
        year: null,
      }).$validator()
    ).toBe(true);
  });

  it("returns false when passed a different specific format of dateData", async () => {
    //the year and day must be present and the month must be a number
    //if at least one of those things is not true and at least one is true, return false
    expect(
      dateDataValidator({
        date: null,
        month: null,
        day: 1,
        year: 2023,
      }).$validator()
    ).toBe(false);
  });

  it("returns false when passed a different specific format of dateData (2)", async () => {
    expect(
      dateDataValidator({
        date: null,
        month: 5,
        day: null,
        year: 2023,
      }).$validator()
    ).toBe(false);
  })

  it("returns false when passed a different specific format of dateData (3)", async () => {
    expect(
      dateDataValidator({
        date: null,
        month: 5,
        day: 1,
        year: null,
      }).$validator()
    ).toBe(false);
  })

  it("returns false when otherwise valid data does not convert to a valid ISODateString", async () => {
    expect(
      dateDataValidator({
        date: null,
        month: 13,
        day: 1,
        year: 2023,
      }).$validator()
    ).toBe(false);
  });

  it("returns false when otherwise valid data does not convert to a valid ISODateString (2)", async () => {
    expect(
      dateDataValidator({
        date: null,
        month: 9,
        day: 32,
        year: 2023,
      }).$validator()
    ).toBe(false);
  });

  it("returns false when otherwise valid data does not convert to a valid ISODateString (3)", async () => {
    //when the 0-based index gets converted to a month digit, the number increments by 1
    //this means 11 becomes December and 12 needs to be invalid
    expect(
      dateDataValidator({
        date: null,
        month: 12,
        day: 32,
        year: 2023,
      }).$validator()
    ).toBe(false);
  });

  it("returns true when given valid data", async () => {
    expect(
      dateDataValidator({
        date: null,
        month: 9,
        day: 13,
        year: 2023,
      }).$validator()
    ).toBe(true);
  });
});

// describe("yesValidator()", () => {
//   it("returns false when passed no input", async () => {
//     expect(yesValidator()).toBe(false);
//   });
// });
