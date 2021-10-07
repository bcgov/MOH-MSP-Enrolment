import { StatusInCanada } from './immigration-status-types';
import { SupportDocumentTypes } from './document-types';

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

export const selectOptionsTemporaryPermitSupportDocuments = [
  {
    value: SupportDocumentTypes.WorkPermit,
    label: SupportDocumentTypes.WorkPermit
  },
  {
    value: SupportDocumentTypes.StudyPermit,
    label: SupportDocumentTypes.StudyPermit
  },
  {
    value: SupportDocumentTypes.ReligiousWorker,
    label: SupportDocumentTypes.ReligiousWorker
  },
  {
    value: SupportDocumentTypes.PassportWithDiplomaticFoil,
    label: SupportDocumentTypes.PassportWithDiplomaticFoil
  },
  {
    value: SupportDocumentTypes.VisitorVisa,
    label: SupportDocumentTypes.VisitorVisa
  },
];
