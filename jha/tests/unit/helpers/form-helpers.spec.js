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

describe("copyPowerOfAttorneyDocuments()", () => {
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
  const documentStructureObject = {
    isApplyingForMSP: true,
    isApplyingForFPCare: true,
    isApplyingForSuppBen: true,
  };

  const documentStructureArray = [
    { description: "Power Of Attorney Supporting Documents" },
    { description: "Power Of Attorney Supporting Documents2" },
  ];

  it("returns an object containing three properties", async () => {
    const result = copyPowerOfAttorneyDocuments({}, []);
    expect(typeof result).toBe("object");
    expect(Object.keys(result).length).toEqual(3);
  });

  it("returns an object with specific key values when passed required input", async () => {
    const result = copyPowerOfAttorneyDocuments(
      documentStructureObject,
      documentStructureArray
    );
    expect(Object.keys(result).sort()).toEqual(
      [
        "fpcPowerOfAttorneyDocuments",
        "mspPowerOfAttorneyDocuments",
        "sbPowerOfAttorneyDocuments",
      ].sort()
    );
  });

  it("returns specifically formatted child objects when passed required input", async () => {
    const result = copyPowerOfAttorneyDocuments(
      documentStructureObject,
      documentStructureArray
    );

    //long story short, the result should contain an object with three values, one for each application
    //each application (msp, fpc, and sb) should contain an array
    //each array should contain two objects, since the template has two documents
    //each document object should contain a description matching the description passed to it initially

    //msp expectations
    expect(result.mspPowerOfAttorneyDocuments[0]).toBeTruthy();
    expect(typeof result.mspPowerOfAttorneyDocuments[0]).toBe("object");
    expect(result.mspPowerOfAttorneyDocuments[0].description).toEqual(
      documentStructureArray[0].description
    );
    expect(result.mspPowerOfAttorneyDocuments[1]).toBeTruthy();
    expect(typeof result.mspPowerOfAttorneyDocuments[1]).toBe("object");
    expect(result.mspPowerOfAttorneyDocuments[1].description).toEqual(
      documentStructureArray[1].description
    );
    expect(result.mspPowerOfAttorneyDocuments[2]).toBeUndefined();

    //fpc expectations
    expect(result.fpcPowerOfAttorneyDocuments[0]).toBeTruthy();
    expect(typeof result.fpcPowerOfAttorneyDocuments[0]).toBe("object");
    expect(result.fpcPowerOfAttorneyDocuments[0].description).toEqual(
      documentStructureArray[0].description
    );
    expect(result.fpcPowerOfAttorneyDocuments[1]).toBeTruthy();
    expect(typeof result.fpcPowerOfAttorneyDocuments[1]).toBe("object");
    expect(result.fpcPowerOfAttorneyDocuments[1].description).toEqual(
      documentStructureArray[1].description
    );
    expect(result.fpcPowerOfAttorneyDocuments[2]).toBeUndefined();

    //sb expectations
    expect(result.sbPowerOfAttorneyDocuments[0]).toBeTruthy();
    expect(typeof result.sbPowerOfAttorneyDocuments[0]).toBe("object");
    expect(result.sbPowerOfAttorneyDocuments[0].description).toEqual(
      documentStructureArray[0].description
    );
    expect(result.sbPowerOfAttorneyDocuments[1]).toBeTruthy();
    expect(typeof result.sbPowerOfAttorneyDocuments[1]).toBe("object");
    expect(result.sbPowerOfAttorneyDocuments[1].description).toEqual(
      documentStructureArray[1].description
    );
    expect(result.sbPowerOfAttorneyDocuments[2]).toBeUndefined();
  });

  it("returns specifically formatted child objects when passed required input (2)", async () => {
    //similar test to before but with different passed values and different numbers of documents
    const result = copyPowerOfAttorneyDocuments(
      {
        isApplyingForMSP: true,
        isApplyingForFPCare: false,
        isApplyingForSuppBen: false,
      },
      [
        { description: "Power Of Attorney Supporting Documents" },
        { description: "Power Of Attorney Supporting Documents2" },
        { description: "Power Of Attorney Supporting Documents3" },
      ]
    );


    //msp expectations
    expect(result.mspPowerOfAttorneyDocuments[0]).toBeTruthy();
    expect(typeof result.mspPowerOfAttorneyDocuments[0]).toBe("object");
    expect(result.mspPowerOfAttorneyDocuments[0].description).toEqual(
      documentStructureArray[0].description
    );
    expect(result.mspPowerOfAttorneyDocuments[1]).toBeTruthy();
    expect(typeof result.mspPowerOfAttorneyDocuments[1]).toBe("object");
    expect(result.mspPowerOfAttorneyDocuments[1].description).toEqual(
      documentStructureArray[1].description
    );
    expect(result.mspPowerOfAttorneyDocuments[2]).toBeTruthy();
    expect(typeof result.mspPowerOfAttorneyDocuments[2]).toBe("object");
    expect(result.mspPowerOfAttorneyDocuments[2].description).toEqual(
      "Power Of Attorney Supporting Documents3"
    );
    expect(result.mspPowerOfAttorneyDocuments[3]).toBeUndefined();

    //fpc expectations
    expect(result.fpcPowerOfAttorneyDocuments[0]).toBeUndefined();

    //sb expectations
    expect(result.sbPowerOfAttorneyDocuments[0]).toBeUndefined();
  });
});
