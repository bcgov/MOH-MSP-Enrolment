import {
  birthDatePastValidator,
  birthDateYouthValidator,
} from "../../../../src/components/enrolment/Child.vue";
import { ChildAgeTypes } from '../../../../src/constants/child-age-types';

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
  const testObject = {ageRange: ChildAgeTypes.Child0To18}

  it("returns true when passed object with a nonsense ageRange", async () => {
    expect(birthDateYouthValidator("", {ageRange: "potato"})).toBe(true);
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
