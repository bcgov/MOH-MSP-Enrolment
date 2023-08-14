import { birthDatePastValidator } from "../../../../src/components/enrolment/Child.vue";

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
