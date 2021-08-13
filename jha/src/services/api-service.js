import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { formatISODate } from 'common-lib-vue';
import { isCSR } from '@/helpers/url';

const BASE_API_PATH = '/jha/api/';
const SUBMIT_PAY_PATIENT_APPLICATION_URL = BASE_API_PATH + 'jhaIntegration/payPatientSubmission';
const SUBMIT_PAY_PRACTITIONER_APPLICATION_URL = BASE_API_PATH + 'jhaIntegration/payPractitionerSubmission';
const VALIDATE_APPLICATION_URL = BASE_API_PATH + 'jhaIntegration/validateClaim';

class ApiService {
  validateApplication(token, jsonPayload) {
    jsonPayload.requestUuid = uuidv4();
    return this._sendPostRequest(VALIDATE_APPLICATION_URL, token, jsonPayload);
  }

  submitPayPatientApplication(token, formState) {
    const jsonPayload = {
      applicationUuid: formState.applicationUuid,
      requestUuid: uuidv4(),
      submissionDate: formatISODate(formState.submissionDate) || '',
      isCSR: isCSR(window.location.pathname) ? 'Y' : 'N',
      payPatient: {
        claimCount: formState.claimCount,
        phn: formState.phn || '',
        dependentNumber: formState.dependentNumber || '',
        firstName: formState.firstName || '',
        middleInitial: formState.middleInitial || '',
        lastName: formState.lastName || '',
        birthDate: formatISODate(formState.birthDate) || '',
        addressOwner: formState.addressOwner || '',
        unitNumber: formState.unitNumber || '',
        streetNumber: formState.streetNumber || '',
        streetName: formState.streetName || '',
        city: formState.city || '',
        postalCode: formState.postalCode || '',
        isVehicleAccident: formState.isVehicleAccident || '',
        vehicleAccidentClaimNumber: formState.vehicleAccidentClaimNumber || '',
        planReferenceNumberOfOriginalClaim: formState.planReferenceNumberOfOriginalClaim || '',
        medicalServiceClaims: [],
        practitionerLastName: formState.practitionerLastName || '',
        practitionerFirstName: formState.practitionerFirstName || '',
        practitionerPaymentNumber: formState.practitionerPaymentNumber || '',
        practitionerPractitionerNumber: formState.practitionerPractitionerNumber || '',
        practitionerFacilityNumber: formState.practitionerFacilityNumber || '',
        practitionerSpecialtyCode: formState.practitionerSpecialtyCode || '',
        referredByFirstNameInitial: formState.referredByFirstNameInitial || '',
        referredByLastName: formState.referredByLastName || '',
        referredByPractitionerNumber: formState.referredByPractitionerNumber || '',
        referredToFirstNameInitial: formState.referredToFirstNameInitial || '',
        referredToLastName: formState.referredToLastName || '',
        referredToPractitionerNumber: formState.referredToPractitionerNumber || '',
      }
    };
    for (let i=0; i<formState.medicalServiceClaims.length; i++) {
      const claim = formState.medicalServiceClaims[i];
      jsonPayload.payPatient.medicalServiceClaims.push({
        serviceDate: formatISODate(claim.serviceDate) || '',
        numberOfServices: claim.numberOfServices || '',
        serviceClarificationCode: claim.serviceClarificationCode || '',
        feeItem: claim.feeItem || '',
        amountBilled: claim.amountBilled || '',
        calledStartTime: claim.calledStartTime && claim.calledStartTime.time ? claim.calledStartTime.time : '' ,
        renderedFinishTime: claim.renderedFinishTime && claim.renderedFinishTime.time ? claim.renderedFinishTime.time : '' ,
        diagnosticCode: claim.diagnosticCode || '',
        locationOfService: claim.locationOfService || '',
        correspondenceAttached: claim.correspondenceAttached || '',
        submissionCode: claim.submissionCode || '',
        notes: claim.notes || '',
      });
    }
    return this._sendPostRequest(SUBMIT_PAY_PATIENT_APPLICATION_URL, token, jsonPayload);
  }

