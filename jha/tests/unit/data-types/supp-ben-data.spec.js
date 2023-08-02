import SuppBenData from "@/data-types/supp-ben-data";

const result = new SuppBenData();

describe("SuppBenData getters/setters hasSpouse()", () => {
  it("get hasSpouse() returns Y if yes spouse", async () => {
    result.hasSpouse = "Y";
    expect(result.hasSpouse).toEqual("Y");
  });

  it("get hasSpouse() returns N if no spouse", async () => {
    result.hasSpouse = "N";
    expect(result.hasSpouse).toEqual("N");
  });

  it("get hasSpouse() returns N if given input that's not Y or N", async () => {
    result.hasSpouse = "potato";
    expect(result.hasSpouse).toEqual("N");
  });
});

describe("SuppBenData getters/setters numChildren()", () => {
  it("get numChildren() returns input if passed a string", async () => {
    result.numChildren = "5";
    expect(result.numChildren).toEqual("5");
  });

  it("get numChildren() returns input if passed a number", async () => {
    result.numChildren = 5;
    expect(result.numChildren).toEqual(5);
  });

  it("get numChildren() returns 0 as a string if passed 0 as a string", async () => {
    result.numChildren = "0";
    expect(result.numChildren).toEqual("0");
  });

  it("get numChildren() returns 0 as a number if passed a falsy value", async () => {
    result.numChildren = null;
    expect(result.numChildren).toEqual(0);
  });
});

describe("SuppBenData getters/setters hasDisabilityCredit()", () => {
  it("get hasDisabilityCredit() returns Y if yes credit", async () => {
    result.hasDisabilityCredit = "Y";
    expect(result.hasDisabilityCredit).toEqual("Y");
  });

  it("get hasDisabilityCredit() returns N if no credit", async () => {
    result.hasDisabilityCredit = "N";
    expect(result.hasDisabilityCredit).toEqual("N");
  });

  it("get hasDisabilityCredit() returns N if given input that's not Y or N", async () => {
    result.hasDisabilityCredit = "potato";
    expect(result.hasDisabilityCredit).toEqual("N");
  });
});

describe("SuppBenData getters/setters hasRDSP()", () => {
  it("get hasRDSP() returns Y if yes credit", async () => {
    result.hasRDSP = "Y";
    expect(result.hasRDSP).toEqual("Y");
  });

  it("get hasRDSP() returns N if no credit", async () => {
    result.hasRDSP = "N";
    expect(result.hasRDSP).toEqual("N");
  });

  it("get hasRDSP() returns N if given input that's not Y or N", async () => {
    result.hasRDSP = "potato";
    expect(result.hasRDSP).toEqual("N");
  });
});

describe("SuppBenData getters/setters hasAttendantNursingExpenses()", () => {
  it("get hasAttendantNursingExpenses() returns Y if yes credit", async () => {
    result.hasAttendantNursingExpenses = "Y";
    expect(result.hasAttendantNursingExpenses).toEqual("Y");
  });

  it("get hasAttendantNursingExpenses() returns N if no credit", async () => {
    result.hasAttendantNursingExpenses = "N";
    expect(result.hasAttendantNursingExpenses).toEqual("N");
  });

  it("get hasAttendantNursingExpenses() returns N if given input that's not Y or N", async () => {
    result.hasAttendantNursingExpenses = "potato";
    expect(result.hasAttendantNursingExpenses).toEqual("N");
  });
});

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
    expect(result.removeCommas([1, "a", "@#$"])).toEqual([1, "a", "@#$"]);
  });

  it("returns identical output when passed an object", async () => {
    expect(result.removeCommas({ 1: "a", potato: 2 })).toEqual({
      1: "a",
      potato: 2,
    });
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
    expect(result.stringToInt([1, "a", "@#$"])).toEqual(0);
  });

  it("returns 0 when passed an object", async () => {
    expect(result.stringToInt({ 1: "a", potato: 2 })).toEqual(0);
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
    expect(result.stringToFloat([1, "a", "@#$"])).toEqual(0);
  });

  it("returns 0 when passed an object", async () => {
    expect(result.stringToFloat({ 1: "a", potato: 2 })).toEqual(0);
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
