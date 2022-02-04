import axios from 'axios';
import {
  formatISODate,
  stripPhoneFormatting,
  stripSpaces,
} from 'common-lib-vue';
import { ChildAgeTypes } from '@/constants/child-age-types';
import { getCitizenshipType } from '@/constants/immigration-status-types';

const BASE_API_PATH = '/ahdc/api';
const SUBMIT_APPLICATION_URL = `${BASE_API_PATH}/jhaIntegration/application`;
const SUBMIT_ATTACHMENT_URL = `${BASE_API_PATH}/submit-attachment`;

class ApiService {
  sendApplication(formState) {
    const headers = this._getHeaders(formState.captchaToken);
    const jsonPayload = {
      uuid: formState.applicationUuid,
      firstName: formState.ahFirstName || null,
      secondName: formState.ahMiddleName || null,
      lastName: formState.ahLastName || null,
      sin: stripSpaces(formState.ahSIN) || null,
      phn: null,
      gender: formState.ahGender || null,
      birthDate: formatISODate(formState.ahBirthdate) || null,
      telephone: stripPhoneFormatting(formState.phone) || null,
      addressLine1: formState.resAddressLine1 || null,
      addressLine2: formState.resAddressLine2 || null,
      addressLine3: formState.resAddressLine3 || null,
      city: formState.resCity || null,
      postalCode: formState.resPostalCode || null,
      provinceOrState: formState.resProvince || null,
      country: formState.resCountry || '',
      authorizedByApplicant: 'Y',
      authorizedByApplicantDate: formatISODate(new Date()),
      authorizedBySpouse: null, // Set below.
      spouse: null, // Set below.
    };
    if (formState.hasSpouse === 'Y') {
      jsonPayload.authorizedBySpouse = 'Y';
      jsonPayload.spouse = {
        firstName: formState.spouseFirstName || null,
        secondName: formState.spouseMiddleName || null,
        lastName: formState.spouseLastName || null,
        gender: formState.spouseGender || null,
        birthDate: formatISODate(formState.spouseBirthDate) || null,
        telephone: stripPhoneFormatting(formState.phone) || null,
        sin: stripSpaces(formState.spouseSIN) || null,
        phn: stripSpaces(formState.spousePHN) || null,
      };
    } else {
      jsonPayload.authorizedBySpouse = 'N';
    }
    if (formState.isApplyingForMSP) {
      const children = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child0To18);
      const dependents = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child19To24);

