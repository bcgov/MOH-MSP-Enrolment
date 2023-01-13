import { nameValidator } from "@/helpers/validators";

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
