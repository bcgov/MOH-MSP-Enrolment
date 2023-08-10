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

describe("SuppBenData getters totalHouseholdIncome()", () => {
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

describe("SuppBenData getters ah65Deduction()", () => {
  it("returns 0 when passed null values", async () => {
    result.ahBirthdate = null;
    expect(result.ah65Deduction).toEqual(0);
  });

  it("returns 0 when passed number below 65", async () => {
    const testBirthDate = new Date();
    const testYear = new Date().getFullYear() - 64;
    testBirthDate.setFullYear(testYear);
    result.ahBirthdate = testBirthDate;
    expect(result.ah65Deduction).toEqual(0);
  });

  it("returns non-zero value when passed number 65 or higher", async () => {
    const testBirthDate = new Date();
    testBirthDate.setFullYear(new Date().getFullYear() - 65);
    result.ahBirthdate = testBirthDate;
    expect(result.ah65Deduction).not.toEqual(0);
  });
});

describe("SuppBenData getters spouseDeduction()", () => {
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

describe("SuppBenData getters spouse65Deduction()", () => {
  it("returns 0 when passed null values", async () => {
    result.spouseBirthdate = null;
    expect(result.spouse65Deduction).toEqual(0);
  });

  it("returns 0 when passed number below 65", async () => {
    const testBirthDate = new Date();
    const testYear = new Date().getFullYear() - 64;
    testBirthDate.setFullYear(testYear);
    result.spouseBirthdate = testBirthDate;
    expect(result.spouse65Deduction).toEqual(0);
  });

  it("returns non-zero value when passed number 65 or higher", async () => {
    const testBirthDate = new Date();
    testBirthDate.setFullYear(new Date().getFullYear() - 65);
    result.spouseBirthdate = testBirthDate;
    expect(result.spouse65Deduction).not.toEqual(0);
  });
});

describe("SuppBenData getters childDeduction()", () => {
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

describe("SuppBenData getters claimedChildCareExpensesReduction()", () => {
  it("returns zero when child care expenses are zero", async () => {
    result.claimedChildCareExpenses = 0;
    result.numChildren = 1;
    expect(result.claimedChildCareExpensesReduction).toEqual(0);
  });

  it("returns zero when number of children is zero", async () => {
    result.claimedChildCareExpenses = 1;
    result.numChildren = 0;
    expect(result.claimedChildCareExpensesReduction).toEqual(0);
  });

  it("returns expense formula when expenses and children are both greater than zero", async () => {
    const testExpenses = 500;
    result.claimedChildCareExpenses = testExpenses;
    result.numChildren = 1;
    expect(result.claimedChildCareExpensesReduction).toEqual(
      (testExpenses / 2) * -1
    );
  });
});

describe("SuppBenData getters childAdjustedDeduction()", () => {
  it("should return zero when childDeduction and claimedChildCareExpensesReduction are both zero", async () => {
    result.numChildren = 0;
    result.claimedChildCareExpenses = 0;
    expect(result.childAdjustedDeduction).toEqual(0);
  });

  it("should return a positive value when childDeduction > claimedChildCareExpensesReduction", async () => {
    result.numChildren = 1;
    result.claimedChildCareExpenses = 0;
    expect(result.childAdjustedDeduction).toBeGreaterThan(0);
  });

  it("should return zero when childDeduction = claimedChildCareExpensesReduction", async () => {
    //each child (numChildren) adds 3000
    //cCCER subtracts expenses (claimedChildCareExpenses) / 2
    //6000 / 2 = 3000
    //when these two things cancel each other out, function should return zero
    result.numChildren = 1;
    result.claimedChildCareExpenses = 6000;
    expect(result.childAdjustedDeduction).toEqual(0);
  });

  it("should return zero when childDeduction < claimedChildCareExpensesReduction", async () => {
    //similar to the above, if the cCCER vastly outweighs the childDeduction
    //the function should still return zero
    result.numChildren = 1;
    result.claimedChildCareExpenses = 12000;
    expect(result.childAdjustedDeduction).toEqual(0);
  });
});

describe("SuppBenData getters ahDisabilityCreditDeduction()", () => {
  it("returns a nonzero value if everything's correct ", async () => {
    //hasDisabilityCredit needs to be Y and selectedDisabilityRecipients needs to contain "ah"
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["ah"];
    expect(result.ahDisabilityCreditDeduction).not.toEqual(0);
  });

  it("returns 0 if hasDisabilityCredit does not equal Y", async () => {
    result.hasDisabilityCredit = "N";
    result.selectedDisabilityRecipients = ["ah"];
    expect(result.ahDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if selectedDisabilityRecipients is empty", async () => {
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = [];
    expect(result.ahDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if selectedDisabilityRecipients doesn't contain 'ah'", async () => {
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["potato"];
    expect(result.ahDisabilityCreditDeduction).toEqual(0);
  });
});

describe("SuppBenData getters spouseDisabilityCreditDeduction()", () => {
  it("returns a nonzero value if everything's correct ", async () => {
    //hasDisabilityCredit needs to be Y and selectedDisabilityRecipients needs to contain "spouse"
    //hasSpouse also needs to be Y
    result.hasSpouse = "Y";
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["spouse"];
    expect(result.spouseDisabilityCreditDeduction).not.toEqual(0);
  });

  it("returns 0 if hasSpouse does not equal Y", async () => {
    result.hasSpouse = "N";
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["spouse"];
    expect(result.spouseDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if hasDisabilityCredit does not equal Y", async () => {
    result.hasSpouse = "Y";
    result.hasDisabilityCredit = "N";
    result.selectedDisabilityRecipients = ["spouse"];
    expect(result.spouseDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if selectedDisabilityRecipients is empty", async () => {
    result.hasSpouse = "Y";
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = [];
    expect(result.spouseDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if selectedDisabilityRecipients doesn't contain 'ah'", async () => {
    result.hasSpouse = "Y";
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["potato"];
    expect(result.spouseDisabilityCreditDeduction).toEqual(0);
  });
});

describe("SuppBenData getters childDisabilityCreditDeduction()", () => {
  it("returns a nonzero value if everything's correct ", async () => {
    result.numChildren = 1;
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["child"];
    result.numDisabilityChildren = 1;
    expect(result.childDisabilityCreditDeduction).not.toEqual(0);
  });

  it("returns a nonzero value multiplied by the number of disability children", async () => {
    result.numChildren = 3;
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["child"];
    result.numDisabilityChildren = 2;
    expect(result.childDisabilityCreditDeduction).toEqual(6000);
  });

  it("returns 0 if number of children is not greater than 0", async () => {
    result.numChildren = 0;
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["child"];
    result.numDisabilityChildren = 1;
    expect(result.childDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if hasDisabilityCredit does not equal Y", async () => {
    result.numChildren = 1;
    result.hasDisabilityCredit = "N";
    result.selectedDisabilityRecipients = ["child"];
    result.numDisabilityChildren = 1;
    expect(result.childDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if selectedDisabilityRecipients is empty", async () => {
    result.numChildren = 1;
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = [];
    result.numDisabilityChildren = 1;
    expect(result.childDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if selectedDisabilityRecipients doesn't contain 'child'", async () => {
    result.numChildren = 1;
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["potato"];
    result.numDisabilityChildren = 1;
    expect(result.childDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if number of disability children is not greater than 0", async () => {
    result.numChildren = 1;
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["child"];
    result.numDisabilityChildren = 0;
    expect(result.childDisabilityCreditDeduction).toEqual(0);
  });

  it("returns 0 if number of disability children greater than number of children", async () => {
    result.numChildren = 1;
    result.hasDisabilityCredit = "Y";
    result.selectedDisabilityRecipients = ["child"];
    result.numDisabilityChildren = 2;
    expect(result.childDisabilityCreditDeduction).toEqual(0);
  });
});

describe("SuppBenData getters rdspDeduction()", () => {
  it("returns test amount when hasRDSP is Y and RDSPamount > 0", async () => {
    result.hasRDSP = "Y";
    const testAmount = 500;
    result.rdspAmount = testAmount;
    expect(result.rdspDeduction).toEqual(testAmount);
  });

  it("returns zero when hasRDSP is N and RDSPamount > 0", async () => {
    result.hasRDSP = "N";
    result.rdspAmount = 0;
    expect(result.rdspDeduction).toEqual(0);
  });

  it("returns zero when hasRDSP is Y and RDSPamount = 0", async () => {
    result.hasRDSP = "Y";
    result.rdspAmount = 0;
    expect(result.rdspDeduction).toEqual(0);
  });
});

describe("SuppBenData getters ahAttendantNursingDeduction()", () => {
  it("returns a nonzero value if everything's correct ", async () => {
    //hasAttendantNursingExpenses needs to be Y and selectedAttendantNursingRecipients needs to contain "ah"
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["ah"];
    expect(result.ahAttendantNursingDeduction).not.toEqual(0);
  });

  it("returns 0 if hasAttendantNursingExpenses does not equal Y", async () => {
    result.hasAttendantNursingExpenses = "N";
    result.selectedAttendantNursingRecipients = ["ah"];
    expect(result.ahAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if selectedAttendantNursingRecipients is empty", async () => {
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = [];
    expect(result.ahAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if selectedAttendantNursingRecipients doesn't contain 'ah'", async () => {
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["potato"];
    expect(result.ahAttendantNursingDeduction).toEqual(0);
  });
});

describe("SuppBenData getters spouseAttendantNursingDeduction()", () => {
  it("returns a nonzero value if everything's correct ", async () => {
    //hasAttendantNursingExpenses needs to be Y and selectedAttendantNursingRecipients needs to contain "spouse"
    //hasSpouse also needs to be Y
    result.hasSpouse = "Y";
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["spouse"];
    expect(result.spouseAttendantNursingDeduction).not.toEqual(0);
  });

  it("returns 0 if hasSpouse does not equal Y", async () => {
    result.hasSpouse = "N";
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["spouse"];
    expect(result.spouseAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if hasAttendantNursingExpenses does not equal Y", async () => {
    result.hasSpouse = "Y";
    result.hasAttendantNursingExpenses = "N";
    result.selectedAttendantNursingRecipients = ["spouse"];
    expect(result.spouseAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if selectedAttendantNursingRecipients is empty", async () => {
    result.hasSpouse = "Y";
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = [];
    expect(result.spouseAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if selectedAttendantNursingRecipients doesn't contain 'ah'", async () => {
    result.hasSpouse = "Y";
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["potato"];
    expect(result.spouseAttendantNursingDeduction).toEqual(0);
  });
});

describe("SuppBenData getters childAttendantNursingDeduction()", () => {
  it("returns a nonzero value if everything's correct ", async () => {
    result.numChildren = 1;
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["child"];
    result.numAttendantNursingChildren = 1;
    expect(result.childAttendantNursingDeduction).not.toEqual(0);
  });

  it("returns a nonzero value multiplied by the number of AttendantNursing children", async () => {
    result.numChildren = 3;
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["child"];
    result.numAttendantNursingChildren = 2;
    expect(result.childAttendantNursingDeduction).toEqual(6000);
  });

  it("returns 0 if number of children is not greater than 0", async () => {
    result.numChildren = 0;
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["child"];
    result.numAttendantNursingChildren = 1;
    expect(result.childAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if hasAttendantNursingExpenses does not equal Y", async () => {
    result.numChildren = 1;
    result.hasAttendantNursingExpenses = "N";
    result.selectedAttendantNursingRecipients = ["child"];
    result.numAttendantNursingChildren = 1;
    expect(result.childAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if selectedAttendantNursingRecipients is empty", async () => {
    result.numChildren = 1;
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = [];
    result.numAttendantNursingChildren = 1;
    expect(result.childAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if selectedAttendantNursingRecipients doesn't contain 'child'", async () => {
    result.numChildren = 1;
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["potato"];
    result.numAttendantNursingChildren = 1;
    expect(result.childAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if number of AttendantNursing children is not greater than 0", async () => {
    result.numChildren = 1;
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["child"];
    result.numAttendantNursingChildren = 0;
    expect(result.childAttendantNursingDeduction).toEqual(0);
  });

  it("returns 0 if number of AttendantNursing children greater than number of children", async () => {
    result.numChildren = 1;
    result.hasAttendantNursingExpenses = "Y";
    result.selectedAttendantNursingRecipients = ["child"];
    result.numAttendantNursingChildren = 2;
    expect(result.childAttendantNursingDeduction).toEqual(0);
  });
});

describe("SuppBenData getters totalDeductions()", () => {
  it("returns zero when the data adds up to zero", async () => {
    jest
      .spyOn(SuppBenData.prototype, "ah65Deduction", "get")
      .mockReturnValueOnce(0);
    jest
      .spyOn(SuppBenData.prototype, "spouseDeduction", "get")
      .mockReturnValueOnce(0);
    jest
      .spyOn(SuppBenData.prototype, "spouse65Deduction", "get")
      .mockReturnValueOnce(0);
    jest
      .spyOn(SuppBenData.prototype, "childAdjustedDeduction", "get")
      .mockReturnValueOnce(0);
    jest
      .spyOn(SuppBenData.prototype, "ahDisabilityCreditDeduction", "get")
      .mockReturnValueOnce(0);
    jest
      .spyOn(SuppBenData.prototype, "spouseDisabilityCreditDeduction", "get")
      .mockReturnValueOnce(0);
    jest
      .spyOn(SuppBenData.prototype, "childDisabilityCreditDeduction", "get")
      .mockReturnValueOnce(0);
    jest
      .spyOn(SuppBenData.prototype, "ahAttendantNursingDeduction", "get")
      .mockReturnValueOnce(0);
    jest
      .spyOn(SuppBenData.prototype, "spouseAttendantNursingDeduction", "get")
      .mockReturnValueOnce(0);
    jest
      .spyOn(SuppBenData.prototype, "childAttendantNursingDeduction", "get")
      .mockReturnValueOnce(0);

    expect(result.totalDeductions).toEqual(0);
  });

  it("returns the total of all deductions", async () => {
    jest
      .spyOn(SuppBenData.prototype, "ah65Deduction", "get")
      .mockReturnValueOnce(500);
    jest
      .spyOn(SuppBenData.prototype, "spouseDeduction", "get")
      .mockReturnValueOnce(500);
    jest
      .spyOn(SuppBenData.prototype, "spouse65Deduction", "get")
      .mockReturnValueOnce(500);
    jest
      .spyOn(SuppBenData.prototype, "childAdjustedDeduction", "get")
      .mockReturnValueOnce(500);
    jest
      .spyOn(SuppBenData.prototype, "ahDisabilityCreditDeduction", "get")
      .mockReturnValueOnce(500);
    jest
      .spyOn(SuppBenData.prototype, "spouseDisabilityCreditDeduction", "get")
      .mockReturnValueOnce(500);
    jest
      .spyOn(SuppBenData.prototype, "childDisabilityCreditDeduction", "get")
      .mockReturnValueOnce(500);
    jest
      .spyOn(SuppBenData.prototype, "ahAttendantNursingDeduction", "get")
      .mockReturnValueOnce(500);
    jest
      .spyOn(SuppBenData.prototype, "spouseAttendantNursingDeduction", "get")
      .mockReturnValueOnce(500);
    jest
      .spyOn(SuppBenData.prototype, "childAttendantNursingDeduction", "get")
      .mockReturnValueOnce(500);

    expect(result.totalDeductions).toEqual(5000);
  });
});

describe("SuppBenData getters adjustedIncome()", () => {
  it("returns totalHouseholdIncome - totalDeductions, as long as the former > the latter", async () => {
    jest
      .spyOn(SuppBenData.prototype, "totalHouseholdIncome", "get")
      .mockReturnValueOnce(5500);
    jest
      .spyOn(SuppBenData.prototype, "totalDeductions", "get")
      .mockReturnValueOnce(5000);

    expect(result.adjustedIncome).toEqual(500);
  });

  it("returns zero when totalHouseholdIncome <= totalDeductions", async () => {
    jest
      .spyOn(SuppBenData.prototype, "totalHouseholdIncome", "get")
      .mockReturnValueOnce(5000);
    jest
      .spyOn(SuppBenData.prototype, "totalDeductions", "get")
      .mockReturnValueOnce(5500);

    expect(result.adjustedIncome).toEqual(0);
  });
});

describe("SuppBenData getters incomeUnderThreshold()", () => {
  it("returns true when adjusted income <= qualification threshold", async () => {
    jest
      .spyOn(SuppBenData.prototype, "adjustedIncome", "get")
      .mockReturnValueOnce(5000);
    result.qualificationThreshhold = 5500;

    expect(result.incomeUnderThreshold).toEqual(true);
  });

  it("returns false when adjusted income > qualification threshold", async () => {
    jest
      .spyOn(SuppBenData.prototype, "adjustedIncome", "get")
      .mockReturnValueOnce(5500);
    result.qualificationThreshhold = 5000;

    expect(result.incomeUnderThreshold).toEqual(false);
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
