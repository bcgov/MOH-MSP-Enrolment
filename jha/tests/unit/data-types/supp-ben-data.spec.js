import SuppBenData from "@/data-types/supp-ben-data";

const result = new SuppBenData();

describe("SuppBenData removeCommas()", () => {
  it("returns identical output when passed string without commas", async () => {
    expect(result.removeCommas("a")).toEqual("a");
  });

  it("returns string output with commas removed", async () => {
    expect(result.removeCommas("a,a")).toEqual("aa");
  });

  it("returns identical output when passed numer encased in a string without commas", async () => {
    expect(result.removeCommas("11")).toEqual("11");
  });

  it("returns number encased in a string output with commas removed", async () => {
    expect(result.removeCommas("1,1")).toEqual("11");
  });

  it("returns identical output when passed an array", async () => {
    expect(result.removeCommas([1,"a", "@#$"])).toEqual([1,"a", "@#$"]);
  });

  it("returns identical output when passed an object", async () => {
    expect(result.removeCommas({1:"a", potato: 2})).toEqual({1:"a", potato: 2});
  });
});

describe("SuppBenData stringToInt()", () => {
  it("returns 0 when passed no input", async () => {
    expect(result.stringToInt()).toEqual(0);
  });

  it("returns 0 when passed 0", async () => {
    expect(result.stringToInt(0)).toEqual(0);
  });

  it("returns 0 when passed an array", async () => {
    expect(result.stringToInt([1,"a", "@#$"])).toEqual(0);
  });

  it("returns 0 when passed an object", async () => {
    expect(result.stringToInt({1:"a", potato: 2})).toEqual(0);
  });

  it("returns an integer when passed a number in a string", async () => {
    expect(result.stringToInt("0")).toEqual(0);
  });

  it("returns an integer when passed a number in a string (non-zero)", async () => {
    expect(result.stringToInt("31415")).toEqual(31415);
  });

  it("returns identical output when passed non-string numbers", async () => {
    expect(result.stringToInt(31415)).toEqual(31415);
  });

  it("returns an abbreviated number when passed a float encased in a string", async () => {
    expect(result.stringToInt("31.415")).toEqual(31);
  });
});

describe("SuppBenData stringToFloat()", () => {
  it("returns 0 when passed no input", async () => {
    expect(result.stringToFloat()).toEqual(0);
  });

  it("returns 0 when passed 0", async () => {
    expect(result.stringToFloat(0)).toEqual(0);
  });

  it("returns 0 when passed an array", async () => {
    expect(result.stringToFloat([1,"a", "@#$"])).toEqual(0);
  });

  it("returns 0 when passed an object", async () => {
    expect(result.stringToFloat({1:"a", potato: 2})).toEqual(0);
  });

  it("returns an integer when passed a number in a string", async () => {
    expect(result.stringToFloat("0")).toEqual(0);
  });

  it("returns an integer when passed a number in a string (non-zero)", async () => {
    expect(result.stringToFloat("31415")).toEqual(31415);
  });

  it("returns identical output when passed non-string numbers", async () => {
    expect(result.stringToFloat(31415)).toEqual(31415);
  });

  it("returns a float when passed a float encased in a string", async () => {
    expect(result.stringToFloat("31.415")).toEqual(31.415);
  });
});

// describe("new Supp Ben Data structure", () => {
//   it("returns false when passed no input", async () => {
//     expect(result).toEqual({});
//   });
// });
