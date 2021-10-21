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
};
