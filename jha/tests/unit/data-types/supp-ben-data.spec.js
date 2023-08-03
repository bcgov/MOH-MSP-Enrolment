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

describe ("SuppBenData getters totalHouseholdIncome()", () => {
  it("returns 0 when passed null values", async () => {
    result.ahIncome = null;
    result.hasSpouse = null;
    result.spouseIncome = null;
    expect(result.totalHouseholdIncome).toEqual(0);
  });

  it("returns ah income + spouse income total when hasSpouse = Y", async () => {
    result.ahIncome = 1;
    result.hasSpouse = "Y";
    result.spouseIncome = 1;
    expect(result.totalHouseholdIncome).toEqual(2);
  });

  it("returns ah income total alone when hasSpouse = N", async () => {
    result.ahIncome = 1;
    result.hasSpouse = "N";
    result.spouseIncome = 1;
    expect(result.totalHouseholdIncome).toEqual(1);
  });

  it("returns ah income total alone when hasSpouse is falsy", async () => {
    result.ahIncome = 1;
    result.hasSpouse = null;
    result.spouseIncome = 1;
    expect(result.totalHouseholdIncome).toEqual(1);
  });

  it("returns 0 when ah income + spouse income equals zero", async () => {
    result.ahIncome = 0;
    result.hasSpouse = "Y";
    result.spouseIncome = 0;
    expect(result.totalHouseholdIncome).toEqual(0);
  });

  it("returns 0 when ah income + spouse income are less than zero", async () => {
    result.ahIncome = -1;
    result.hasSpouse = "Y";
    result.spouseIncome = -1;
    expect(result.totalHouseholdIncome).toEqual(0);
  });
});

describe ("SuppBenData getters ah65Deduction()", () => {
  it("returns 0 when passed null values", async () => {
    result.ahBirthdate = null;
    expect(result.ah65Deduction).toEqual(0);
  });

  it("returns 0 when passed number below 65", async () => {
    const testBirthDate = new Date();
    const testYear = new Date().getFullYear() - 64;
    testBirthDate.setFullYear(testYear)
    result.ahBirthdate = testBirthDate;
    expect(result.ah65Deduction).toEqual(0);
  });

  it("returns non-zero value when passed number 65 or higher", async () => {
    const testBirthDate = new Date();
    testBirthDate.setFullYear(new Date().getFullYear() - 65)
    result.ahBirthdate = testBirthDate;
    expect(result.ah65Deduction).not.toEqual(0);
  });
});

describe ("SuppBenData getters spouseDeduction()", () => {
  //the hasSpouse setter changes Y to true and N to false
  it("returns 0 when relevant value is null", async () => {
    result.hasSpouse = null;
    expect(result.spouseDeduction).toEqual(0);
  });

  it("returns non-zero value when relevant value is true", async () => {
    result.hasSpouse = "Y";
    expect(result.spouseDeduction).not.toEqual(0);
  });

  it("returns 0 when relevant value is false", async () => {
    result.hasSpouse = "N";
    expect(result.spouseDeduction).toEqual(0);
  });

  it("returns 0 when relevant value is anything other than Y/N", async () => {
    result.hasSpouse = "potato";
    expect(result.spouseDeduction).toEqual(0);
  });
});

describe ("SuppBenData getters spouse65Deduction()", () => {
  it("returns 0 when passed null values", async () => {
    result.spouseBirthdate = null;
    expect(result.spouse65Deduction).toEqual(0);
  });

  it("returns 0 when passed number below 65", async () => {
    const testBirthDate = new Date();
    const testYear = new Date().getFullYear() - 64;
    testBirthDate.setFullYear(testYear)
    result.spouseBirthdate = testBirthDate;
    expect(result.spouse65Deduction).toEqual(0);
  });

  it("returns non-zero value when passed number 65 or higher", async () => {
    const testBirthDate = new Date();
    testBirthDate.setFullYear(new Date().getFullYear() - 65)
    result.spouseBirthdate = testBirthDate;
    expect(result.spouse65Deduction).not.toEqual(0);
  });
});

describe ("SuppBenData getters childDeduction()", () => {
  it("returns 0 when relevant value is null", async () => {
    result.numChildren = null;
    expect(result.childDeduction).toEqual(0);
  });

  it("returns 3000 * 1 when number of children = 1", async () => {
    result.numChildren = 1;
    expect(result.childDeduction).toEqual(3000);
  });

  it("returns 3000 * 2 when number of children = 2", async () => {
    result.numChildren = 2;
    expect(result.childDeduction).toEqual(6000);
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
