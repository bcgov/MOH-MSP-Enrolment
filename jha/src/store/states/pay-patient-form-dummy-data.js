export default {
  claimCount: '1',

  planReferenceNumber: '1234567890',
  
  phn: '9999 999 998',
  dependentNumber: '66',
  firstName: 'Bob',
  middleInitial: 'H',
  lastName: 'Smith',
  birthDate: new Date('2000-01-01'),

  addressOwner: 'PATIENT',
  unitNumber: '123',
  streetNumber: '321',
  streetName: 'Fake St.',
  city: 'Victoria',
  postalCode: 'V8V 8V8',

  isVehicleAccident: 'Y',
  vehicleAccidentClaimNumber: 'A0000001',

  planReferenceNumberOfOriginalClaim: '321',
  
  medicalServiceClaims: [
    {
      serviceDate: new Date(),
      numberOfServices: '1',
      serviceClarificationCode: 'A1',
      feeItem: 'item',
      amountBilled: '1.00',
      calledStartTime: {
        hour: '08',
        minute: '01'
      },
      renderedFinishTime: {
        hour: '16',
        minute: '05'
      },
      diagnosticCode: '001',
      locationOfService: 'A',
      correspondenceAttached: 'C',
      submissionCode: 'I',
      notes: 'Notes here.',
    }
  ],

  practitionerLastName: 'Doe',
  practitionerFirstName: 'J',
  practitionerPaymentNumber: 'A0001',
  practitionerPractitionerNumber: '22274',
  practitionerFacilityNumber: '12345',
  practitionerSpecialtyCode: 'A1',

  referredByFirstNameInitial: 'R',
  referredByLastName: 'McDonald',
  referredByPractitionerNumber: '22271',

  referredToFirstNameInitial: 'C',
  referredToLastName: 'Lee',
  referredToPractitionerNumber: '22272',
};
