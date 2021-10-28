import { SupportDocumentTypes } from '../../constants/document-types';
import {
  CanadianStatusReasons,
  StatusInCanada,
} from '../../constants/immigration-status-types';
import { ChildAgeTypes } from '../../constants/child-age-types'

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
  ahCitizenshipSupportDocuments: [],
  ahIsNameChanged: 'N',
  ahNameChangeSupportDocumentType: null,
  ahNameChangeSupportDocuments: [],
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
  // Child info
  hasChildren: true,
  children: [
    {
      collapsed: false,
      ageRange: ChildAgeTypes.Child0To18,
      status: StatusInCanada.Citizen,
      statusReason: CanadianStatusReasons.LivingInBCWithoutMSP,
      citizenshipSupportDocumentType: SupportDocumentTypes.CanadianBirthCertificate,
      citizenshipSupportDocuments: [{}],
      isNameChanged: 'N',
      nameChangeSupportDocumentType: null,
      nameChangeSupportDocuments: [],
      firstName: 'Timothy',
      middleName: null,
      lastName: 'Doe',
      birthDate: new Date('2010-02-02'),
      gender: 'M',
      movedFrom: 'USA',
      arrivalToBCDate: new Date('2010-02-02'),
      arrivalToCanadaDate: new Date('2010-02-02'),
      madePermanentMove: 'Y',
      outsideBCLast12Months: 'N',
      outsideBCLast12MonthsReason: null,
      outsideBCLast12MonthsDestination: null,
      outsideBCLast12MonthsDepartureDate: null,
      outsideBCLast12MonthsReturnDate: null,
      hasPreviousPHN: 'N',
      previousPHN: null,
      schoolName: null,
      schoolAddressLine1: null,
      schoolAddressLine2: null,
      schoolAddressLine3: null,
      schoolCity: null,
      schoolProvinceOrState: null,
      schoolCountry: null,
      schoolPostalCode: null,
      schoolDepartureDate: null,
      schoolCompletionDate: null,
      willResideInBCAfterStudies: null,
    }
  ]
};
