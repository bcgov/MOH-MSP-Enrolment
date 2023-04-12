import {
  isCorrespondenceAttachedAbleToSubmit,
  copyPowerOfAttorneyDocuments,
} from "@/helpers/form-helpers";

describe("isCorrespondenceAttachedAbleToSubmit()", () => {
  it("returns false when passed no input", async () => {
    expect(isCorrespondenceAttachedAbleToSubmit()).toBe(true);
  });

  it("returns false when passed C", async () => {
    expect(isCorrespondenceAttachedAbleToSubmit("C")).toBe(false);
  });

  it("returns true when passed N", async () => {
    expect(isCorrespondenceAttachedAbleToSubmit("N")).toBe(true);
  });

  it("returns false when passed B", async () => {
    expect(isCorrespondenceAttachedAbleToSubmit("B")).toBe(false);
  });
});

describe.only("copyPowerOfAttorneyDocuments()", () => {
  //function needs to be passed an object and an array or it throws an error
  //return format:
  // {
  //   mspPowerOfAttorneyDocuments: [ {...}, {...}],
  //   fpcPowerOfAttorneyDocuments: [ {...}, {...}],
  //   sbPowerOfAttorneyDocuments: [ {...}, {...}],
  // }
  //return format (only one):
  // {
  //   mspPowerOfAttorneyDocuments: [ {...}, {...}],
  //   fpcPowerOfAttorneyDocuments: [],
  //   sbPowerOfAttorneyDocuments: [],
  // }

  it("returns an object containing three properties", async () => {
    const result = copyPowerOfAttorneyDocuments({}, []);
    expect(typeof result).toBe("object");
    expect(Object.keys(result).length).toEqual(3);
  });

  it.only("returns an object when passed required input", async () => {
    const result = copyPowerOfAttorneyDocuments(
      {
        isApplyingForMSP: true,
        isApplyingForFPCare: true,
        isApplyingForSuppBen: true,
      },
      [
        { description: "Power Of Attorney Supporting Documents" },
        { description: "Power Of Attorney Supporting Documents2" },
      ]
    );
    console.log("kumquat", result);
    expect(typeof result).toBe("object");
    expect(Object.keys(result).length).toEqual(3);
    expect(Object.keys(result).sort()).toEqual(['foo', 'biz'].sort());

  });
});
