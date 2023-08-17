import {
  birthDatePastValidator,
  birthDateYouthValidator,
  birthDateStudentValidator,
  beforeBirthdateValidator,
  dateOrderValidator,
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
  //second argument also needs to be an object containing a date object under the key "birthDate"

  const testDate = new Date();
  const testYear = new Date().getFullYear() - 20;
  testDate.setFullYear(testYear);

  const earlierTestDate = new Date();
  const earlierTestYear = new Date().getFullYear() - 25;
  earlierTestDate.setFullYear(earlierTestYear);

  it("returns true if first argument is blank", async () => {
    expect(beforeBirthdateValidator(null, { birthDate: testDate })).toBe(true);
  });

  it("returns true when passed the same date twice", async () => {
    expect(beforeBirthdateValidator(testDate, { birthDate: testDate })).toBe(
      true
    );
  });

  it("returns false when passed earlier date first", async () => {
    expect(
      beforeBirthdateValidator(earlierTestDate, { birthDate: testDate })
    ).toBe(false);
  });

  it("returns true when passed earlier date second", async () => {
    expect(
      beforeBirthdateValidator(testDate, { birthDate: earlierTestDate })
    ).toBe(true);
  });
});

describe("dateOrderValidator()", () => {
  it("returns false if passed two null arguments", async () => {
    expect(dateOrderValidator(null, null)).toBe(false);
  });

  //the rest of these tests need the second argument to have certain data
  //or else the function breaks

  const testDate = new Date();
  const testYear = new Date().getFullYear() - 20;
  testDate.setFullYear(testYear);

  const earlierTestDate = new Date();
  const earlierTestYear = new Date().getFullYear() - 25;
  earlierTestDate.setFullYear(earlierTestYear);

  it("returns true if passed test date and test object full of null values", async () => {
    const testObject = {
      birthDate: null,
      canadaArrivalDate: null,
      recentBCMoveDate: null,
    };
    expect(dateOrderValidator(testDate, testObject)).toBe(true);
  });

  it("returns true if passed test date and test object full of null values", async () => {
    const testObject = {
      birthDate: testDate,
      canadaArrivalDate: null,
      recentBCMoveDate: null,
    };
    expect(dateOrderValidator(testDate, testObject)).toBe(true);
  });

  it("returns false if passed first argument date later than birthDate", async () => {
    const testObject = {
      birthDate: testDate,
      canadaArrivalDate: null,
      recentBCMoveDate: null,
    };
    expect(dateOrderValidator(earlierTestDate, testObject)).toBe(false);
  });

  it("returns true if passed first argument date earlier than birthDate and null canadaArrivalDate", async () => {
    const testObject = {
      birthDate: earlierTestDate,
      canadaArrivalDate: null,
      recentBCMoveDate: testDate,
    };
    expect(dateOrderValidator(testDate, testObject)).toBe(true);
  });

  it("returns true if passed first argument date earlier than birthDate and null recentBCMoveDate", async () => {
    const testObject = {
      birthDate: earlierTestDate,
      canadaArrivalDate: testDate,
      recentBCMoveDate: null,
    };
    expect(dateOrderValidator(testDate, testObject)).toBe(true);
  });

  it("returns true if present canadaArrivalDate + recentBCMoveDate, and canadaArrivalDate is earlier", async () => {
    const testObject = {
      birthDate: null,
      canadaArrivalDate: earlierTestDate,
      recentBCMoveDate: testDate,
    };
    expect(dateOrderValidator(testDate, testObject)).toBe(true);
  });

  it("returns false if present canadaArrivalDate + recentBCMoveDate, and canadaArrivalDate is later", async () => {
    const testObject = {
      birthDate: null,
      canadaArrivalDate: testDate,
      recentBCMoveDate: earlierTestDate,
    };
    expect(dateOrderValidator(testDate, testObject)).toBe(false);
  });

  it("returns true if present canadaArrivalDate + recentBCMoveDate, and both dates match", async () => {
    const testObject = {
      birthDate: null,
      canadaArrivalDate: testDate,
      recentBCMoveDate: testDate,
    };
    expect(dateOrderValidator(testDate, testObject)).toBe(true);
  });
});
