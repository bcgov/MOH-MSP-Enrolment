import {
  birthDatePastValidator,
  birthDateYouthValidator,
  birthDateStudentValidator,
} from "../../../../src/components/enrolment/Child.vue";
import { ChildAgeTypes } from "../../../../src/constants/child-age-types";

describe("birthDatePastValidator()", () => {
  it("returns false when passed no input", async () => {
    expect(birthDatePastValidator()).toBe(false);
  });
  it("returns true when passed current date", async () => {
    const testDate = new Date();
    expect(birthDatePastValidator(testDate)).toBe(true);
  });
  it("returns true when passed a date in the last few decades", async () => {
    const testDate = new Date();
    const testYear = new Date().getFullYear() - 12;
    testDate.setFullYear(testYear);
    expect(birthDatePastValidator(testDate)).toBe(true);
  });
  it("returns false when passed a date in the future", async () => {
    const testDate = new Date();
    const testYear = new Date().getFullYear() + 12;
    testDate.setFullYear(testYear);
    expect(birthDatePastValidator(testDate)).toBe(false);
  });
});

describe("birthDateYouthValidator()", () => {
  //function breaks if not passed an object with an ageRange key
  const testObject = { ageRange: ChildAgeTypes.Child0To18 };

  it("returns true when passed object with a nonsense ageRange", async () => {
    expect(birthDateYouthValidator("", { ageRange: "potato" })).toBe(true);
  });

  it("returns false when passed an empty value", async () => {
    expect(birthDateYouthValidator("", testObject)).toBe(false);
  });

  it("returns false when passed a date 19+ years in the past", async () => {
    const testDate = new Date();
    const testYear = new Date().getFullYear() - 20;
    testDate.setFullYear(testYear);
    expect(birthDateYouthValidator(testDate, testObject)).toBe(false);
  });

  it("returns true when passed a date less than 19 years in the past", async () => {
    const testDate = new Date();
    const testYear = new Date().getFullYear() - 18;
    testDate.setFullYear(testYear);
    expect(birthDateYouthValidator(testDate, testObject)).toBe(true);
  });
});

describe("birthDateStudentValidator()", () => {
  const testDate = new Date();
  const testYear = new Date().getFullYear() - 20;
  testDate.setFullYear(testYear);
  const testObject = { ageRange: ChildAgeTypes.Child19To24 };

  it("returns true when passed object with a nonsense ageRange", async () => {
    expect(birthDateStudentValidator("", { ageRange: "potato" })).toBe(true);
  });

  it("returns false when passed an empty value with a test ageRange", async () => {
    expect(birthDateStudentValidator("", testObject)).toBe(false);
  });

  it("returns false when passed a date 25+ years in the past", async () => {
    const testDate = new Date();
    const testYear = new Date().getFullYear() - 26;
    testDate.setFullYear(testYear);
    expect(birthDateStudentValidator(testDate, testObject)).toBe(false);
  });

  it("returns false when passed a date less than 19 years in the past", async () => {
    const testDate = new Date();
    const testYear = new Date().getFullYear() - 18;
    testDate.setFullYear(testYear);
    expect(birthDateStudentValidator(testDate, testObject)).toBe(false);
  });

  it("returns true when passed a date between 19 and 24 years in the past", async () => {
    const testDate = new Date();
    const testYear = new Date().getFullYear() - 22;
    testDate.setFullYear(testYear);
    expect(birthDateStudentValidator(testDate, testObject)).toBe(true);
  });
});

describe("beforeBirthdateValidator()", () => {
  //function breaks if not passed two arguments

  const testDate = new Date();
  const testYear = new Date().getFullYear() - 20;
  testDate.setFullYear(testYear);

  const earlierTestDate = new Date();
  const earlierTestYear = new Date().getFullYear() - 25;
  earlierTestDate.setFullYear(earlierTestYear);

  it("returns true when passed two empty arguments", async () => {
    expect(birthDateStudentValidator("", "")).toBe(true);
  });

  it("returns true when passed two nonsense strings", async () => {
    expect(birthDateStudentValidator("potato", "potato")).toBe(true);
  });

  it("returns true when passed the same date twice", async () => {
    expect(birthDateStudentValidator(testDate, testDate)).toBe(true);
  });

  it("returns true when passed earlier date first", async () => {
    expect(birthDateStudentValidator(earlierTestDate, testDate)).toBe(true);
  });

  it("returns true when passed earlier date second", async () => {
    expect(birthDateStudentValidator(testDate, earlierTestDate)).toBe(true);
  });
});