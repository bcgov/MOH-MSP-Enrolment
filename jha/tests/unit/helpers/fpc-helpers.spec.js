import { formatCurrencyNumber, getCoverageTier } from "@/helpers/fpc-helpers";

describe("formatCurrencyNumber()", () => {
  it("returns $0 when passed no input", async () => {
    expect(formatCurrencyNumber()).toBe("$0");
  });

  it("returns $0 when passed non-numerical input", async () => {
    expect(formatCurrencyNumber("a")).toBe("$0");
  });

  it("returns input with a dollar sign in front when passed numerical input", async () => {
    expect(formatCurrencyNumber(3)).toBe("$3");
    expect(formatCurrencyNumber(3.01)).toBe("$3.01");
  });

  it("adds commas to large numbers", async () => {
    expect(formatCurrencyNumber(314159)).toBe("$314,159");
  });

  it("cuts off decimals at two digits", async () => {
    expect(formatCurrencyNumber(31.314159)).toBe("$31.31");
  });
});

describe("getCoverageTier()", () => {
  const sampleKeys = [
    "deductible",
    "endRange",
    "maximum",
    "pharmaCarePortion",
    "startRange",
  ].sort();
  const sampleData = {
    ahBirthdate: "1967-09-23T07:00:00.000Z",
    spouseBirthdate: "1969-03-08T08:00:00.000Z",
    adjustedIncome: 18000,
    pre1939DeductibleTiers: [
      {
        startRange: 87500.01,
        endRange: 92500,
        deductible: 1800,
        pharmaCarePortion: 75,
        maximum: 2700,
      },
      {
        startRange: 92500.01,
        endRange: 97500,
        deductible: 1900,
        pharmaCarePortion: 75,
        maximum: 2850,
      },
      {
        startRange: 97500.01,
        endRange: 106250,
        deductible: 2000,
        pharmaCarePortion: 75,
        maximum: 3000,
      },
      {
        startRange: 106250.01,
        endRange: 118750,
        deductible: 2250,
        pharmaCarePortion: 75,
        maximum: 3375,
      },
      {
        startRange: 118750.01,
        endRange: 131250,
        deductible: 2500,
        pharmaCarePortion: 75,
        maximum: 3750,
      },
      {
        startRange: 131250.01,
        endRange: 143750,
        deductible: 2750,
        pharmaCarePortion: 75,
        maximum: 4125,
      },
      {
        startRange: 143750.01,
        endRange: 162500,
        deductible: 3000,
        pharmaCarePortion: 75,
        maximum: 4500,
      },
      {
        startRange: 162500.01,
        endRange: 187500,
        deductible: 3500,
        pharmaCarePortion: 75,
        maximum: 5250,
      },
      {
        startRange: 187500.01,
        endRange: 212500,
        deductible: 4000,
        pharmaCarePortion: 75,
        maximum: 6000,
      },
      {
        startRange: 212500.01,
        endRange: 237500,
        deductible: 4500,
        pharmaCarePortion: 75,
        maximum: 6750,
      },
      {
        startRange: 475000.01,
        endRange: 999999999,
        deductible: 10000,
        pharmaCarePortion: 100,
        maximum: 10000,
      },
      {
        startRange: 72500.01,
        endRange: 77500,
        deductible: 1500,
        pharmaCarePortion: 75,
        maximum: 2250,
      },
      {
        startRange: 77500.01,
        endRange: 82500,
        deductible: 1600,
        pharmaCarePortion: 75,
        maximum: 2400,
      },
      {
        startRange: 82500.01,
        endRange: 87500,
        deductible: 1700,
        pharmaCarePortion: 75,
        maximum: 2550,
      },
      {
        startRange: 237500.01,
        endRange: 275000,
        deductible: 5000,
        pharmaCarePortion: 75,
        maximum: 7500,
      },
      {
        startRange: 275000.01,
        endRange: 325000,
        deductible: 6000,
        pharmaCarePortion: 75,
        maximum: 9000,
      },
      {
        startRange: 325000.01,
        endRange: 375000,
        deductible: 7000,
        pharmaCarePortion: 75,
        maximum: 10000,
      },
      {
        startRange: 375000.01,
        endRange: 425000,
        deductible: 8000,
        pharmaCarePortion: 75,
        maximum: 10000,
      },
      {
        startRange: 425000.01,
        endRange: 475000,
        deductible: 9000,
        pharmaCarePortion: 75,
        maximum: 10000,
      },
      {
        startRange: -999999999,
        endRange: 3000,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 3000.01,
        endRange: 5000,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 7000.01,
        endRange: 10000,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 10000.01,
        endRange: 14000,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 14000.01,
        endRange: 18000,
        deductible: 0,
        pharmaCarePortion: 75,
        maximum: 200,
      },
      {
        startRange: 18000.01,
        endRange: 22000,
        deductible: 0,
        pharmaCarePortion: 75,
        maximum: 250,
      },
      {
        startRange: 5000.01,
        endRange: 7000,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 22000.01,
        endRange: 26000,
        deductible: 0,
        pharmaCarePortion: 75,
        maximum: 300,
      },
      {
        startRange: 26000.01,
        endRange: 30000,
        deductible: 0,
        pharmaCarePortion: 75,
        maximum: 350,
      },
      {
        startRange: 30000.01,
        endRange: 33000,
        deductible: 0,
        pharmaCarePortion: 75,
        maximum: 400,
      },
      {
        startRange: 33000.01,
        endRange: 37500,
        deductible: 350,
        pharmaCarePortion: 75,
        maximum: 700,
      },
      {
        startRange: 37500.01,
        endRange: 42500,
        deductible: 400,
        pharmaCarePortion: 75,
        maximum: 800,
      },
      {
        startRange: 42500.01,
        endRange: 47500,
        deductible: 450,
        pharmaCarePortion: 75,
        maximum: 900,
      },
      {
        startRange: 47500.01,
        endRange: 50000,
        deductible: 500,
        pharmaCarePortion: 75,
        maximum: 1000,
      },
      {
        startRange: 50000.01,
        endRange: 52500,
        deductible: 1000,
        pharmaCarePortion: 75,
        maximum: 1500,
      },
      {
        startRange: 52500.01,
        endRange: 57500,
        deductible: 1100,
        pharmaCarePortion: 75,
        maximum: 1650,
      },
      {
        startRange: 57500.01,
        endRange: 62500,
        deductible: 1200,
        pharmaCarePortion: 75,
        maximum: 1800,
      },
      {
        startRange: 62500.01,
        endRange: 67500,
        deductible: 1300,
        pharmaCarePortion: 75,
        maximum: 1950,
      },
      {
        startRange: 67500.01,
        endRange: 72500,
        deductible: 1400,
        pharmaCarePortion: 75,
        maximum: 2100,
      },
    ],
    deductibleTiers: [
      {
        startRange: 45000.01,
        endRange: 48333,
        deductible: 1400,
        pharmaCarePortion: 70,
        maximum: 1875,
      },
      {
        startRange: 48333.01,
        endRange: 51667,
        deductible: 1500,
        pharmaCarePortion: 70,
        maximum: 2000,
      },
      {
        startRange: 51667.01,
        endRange: 55000,
        deductible: 1600,
        pharmaCarePortion: 70,
        maximum: 2150,
      },
      {
        startRange: 55000.01,
        endRange: 58333,
        deductible: 1700,
        pharmaCarePortion: 70,
        maximum: 2275,
      },
      {
        startRange: 58333.01,
        endRange: 61667,
        deductible: 1800,
        pharmaCarePortion: 70,
        maximum: 2400,
      },
      {
        startRange: 61667.01,
        endRange: 65000,
        deductible: 1900,
        pharmaCarePortion: 70,
        maximum: 2550,
      },
      {
        startRange: 250000.01,
        endRange: 283333,
        deductible: 8000,
        pharmaCarePortion: 70,
        maximum: 10000,
      },
      {
        startRange: 283333.01,
        endRange: 316667,
        deductible: 9000,
        pharmaCarePortion: 70,
        maximum: 10000,
      },
      {
        startRange: 316667.01,
        endRange: 999999999,
        deductible: 10000,
        pharmaCarePortion: 100,
        maximum: 10000,
      },
      {
        startRange: -999999999,
        endRange: 1875,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 1875.01,
        endRange: 3125,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 3125.01,
        endRange: 4375,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 4375.01,
        endRange: 6250,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 6250.01,
        endRange: 8750,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 8750.01,
        endRange: 11250,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 11250.01,
        endRange: 13750,
        deductible: 0,
        pharmaCarePortion: 100,
        maximum: 0,
      },
      {
        startRange: 13750.01,
        endRange: 15000,
        deductible: 0,
        pharmaCarePortion: 70,
        maximum: 100,
      },
      {
        startRange: 15000.01,
        endRange: 16250,
        deductible: 0,
        pharmaCarePortion: 70,
        maximum: 200,
      },
      {
        startRange: 16250.01,
        endRange: 18750,
        deductible: 0,
        pharmaCarePortion: 70,
        maximum: 300,
      },
      {
        startRange: 18750.01,
        endRange: 21250,
        deductible: 0,
        pharmaCarePortion: 70,
        maximum: 400,
      },
      {
        startRange: 21250.01,
        endRange: 23750,
        deductible: 0,
        pharmaCarePortion: 70,
        maximum: 500,
      },
      {
        startRange: 23750.01,
        endRange: 26250,
        deductible: 0,
        pharmaCarePortion: 70,
        maximum: 600,
      },
      {
        startRange: 26250.01,
        endRange: 28750,
        deductible: 0,
        pharmaCarePortion: 70,
        maximum: 700,
      },
      {
        startRange: 28750.01,
        endRange: 30000,
        deductible: 0,
        pharmaCarePortion: 70,
        maximum: 800,
      },
      {
        startRange: 30000.01,
        endRange: 31667,
        deductible: 650,
        pharmaCarePortion: 70,
        maximum: 900,
      },
      {
        startRange: 31667.01,
        endRange: 35000,
        deductible: 800,
        pharmaCarePortion: 70,
        maximum: 1150,
      },
      {
        startRange: 35000.01,
        endRange: 38333,
        deductible: 950,
        pharmaCarePortion: 70,
        maximum: 1350,
      },
      {
        startRange: 216667.01,
        endRange: 250000,
        deductible: 7000,
        pharmaCarePortion: 70,
        maximum: 9350,
      },
      {
        startRange: 125000.01,
        endRange: 141667,
        deductible: 4000,
        pharmaCarePortion: 70,
        maximum: 5350,
      },
      {
        startRange: 141667.01,
        endRange: 158333,
        deductible: 4500,
        pharmaCarePortion: 70,
        maximum: 6000,
      },
      {
        startRange: 158333.01,
        endRange: 183333,
        deductible: 5000,
        pharmaCarePortion: 70,
        maximum: 6675,
      },
      {
        startRange: 183333.01,
        endRange: 216667,
        deductible: 6000,
        pharmaCarePortion: 70,
        maximum: 8000,
      },
      {
        startRange: 38333.01,
        endRange: 41667,
        deductible: 1100,
        pharmaCarePortion: 70,
        maximum: 1500,
      },
      {
        startRange: 41667.01,
        endRange: 45000,
        deductible: 1300,
        pharmaCarePortion: 70,
        maximum: 1700,
      },
      {
        startRange: 65000.01,
        endRange: 70833,
        deductible: 2000,
        pharmaCarePortion: 70,
        maximum: 2675,
      },
      {
        startRange: 70833.01,
        endRange: 79167,
        deductible: 2250,
        pharmaCarePortion: 70,
        maximum: 3000,
      },
      {
        startRange: 79167.01,
        endRange: 87500,
        deductible: 2500,
        pharmaCarePortion: 70,
        maximum: 3350,
      },
      {
        startRange: 87500.01,
        endRange: 95833,
        deductible: 2750,
        pharmaCarePortion: 70,
        maximum: 3675,
      },
      {
        startRange: 95833.01,
        endRange: 108333,
        deductible: 3000,
        pharmaCarePortion: 70,
        maximum: 4000,
      },
      {
        startRange: 108333.01,
        endRange: 125000,
        deductible: 3500,
        pharmaCarePortion: 70,
        maximum: 4675,
      },
    ],
  };
  const sample1939Tiers = [
    {
      startRange: 0.0,
      endRange: 1000.0,
      deductible: 1000,
      pharmaCarePortion: 1100,
      maximum: 1200,
    },
    {
      startRange: 1000.01,
      endRange: 2000.0,
      deductible: 1000,
      pharmaCarePortion: 1200,
      maximum: 1200,
    },
  ];
  const sampleDeductibleTiers = [
    {
      startRange: 0.0,
      endRange: 1000.0,
      deductible: 500,
      pharmaCarePortion: 1300,
      maximum: 700,
    },
    {
      startRange: 1000.01,
      endRange: 2000.0,
      deductible: 500,
      pharmaCarePortion: 1400,
      maximum: 700,
    },
  ];

  //this function throws an error when not passed an argument
  //so no test for that scenario

  it("returns null when passed non-object argument", async () => {
    expect(getCoverageTier("a")).toBeNull();
  });

  it("returns null when passed empty object", async () => {
    expect(getCoverageTier({})).toBeNull();
  });

  it("returns null when passed object containing empty values", async () => {
    expect(
      getCoverageTier({
        ahBirthdate: null,
        spouseBirthdate: null,
        adjustedIncome: null,
        pre1939DeductibleTiers: null,
        deductibleTiers: null,
      })
    ).toBeNull();
  });
  it("returns null when passed object containing placeholder values", async () => {
    expect(
      getCoverageTier({
        ahBirthdate: new Date(),
        spouseBirthdate: new Date(),
        adjustedIncome: 1,
        pre1939DeductibleTiers: [],
        deductibleTiers: [],
      })
    ).toBeNull();
  });
  it("returns specifically formatted object when passed object containing placeholder data and non-empty tier arrays", async () => {
    const result = getCoverageTier({
      ahBirthdate: new Date(),
      spouseBirthdate: new Date(),
      adjustedIncome: 1,
      pre1939DeductibleTiers: [
        {
          startRange: 87500.01,
          endRange: 92500,
          deductible: 1800,
          pharmaCarePortion: 75,
          maximum: 2700,
        },
        {
          startRange: 92500.01,
          endRange: 97500,
          deductible: 1900,
          pharmaCarePortion: 75,
          maximum: 2850,
        },
      ],
      deductibleTiers: [
        {
          startRange: 45000.01,
          endRange: 48333,
          deductible: 1400,
          pharmaCarePortion: 70,
          maximum: 1875,
        },
        {
          startRange: 48333.01,
          endRange: 51667,
          deductible: 1500,
          pharmaCarePortion: 70,
          maximum: 2000,
        },
      ],
    });
    expect(typeof result).toBe("object");
    expect(Object.keys(result).length).toEqual(5);
    expect(Object.keys(result).sort()).toEqual(sampleKeys);
    expect(typeof result.startRange).toBe("number");
    expect(typeof result.endRange).toBe("number");
    expect(typeof result.deductible).toBe("number");
    expect(typeof result.pharmaCarePortion).toBe("number");
    expect(typeof result.maximum).toBe("number");
  });
  it("returns specifically formatted object when passed sample data", async () => {
    const result = getCoverageTier(sampleData);
    expect(typeof result).toBe("object");
    expect(Object.keys(result).length).toEqual(5);
    expect(Object.keys(result).sort()).toEqual(sampleKeys);
  });
  it("checks the date of birth and correctly returns result if one of the birth dates is from before 1939", async () => {
    const result = getCoverageTier({
      ahBirthdate: new Date("1938-01-01"),
      spouseBirthdate: new Date("1938-01-01"),
      adjustedIncome: 1500,
      pre1939DeductibleTiers: sample1939Tiers,
      deductibleTiers: sampleDeductibleTiers,
    });
    expect(result.maximum).toEqual(1200);
  });

  it("checks the date of birth and correctly returns result if both birth dates are from after 1939", async () => {
    const result = getCoverageTier({
      ahBirthdate: new Date("1948-01-01"),
      spouseBirthdate: new Date("1948-01-01"),
      adjustedIncome: 1500,
      pre1939DeductibleTiers: sample1939Tiers,
      deductibleTiers: sampleDeductibleTiers,
    });
    expect(result.maximum).toEqual(700);
  });

  it("returns the tier with the highest end range if adjusted income falls outside the tiers", async () => {
    const result = getCoverageTier({
      ahBirthdate: new Date("1948-01-01"),
      spouseBirthdate: new Date("1948-01-01"),
      adjustedIncome: 2500,
      pre1939DeductibleTiers: sample1939Tiers,
      deductibleTiers: sampleDeductibleTiers,
    });
    expect(result.pharmaCarePortion).toEqual(1400);
  });

  it("returns the tier with the highest end range if adjusted income falls outside the tiers (1939 version)", async () => {
    const result = getCoverageTier({
      ahBirthdate: new Date("1938-01-01"),
      spouseBirthdate: new Date("1938-01-01"),
      adjustedIncome: 2500,
      pre1939DeductibleTiers: sample1939Tiers,
      deductibleTiers: sampleDeductibleTiers,
    });
    expect(result.pharmaCarePortion).toEqual(1200);
  });

  it("returns non-1939 deductible tiers if passed two invalid dates of birth", async () => {
    const result = getCoverageTier({
      ahBirthdate: "a",
      spouseBirthdate: "a",
      adjustedIncome: 1500,
      pre1939DeductibleTiers: sample1939Tiers,
      deductibleTiers: sampleDeductibleTiers,
    });
    expect(result.maximum).toEqual(700);
  });
});
