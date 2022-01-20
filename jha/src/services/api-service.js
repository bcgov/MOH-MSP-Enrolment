import axios from 'axios';
import {
  formatISODate,
  stripPhoneFormatting,
  stripSpaces,
} from 'common-lib-vue';
import { ChildAgeTypes } from '@/constants/child-age-types';

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
      const children = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child0To18);
      const dependents = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child19To24);

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
      };
      if (formState.hasSpouse === 'Y') {
        jsonPayload.medicalServicesPlan.spouse = {
          citizenshipType: formState.spouseStatus || '',
          attachmentUuids: formState.spouseNameChangeSupportDocuments.map((image) => image.uuid),
          residencyAttachmentUuids: formState.spouseCitizenshipSupportDocuments.map((image) => image.uuid),
          hasPreviousCoverage: formState.spouseHasPreviousBCHealthNumber || '',
          prevPHN: stripSpaces(formState.spousePreviousBCHealthNumber) || '',
          hasLivedInBC: formState.spouseLivedInBCSinceBirth || '',
          prevHealthNumber: formState.spousePreviousHealthNumber || '',
          recentBCMoveDate: formatISODate(formState.spouseRecentBCMoveDate) || null,
          recentCanadaMoveDate: formatISODate(formState.spouseCanadaArrivalDate) || null,
          isPermanentMove: formState.spouseMadePermanentMove || '',
          prevProvinceOrCountry: formState.spouseMoveFromOrigin || '',
          beenOutsideBCMoreThan: formState.spouseOutsideBCLast12Months || '',
          departureDate: formatISODate(formState.spouseOutsideBCLast12MonthsDepartureDate) || null,
          returnDate: formatISODate(formState.spouseOutsideBCLast12MonthsReturnDate) || null,
          familyMemberReason: formState.spouseOutsideBCLast12MonthsReason || '',
          destination: formState.spouseOutsideBCLast12MonthsDestination || '',
          isFullTimeStudent: null, // Not a field, but collected by the middleware.
          isInBCafterStudies: null, // Not a field, but collected by the middleware.
          armedDischargeDate: formatISODate(formState.spouseDischargeDate) || null,
        };
      }

      if (formState.hasChildren === 'Y') {
        // Children 0 to 18.
        if (children.length > 0) {
          jsonPayload.medicalServicesPlan.children = children.map((child) => {
            return {
              firstName: child.firstName || '',
              secondName: child.middleName || '',
              lastName: child.lastName || '',
              gender: child.gender || '',
              birthDate: formatISODate(child.birthDate) || null,
              citizenshipType: child.status || '',
              attachmentUuids: child.nameChangeSupportDocuments.map((image) => image.uuid),
              residencyAttachmentUuids: child.citizenshipSupportDocuments.map((image) => image.uuid),
              hasPreviousCoverage: child.hasPreviousBCHealthNumber || '',
              prevPHN: stripSpaces(child.previousBCHealthNumber) || '',
              hasLivedInBC: child.livedInBCSinceBirth || '',
              prevHealthNumber: child.previousHealthNumber || '',
              recentBCMoveDate: formatISODate(child.recentBCMoveDate) || null,
              recentCanadaMoveDate: formatISODate(child.canadaArrivalDate) || null,
              isPermanentMove: child.madePermanentMove || '',
              prevProvinceOrCountry: child.moveFromOrigin || '',
              beenOutsideBCMoreThan: child.outsideBCLast12Months || '',
              departureDate: formatISODate(child.outsideBCLast12MonthsDepartureDate) || null,
              returnDate: formatISODate(child.outsideBCLast12MonthsReturnDate) || null,
              familyMemberReason: child.outsideBCLast12MonthsReason || '',
              destination: child.outsideBCLast12MonthsDestination || '',
              isFullTimeStudent: '', // Not a field, but is collected by the middleware,
              isInBCafterStudies: child.willResideInBCAfterStudies || '',
              armedDischargeDate: formatISODate(child.dischargeDate) || null,
            };
          });
        }

        // Dependents 19 to 24.
        if (dependents.length > 0) {
          jsonPayload.medicalServicesPlan.dependents = dependents.map((dependent) => {
            return {
              firstName: dependent.firstName || '',
              secondName: dependent.middleName || '',
              lastName: dependent.lastName || '',
              gender: dependent.gender || '',
              birthDate: formatISODate(dependent.birthDate) || null,
              dateStudiesFinish: formatISODate(dependent.schoolCompletionDate) || null,
              departDateSchoolOutside: formatISODate(dependent.schoolDepartureDate) || null,
              schoolName: dependent.schoolName || '',
              schoolAddress: {
                addressLine1: dependent.schoolAddressLine1 || '',
                addressLine2: dependent.schoolAddressLine2 || '',
                addressLine3: dependent.schoolAddressLine3 || '',
                city: dependent.schoolCity || '',
                postalCode: dependent.schoolPostalCode || '',
                provinceOrState: dependent.schoolProvinceOrState || '',
                country: dependent.schoolCountry || '',
              },
              citizenshipType: dependent.status || '',
              attachmentUuids: dependent.nameChangeSupportDocuments.map((image) => image.uuid),
              residencyAttachmentUuids: dependent.citizenshipSupportDocuments.map((image) => image.uuid),
              hasPreviousCoverage: dependent.hasPreviousBCHealthNumber || '',
              prevPHN: stripSpaces(dependent.previousBCHealthNumber) || '',
              hasLivedInBC: dependent.livedInBCSinceBirth || '',
              prevHealthNumber: dependent.previousHealthNumber || '',
              recentBCMoveDate: formatISODate(dependent.recentBCMoveDate) || null,
              recentCanadaMoveDate: formatISODate(dependent.canadaArrivalDate) || null,
              isPermanentMove: dependent.madePermanentMove || '',
              prevProvinceOrCountry: dependent.moveFromOrigin || '',
              beenOutsideBCMoreThan: dependent.outsideBCLast12Months || '',
              departureDate: formatISODate(dependent.outsideBCLast12MonthsDepartureDate) || null,
              returnDate: formatISODate(dependent.outsideBCLast12MonthsReturnDate) || null,
              familyMemberReason: dependent.outsideBCLast12MonthsReason || '',
              destination: dependent.outsideBCLast12MonthsDestination || '',
              isFullTimeStudent: '', // Not a field, but is collected by the middleware,
              isInBCafterStudies: dependent.willResideInBCAfterStudies || '',
              armedDischargeDate: formatISODate(dependent.dischargeDate) || null,
            };
          });
        }
      }
      
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

      jsonPayload.medicalServicesPlan.attachments = this._createAttachmentDetails([
        ...formState.ahCitizenshipSupportDocuments,
        ...formState.ahNameChangeSupportDocuments,
        ...formState.spouseCitizenshipSupportDocuments,
        ...formState.spouseNameChangeSupportDocuments,
        ...(children.map((child) => {
          return [
            ...child.citizenshipSupportDocuments,
            ...child.nameChangeSupportDocuments,
          ];
        })),
        ...(dependents.map((dependent) => {
          return [
            ...dependent.citizenshipSupportDocuments,
            ...dependent.nameChangeSupportDocuments,
          ];
        })),
      ]);
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

  _createAttachmentDetails(attachments) {
    const results = [];

    for (let i=0; i<attachments.length; i++) {
      results.push({
        contentType: attachments[i].contentType,
        attachmentDocumentType: attachments[i].documentType,
        attachmentUuid: attachments[i].uuid,
        attachmentOrder: `${i + 1}`,
        description: attachments[i].description,
      });
    }
    return results;
  }
}

export default new ApiService();