  submitPayPractitionerApplication(token, formState) {
    const jsonPayload = {
      applicationUuid: formState.applicationUuid,
      requestUuid: uuidv4(),
      submissionDate: formatISODate(formState.submissionDate) || '',
      isCSR: isCSR(window.location.pathname) ? 'Y' : 'N',
      payPractitioner: {
        medicalServiceClaimsCount: formState.medicalServiceClaimsCount,
        hospitalVisitClaimsCount: formState.hospitalVisitClaimsCount,
        phn: formState.phn || '',
        dependentNumber: formState.dependentNumber || '',
        firstName: formState.firstName || '',
        middleInitial: formState.middleInitial || '',
        lastName: formState.lastName || '',
        birthDate: formatISODate(formState.birthDate) || '',
        isVehicleAccident: formState.isVehicleAccident || '',
        vehicleAccidentClaimNumber: formState.vehicleAccidentClaimNumber || '',
        planReferenceNumberOfOriginalClaim: formState.planReferenceNumberOfOriginalClaim || '',
        coveragePreAuthNumber: formState.coveragePreAuthNumber || '',
        medicalServiceClaims: [],
        hospitalVisitClaims: [],
        practitionerLastName: formState.practitionerLastName || '',
        practitionerFirstName: formState.practitionerFirstName || '',
        practitionerPaymentNumber: formState.practitionerPaymentNumber || '',
        practitionerPractitionerNumber: formState.practitionerPractitionerNumber || '',
        practitionerFacilityNumber: formState.practitionerFacilityNumber || '',
        practitionerSpecialtyCode: formState.practitionerSpecialtyCode || '',
        referredByFirstNameInitial: formState.referredByFirstNameInitial || '',
        referredByLastName: formState.referredByLastName || '',
        referredByPractitionerNumber: formState.referredByPractitionerNumber || '',
        referredToFirstNameInitial: formState.referredToFirstNameInitial || '',
        referredToLastName: formState.referredToLastName || '',
        referredToPractitionerNumber: formState.referredToPractitionerNumber || '',
      }
    };
    for (let i=0; i<formState.medicalServiceClaims.length; i++) {
      const claim = formState.medicalServiceClaims[i];
      jsonPayload.payPractitioner.medicalServiceClaims.push({
        serviceDate: formatISODate(claim.serviceDate) || '',
        numberOfServices: claim.numberOfServices || '',
        serviceClarificationCode: claim.serviceClarificationCode || '',
        feeItem: claim.feeItem || '',
        amountBilled: claim.amountBilled || '',
        calledStartTime: claim.calledStartTime && claim.calledStartTime.time ? claim.calledStartTime.time : '',
        renderedFinishTime: claim.renderedFinishTime && claim.renderedFinishTime.time ? claim.renderedFinishTime.time : '',
        diagnosticCode: claim.diagnosticCode || '',
        locationOfService: claim.locationOfService || '',
        correspondenceAttached: claim.correspondenceAttached || '',
        submissionCode: claim.submissionCode || '',
        notes: claim.notes || '',
      });
    }
    for (let i=0; i<formState.hospitalVisitClaims.length; i++) {
      const claim = formState.hospitalVisitClaims[i];
      jsonPayload.payPractitioner.hospitalVisitClaims.push({
        month: claim.month || '',
        dayFrom: claim.dayFrom || '',
        dayTo: claim.dayTo || '',
        year: claim.year || '',
        numberOfServices: claim.numberOfServices || '',
        serviceClarificationCode: claim.serviceClarificationCode || '',
        feeItem: claim.feeItem || '',
        amountBilled: claim.amountBilled || '',
        diagnosticCode: claim.diagnosticCode || '',
        locationOfService: claim.locationOfService || '',
        correspondenceAttached: claim.correspondenceAttached || '',
        submissionCode: claim.submissionCode || '',
        notes: claim.notes || '',
      });
    }
    return this._sendPostRequest(SUBMIT_PAY_PRACTITIONER_APPLICATION_URL, token, jsonPayload);
  }

  _sendPostRequest(url, token, jsonPayload) {
    const headers = this._getHeaders(token);
    return axios.post(url, jsonPayload, { headers });
  }

  _getHeaders(token) {
    return {
      "Content-Type": "application/json",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token
    }
  }
}

export default new ApiService();
