import axios from 'axios';
import {
  formatISODate,
  stripPhoneFormatting,
  stripSpaces,
} from 'common-lib-vue';

const BASE_API_PATH = '/ahdc/api/';
const SUBMIT_APPLICATION_URL = BASE_API_PATH + 'jhaIntegration/payPatientSubmission';

class ApiService {
  submitEnrolmentApplication(token, formState) {
    const jsonPayload = {
      applicationUuid: formState.applicationUuid,
      firstName: formState.ahFirstName || '',
      secondName: formState.ahMiddleName || '',
      lastName: formState.ahLastName || '',
      sin: stripSpaces(formState.ahSIN) || '',
      phn: '',
      gender: formState.ahGender || '',
      birthDate: formatISODate(formState.ahBirthdate) || null,
      telephone: stripPhoneFormatting(formState.phone) || '',
      addressLine1: formState.resAddressLine1 || '',
      addressLine2: formState.resAddressLine2 || '',
      addressLine3: formState.resAddressLine3 || '',
      city: formState.resCity || '',
      postalCode: formState.resPostalCode || '',
      provinceOrState: formState.resProvince || '',
      country: formState.resCountry || '',
      authorizedByApplicant: 'Y', // TODO.
      authorizedByApplicantDate: null, // TODO.
      authorizedBySpouse: 'Y', // TODO.
      spouse: null,
    };
    if (formState.hasSpouse === 'Y') {
      jsonPayload.spouse = {
        firstName: formState.spouseFirstName || '',
        secondName: formState.spouseMiddleName || '',
        lastName: formState.spouseLastName || '',
        gender: formState.spouseGender || '',
        birthDate: formatISODate(formState.spouseBirthDate) || null,
        telephone: stripPhoneFormatting(formState.phone) || '',
        sin: stripSpaces(formState.spouseSIN) || '',
        phn: stripSpaces(formState.spousePHN) || '',
      };
    }
    if (formState.isApplyingForMSP) {
      jsonPayload.medicalServicesPlan = {
        uuid: formState.MSPUUID || '',
        citizenshipType: formState.ahCitizenshipStatus || '',
        attachmentUuids: formState.ahNameChangeSupportDocuments.map((image) => image.uuid),
        residencyAttachmentUuids: formState.ahCitizenshipSupportDocuments.map((image) => image.uuid),
        hasPreviousCoverage: formState.ahHasPreviousPHN || '',
        prevPHN: formState.ahPreviousPHN || '',
        hasLivedInBC: formState.ahHasLivedInBCSinceBirth || '',
        prevHealthNumber: formState.ahPreviousHealthNumber || '',
        recentBCMoveDate: formatISODate(formState.ahArrivalDateInBC) || null,
        recentCanadaMoveDate: formatISODate(formState.ahArrivalDateInCanada) || null,
        isPermanentMove: formState.ahIsMovedToBCPermanently || '',
        prevProvinceOrCountry: formState.ahFromProvinceOrCountry || '',
        beenOutsideBCMoreThan: formState.ahIsOutsideBCLast12Months || '',
        departureDate: formatISODate(formState.ahOutsideBCLast12MonthsDepartureDate) || null,
        returnDate: formatISODate(formState.ahOutsideBCLast12MonthsReturnDate) || null,
        familyMemberReason: formState.ahOutsideBCLast12MonthsReason || '',
        destination: formState.ahOutsideBCLast12MonthsLocation || '',
        isFullTimeStudent: formState.ahIsStudent || '',
        isInBCafterStudies: formState.ahWillStudentResideInBC || '',
        armedDischargeDate: formatISODate(formState.ahArmedForcesDischargeDate) || null,
        armedForceInstitutionName: '', // Unknown field that the middleware is collecting.
      };
      // Add mailing address.
      if (!formState.isMailSame) {
        jsonPayload.medicalServicesPlan.mailingAddress = {
          addressLine1: formState.mailAddressLine1 || '',
          addressLine2: formState.mailAddressLine2 || '',
          addressLine3: formState.mailAddressLine3 || '',
          city: formState.mailCity || '',
          postalCode: stripSpaces(formState.mailPostalCode) || '',
          provinceOrState: formState.mailProvince || '',
          country: formState.mailCountry || '',
        };
      }
    }
    return this._sendPostRequest(SUBMIT_APPLICATION_URL, token, jsonPayload);
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
