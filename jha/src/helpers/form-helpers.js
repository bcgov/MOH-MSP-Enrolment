import { v4 as uuidv4 } from "uuid";

export const isCorrespondenceAttachedAbleToSubmit = (
  correspondenceAttached,
) => {
  switch (correspondenceAttached) {
    case "C":
      return false;
    case "N":
      return true;
    case "B":
      return false;
  }
  return true;
};

export const copyPowerOfAttorneyDocuments = (formState, baseDocuments) => {
  const { isApplyingForMSP, isApplyingForFPCare, isApplyingForSuppBen } =
    formState;
  const documents = {
    mspPowerOfAttorneyDocuments: [],
    fpcPowerOfAttorneyDocuments: [],
    sbPowerOfAttorneyDocuments: [],
  };
  if (isApplyingForFPCare)
    documents.fpcPowerOfAttorneyDocuments = baseDocuments.map((document) => ({
      ...document,
      uuid: uuidv4(),
    }));
  if (isApplyingForMSP)
    documents.mspPowerOfAttorneyDocuments = baseDocuments.map((document) => ({
      ...document,
      uuid: uuidv4(),
    }));
  if (isApplyingForSuppBen)
    documents.sbPowerOfAttorneyDocuments = baseDocuments.map((document) => ({
      ...document,
      uuid: uuidv4(),
    }));
  return documents;
};