      jsonPayload.medicalServicesPlan = {
        uuid: formState.mspUuid || null,
        citizenshipType: getCitizenshipType(formState.ahCitizenshipStatus, formState.ahCitizenshipStatusReason) || null,
        attachmentUuids: formState.ahNameChangeSupportDocuments.map((image) => image.uuid),
        residencyAttachmentUuids: formState.ahCitizenshipSupportDocuments.map((image) => image.uuid),
        hasPreviousCoverage: formState.ahHasPreviousPHN || null,
        prevPHN: formState.ahPreviousPHN || null,
        hasLivedInBC: formState.ahHasLivedInBCSinceBirth || null,
        prevHealthNumber: formState.ahPreviousHealthNumber || null,
        recentBCMoveDate: formatISODate(formState.ahArrivalDateInBC) || null,
        recentCanadaMoveDate: formatISODate(formState.ahArrivalDateInCanada) || null,
        isPermanentMove: formState.ahIsMovedToBCPermanently || null,
        prevProvinceOrCountry: formState.ahFromProvinceOrCountry || null,
        beenOutsideBCMoreThan: formState.ahIsOutsideBCLast12Months || null,
        departureDate: formatISODate(formState.ahOutsideBCLast12MonthsDepartureDate) || null,
        returnDate: formatISODate(formState.ahOutsideBCLast12MonthsReturnDate) || null,
        familyMemberReason: formState.ahOutsideBCLast12MonthsReason || null,
        destination: formState.ahOutsideBCLast12MonthsLocation || null,
        isFullTimeStudent: formState.ahIsStudent || null,
        isInBCafterStudies: formState.ahWillStudentResideInBC || null,
        armedDischargeDate: formatISODate(formState.ahArmedForcesDischargeDate) || null,
      };
      if (formState.hasSpouse === 'Y') {
        jsonPayload.medicalServicesPlan.spouse = {
          citizenshipType: getCitizenshipType(formState.spouseStatus, formState.spouseStatusReason) || null,
          attachmentUuids: formState.spouseNameChangeSupportDocuments.map((image) => image.uuid),
          residencyAttachmentUuids: formState.spouseCitizenshipSupportDocuments.map((image) => image.uuid),
          hasPreviousCoverage: formState.spouseHasPreviousBCHealthNumber || null,
          prevPHN: stripSpaces(formState.spousePreviousBCHealthNumber) || null,
          hasLivedInBC: formState.spouseLivedInBCSinceBirth || null,
          prevHealthNumber: formState.spousePreviousHealthNumber || null,
          recentBCMoveDate: formatISODate(formState.spouseRecentBCMoveDate) || null,
          recentCanadaMoveDate: formatISODate(formState.spouseCanadaArrivalDate) || null,
          isPermanentMove: formState.spouseMadePermanentMove || null,
          prevProvinceOrCountry: formState.spouseMoveFromOrigin || null,
          beenOutsideBCMoreThan: formState.spouseOutsideBCLast12Months || null,
          departureDate: formatISODate(formState.spouseOutsideBCLast12MonthsDepartureDate) || null,
          returnDate: formatISODate(formState.spouseOutsideBCLast12MonthsReturnDate) || null,
          familyMemberReason: formState.spouseOutsideBCLast12MonthsReason || null,
          destination: formState.spouseOutsideBCLast12MonthsDestination || null,
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
              firstName: child.firstName || null,
              secondName: child.middleName || null,
              lastName: child.lastName || null,
              gender: child.gender || null,
              birthDate: formatISODate(child.birthDate) || null,
              citizenshipType: getCitizenshipType(child.status, child.statusReason) || null,
              attachmentUuids: child.nameChangeSupportDocuments.map((image) => image.uuid),
              residencyAttachmentUuids: child.citizenshipSupportDocuments.map((image) => image.uuid),
              hasPreviousCoverage: child.hasPreviousBCHealthNumber || null,
              prevPHN: stripSpaces(child.previousBCHealthNumber) || null,
              hasLivedInBC: child.livedInBCSinceBirth || null,
              prevHealthNumber: child.previousHealthNumber || null,
              recentBCMoveDate: formatISODate(child.recentBCMoveDate) || null,
              recentCanadaMoveDate: formatISODate(child.canadaArrivalDate) || null,
              isPermanentMove: child.madePermanentMove || null,
              prevProvinceOrCountry: child.moveFromOrigin || null,
              beenOutsideBCMoreThan: child.outsideBCLast12Months || '',
              departureDate: formatISODate(child.outsideBCLast12MonthsDepartureDate) || null,
              returnDate: formatISODate(child.outsideBCLast12MonthsReturnDate) || null,
              familyMemberReason: child.outsideBCLast12MonthsReason || null,
              destination: child.outsideBCLast12MonthsDestination || null,
              isFullTimeStudent: null, // Not a field, but is collected by the middleware,
              isInBCafterStudies: child.willResideInBCAfterStudies || null,
              armedDischargeDate: formatISODate(child.dischargeDate) || null,
            };
          });
        }

        // Dependents 19 to 24.
        if (dependents.length > 0) {
          jsonPayload.medicalServicesPlan.dependents = dependents.map((dependent) => {
            return {
              firstName: dependent.firstName || null,
              secondName: dependent.middleName || null,
              lastName: dependent.lastName || null,
              gender: dependent.gender || null,
              birthDate: formatISODate(dependent.birthDate) || null,
              dateStudiesFinish: formatISODate(dependent.schoolCompletionDate) || null,
              departDateSchoolOutside: formatISODate(dependent.schoolDepartureDate) || null,
              schoolName: dependent.schoolName || null,
              schoolAddress: {
                addressLine1: dependent.schoolAddressLine1 || null,
                addressLine2: dependent.schoolAddressLine2 || null,
                addressLine3: dependent.schoolAddressLine3 || null,
                city: dependent.schoolCity || null,
                postalCode: dependent.schoolPostalCode || null,
                provinceOrState: dependent.schoolProvinceOrState || null,
                country: dependent.schoolCountry || null,
              },
              citizenshipType: dependent.status || null,
              attachmentUuids: dependent.nameChangeSupportDocuments.map((image) => image.uuid),
              residencyAttachmentUuids: dependent.citizenshipSupportDocuments.map((image) => image.uuid),
              hasPreviousCoverage: dependent.hasPreviousBCHealthNumber || null,
              prevPHN: stripSpaces(dependent.previousBCHealthNumber) || null,
              hasLivedInBC: dependent.livedInBCSinceBirth || null,
              prevHealthNumber: dependent.previousHealthNumber || null,
              recentBCMoveDate: formatISODate(dependent.recentBCMoveDate) || null,
              recentCanadaMoveDate: formatISODate(dependent.canadaArrivalDate) || null,
              isPermanentMove: dependent.madePermanentMove || null,
              prevProvinceOrCountry: dependent.moveFromOrigin || null,
              beenOutsideBCMoreThan: dependent.outsideBCLast12Months || null,
              departureDate: formatISODate(dependent.outsideBCLast12MonthsDepartureDate) || null,
              returnDate: formatISODate(dependent.outsideBCLast12MonthsReturnDate) || null,
              familyMemberReason: dependent.outsideBCLast12MonthsReason || null,
              destination: dependent.outsideBCLast12MonthsDestination || null,
              isFullTimeStudent: null, // Not a field, but is collected by the middleware,
              isInBCafterStudies: dependent.willResideInBCAfterStudies || null,
              armedDischargeDate: formatISODate(dependent.dischargeDate) || null,
            };
          });
        }
      }
      
      // Add mailing address.
      if (!formState.isMailSame) {
        jsonPayload.medicalServicesPlan.mailingAddress = {
          addressLine1: formState.mailAddressLine1 || null,
          addressLine2: formState.mailAddressLine2 || null,
          addressLine3: formState.mailAddressLine3 || null,
          city: formState.mailCity || null,
          postalCode: stripSpaces(formState.mailPostalCode) || null,
          provinceOrState: formState.mailProvince || null,
          country: formState.mailCountry || null,
        };
      }


      jsonPayload.medicalServicesPlan.attachments = this._createAttachmentDetails([
        ...formState.ahCitizenshipSupportDocuments,
        ...formState.ahNameChangeSupportDocuments,
        ...formState.spouseCitizenshipSupportDocuments,
        ...formState.spouseNameChangeSupportDocuments,
        ...children.flatMap((child) => {
          return [
            ...child.citizenshipSupportDocuments,
            ...child.nameChangeSupportDocuments,
          ];
        }),
        ...dependents.flatMap((dependent) => {
          return [
            ...dependent.citizenshipSupportDocuments,
            ...dependent.nameChangeSupportDocuments,
          ];
        }),
      ]);
    }
    // console.log('JSON Payload:', jsonPayload);
    const jhaApplicationUuid = formState.applicationUuid;
    const url = `${SUBMIT_APPLICATION_URL}/${jhaApplicationUuid}`;
    return this._sendPostRequest(url, headers, jsonPayload);
  }

  sendAttachments(formState) {
    const children = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child0To18);
    const dependents = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child19To24);

    const mspImages = [
      ...formState.ahCitizenshipSupportDocuments,
      ...formState.ahNameChangeSupportDocuments,
      ...formState.spouseCitizenshipSupportDocuments,
      ...formState.spouseNameChangeSupportDocuments,
      ...children.flatMap((child) => {
        return [
          ...child.citizenshipSupportDocuments,
          ...child.nameChangeSupportDocuments,
        ];
      }),
      ...dependents.flatMap((dependent) => {
        return [
          ...dependent.citizenshipSupportDocuments,
          ...dependent.nameChangeSupportDocuments,
        ];
      }),
    ];

    const fpcImages = [
      ...formState.ahCRADocuments,
      ...formState.spouseCRADocuments,
    ];
    
    // Send attachments.
    const promises = [];
    mspImages.forEach((image) => {
      promises.push(this._sendAttachment(image, formState.mspUuid, formState.captchaToken));
    });
    fpcImages.forEach((image) => {
      promises.push(this._sendAttachment(image, formState.fpcUuid, formState.captchaToken));
    });
    return Promise.all(promises);
  }

  _sendAttachment(image, programUuid, token) {
    const url = `${SUBMIT_ATTACHMENT_URL}/${programUuid}/attachments/${image.uuid}?programArea=ENROLMENT&attachmentDocumentType=SupportDocument&contentType=image/jpeg&imageSize=${image.size}&dpackage=msp_enrolment_pkg`;
    const headers = this._getAttachmentHeaders(token);
    let blob;

    if (image && typeof image.source === 'string') {
      const binary = atob(image.source.split(',')[1]);
      const chars = [];
      for (let i=0; i<binary.length; i++) {
        chars.push(binary.charCodeAt(i));
      }
      blob = new Blob([new Uint8Array(chars)], {
        type: 'image/jpeg',
      });
    }
    return new Promise((resolve, reject) => {
      this._sendPostRequest(url, headers, blob)
        .then((response) => {
          if (response && response.data && response.data.returnCode === 'success') {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  _sendPostRequest(url, headers, payload) {
    return axios.post(url, payload, { headers });
  }

  _getHeaders(token) {
    return {
      "Content-Type": "application/json",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token
    }
  }

  _getAttachmentHeaders(token) {
    return {
      "Content-Type": "image/jpeg",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token
    }
    
  }

  _createAttachmentDetails(attachments) {
    const results = [];

    for (let i=0; i<attachments.length; i++) {
      results.push({
        contentType: attachments[i].contentType,
        attachmentDocumentType: 'SupportDocument',
        attachmentUuid: attachments[i].uuid,
        attachmentOrder: `${i + 1}`,
        description: attachments[i].description || null,
      });
    }
    return results;
  }
}

export default new ApiService();
