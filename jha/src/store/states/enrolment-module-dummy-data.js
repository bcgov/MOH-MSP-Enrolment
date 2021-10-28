import { SupportDocumentTypes } from '../../constants/document-types';
import {
  CanadianStatusReasons,
  StatusInCanada,
} from '../../constants/immigration-status-types';

export default {
  // Account Holder info.
  ahFirstName: 'John',
  ahMiddleName: 'Herbert',
  ahLastName: 'Doe',
  ahBirthdate: new Date('1989-01-01'),
  ahSIN: '123 456 789',
  ahGender: 'M',
  ahCitizenshipStatus: StatusInCanada.Citizen,
  ahCitizenshipStatusReason: CanadianStatusReasons.LivingInBCWithoutMSP,
  ahCitizenshipSupportDocumentType: SupportDocumentTypes.CanadianBirthCertificate,
  ahCitizenshipSupportDocuments: [{}],
  ahIsNameChanged: 'N',
  ahNameChangeSupportDocumentType: null,
  ahNameChangeSupportDocuments: [],
  ahHasLivedInBCSinceBirth: 'Y',
  ahIsMovedToBCPermanently: 'Y',
  ahMoveFromOrigin: 'USA',
  ahArrivalDateInBC: new Date('2021-10-15'),
  ahArrivalDateInCanada: new Date('2021-10-15'),
  ahIsOutsideBCLast12Months: 'N',
  ahOutsideBCLast12MonthsReason: null,
  ahOutsideBCLast12MonthsLocation: null,
  ahOutsideBCLast12MonthsDepartureDate: null,
  ahOutsideBCLast12MonthsReturnDate: null,
  ahHasPreviousPHN: 'Y',
  ahPreviousPHN: '9999 999 998',
  ahIsReleasedFromArmedForces: 'N',
  ahArmedForcesDischargeDate: null,
  ahIsStudent: 'Y',
  ahWillStudentResideInBC: 'Y',
  // ContactInfoPage
  resAddressLine1: '1234 White House Ln.',
  resAddressLine2: null,
  resAddressLine3: null,
  resCity: 'Victoria',
  resProvince: "British Columbia",
  resCountry: "Canada",
  resPostalCode: "V8P 1A1",
  mailAddressLine1: '1234 Black House Ln.',
  mailAddressLine2: null,
  mailAddressLine3: null,
  mailCity: 'Vancouver',
  mailProvince: "British Columbia",
  mailCountry: "Canada",
  mailPostalCode: 'V5T 4T4',
  isMailSame: false,
  phone: null,
};
