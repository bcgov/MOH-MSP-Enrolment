import { v4 as uuidv4 } from 'uuid';

export const isCorrespondenceAttachedAbleToSubmit = (correspondenceAttached) => {
  switch (correspondenceAttached) {
    case 'C':
      return false;
    case 'N':
      return true;
    case 'B':
      return false;
  }
  return true;
};

export const copyPowerOfAttorneyDocuments = (formState, baseDocuments) => {
  const {
    isApplyingForMSP,
    isApplyingForFPCare,
    isApplyingForSuppBen,
  } = formState;
  const documents = {mspPowerOfAttorneyDocuments: [], fpcPowerOfAttorneyDocuments: [], sbPowerOfAttorneyDocuments: []};
  if (isApplyingForFPCare) documents.fpcPowerOfAttorneyDocuments = baseDocuments.map(document => ({...document, uuid: uuidv4()}));
  if (isApplyingForMSP) documents.mspPowerOfAttorneyDocuments = baseDocuments.map(document => ({...document, uuid: uuidv4()}));
  if (isApplyingForSuppBen) documents.sbPowerOfAttorneyDocuments = baseDocuments.map(document => ({...document, uuid: uuidv4()}));
  return documents;
}

const supportDocumentTitleMap = {
  'Canadian birth certificate': 'Canadian Birth Certificate',
  'Canadian passport': 'Canadian Passport',
  'Canadian citizenship card or certificate (front and back)': 'Canadian Citizenship Card or Certificate (front and back)',
  'BC Driver\'s License': 'BC Driver\'s License',
  'Record of Landing': 'Record of Landing',
  'Permanent Resident card (front and back)': 'Permanent Resident Card (front and back)',
  'Confirmation of Permanent Residence': 'Confirmation of Permanent Residence',
  'Work permit / CUAET': 'Work Permit / CUAET',
  'Study permit': 'Study Permit',
  'Visitor permit': 'Visitor Permit',
  'Passport With Diplomatic Foil': 'Passport With Diplomatic Foil',
  'Marriage Certificate': 'Marriage Certificate',
  'Name Change Certificate / Certificate of Name Change': 'Name Change Certificate / Certificate of Name Change',
  'Religious Worker': 'Religious Worker',
  'Notice Of Decision': 'Notice Of Decision',
  'Diplomatic Passport Acceptance': 'Diplomatic Passport Acceptance',
  'Work In Canada Acceptance': 'Work In Canada Acceptance',
  'Divorce Decree': 'Divorce Decree',
  'Application for Change of Gender Designation (Adult)': 'Application for Change of Gender Designation (Adult)',
  'Application for Change of Gender Designation (Minor)': 'Application for Change of Gender Designation (Minor)',
  'Physician\'s or Psychologist Confirmation of Change of Gender Designation Form': 'Physician\'s or Psychologist Confirmation of Change of Gender Designation Form',
  'Change of Gender Designation, Request for Waiver of Parental Consent':'Change of Gender Designation, Request for Waiver of Parental Consent',
  'Request for Waiver of Parental Consent (minor) (for under 19 years)':'Request for Waiver of Parental Consent (minor) (for under 19 years)',
  'Separation Agreement':'Separation Agreement',
  'Notarized Statement Or Affidavit':'Notarized Statement Or Affidavit',
  'Other':'Other',
}

export const supportDocumentTypeToTitle = (docType) => {
  const title = supportDocumentTitleMap[docType];
  return title || docType;
}