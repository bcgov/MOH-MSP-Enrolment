import { StatusInCanada } from './immigration-status-types';
import { SupportDocumentTypes } from './document-types';

export const selectOptionsFamilyMembers = [
  {
    id: 'ah',
    value: 'ah',
    label: 'Myself'
  },
  {
    id: 'spouse',
    value: 'spouse',
    label: 'My spouse/common-law partner'
  },
  {
    id: 'child',
    value: 'child',
    label: 'My child'
  },
];

export const selectOptionsImmigrationStatus = [
  {
    value: StatusInCanada.Citizen,
    label: StatusInCanada.Citizen
  },
  {
    value: StatusInCanada.PermanentResident,
    label: StatusInCanada.PermanentResident
  },
  {
    value: StatusInCanada.TemporaryResident,
    label: StatusInCanada.TemporaryResident
  },
];

export const selectOptionsCitizenshipSupportDocuments = [
  {
    value: SupportDocumentTypes.CanadianBirthCertificate,
    label: SupportDocumentTypes.CanadianBirthCertificate
  },
  {
    value: SupportDocumentTypes.CanadianCitizenCard,
    label: SupportDocumentTypes.CanadianCitizenCard
  },
  {
    value: SupportDocumentTypes.CanadianPassport,
    label: SupportDocumentTypes.CanadianPassport
  },
];

export const selectOptionsPermanentResidentSupportDocuments = [
  {
    value: SupportDocumentTypes.PermanentResidentConfirmation,
    label: SupportDocumentTypes.PermanentResidentConfirmation
  },
  {
    value: SupportDocumentTypes.RecordOfLanding,
    label: SupportDocumentTypes.RecordOfLanding
  },
  {
    value: SupportDocumentTypes.PermanentResidentCard,
    label: SupportDocumentTypes.PermanentResidentCard
  },
];

export const selectOptionWorkPermitSupportDocument = [
  {
    value: SupportDocumentTypes.WorkPermit,
    label: SupportDocumentTypes.WorkPermit
  },
];

export const selectOptionStudyPermitSupportDocument = [
  {
    value: SupportDocumentTypes.StudyPermit,
    label: SupportDocumentTypes.StudyPermit
  },
];

export const selectOptionReligiousWorkSupportDocument = [
  {
    value: SupportDocumentTypes.VisitorVisa,
    label: SupportDocumentTypes.VisitorVisa
  },
];

export const selectOptionDiplomaticFoilSupportDocument = [
  {
    value: SupportDocumentTypes.PassportWithDiplomaticFoil,
    label: SupportDocumentTypes.PassportWithDiplomaticFoil
  },
];

export const selectOptionVisitorVisaSupportDocument = [
  {
    value: SupportDocumentTypes.VisitorVisa,
    label: SupportDocumentTypes.VisitorVisa
  },
];

export const selectOptionsNameChangeSupportDocuments = [
  {
    value: SupportDocumentTypes.MarriageCertificate,
    label: SupportDocumentTypes.MarriageCertificate
  },
  {
    value: SupportDocumentTypes.ChangeOfNameCertificate,
    label: SupportDocumentTypes.ChangeOfNameCertificate
  },
  {
    value: SupportDocumentTypes.DivorceDecree,
    label: SupportDocumentTypes.DivorceDecree
  }
];

export const selectOptionsChildNameChangeSupportDocuments = [
  {
    value: SupportDocumentTypes.ChangeOfNameCertificate,
    label: SupportDocumentTypes.ChangeOfNameCertificate
  },
];
