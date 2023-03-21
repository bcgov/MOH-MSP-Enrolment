import axios from 'axios';
import {
  formatISODate,
  stripPhoneFormatting,
  stripSpaces,
  replaceSpecialCharacters,
} from 'common-lib-vue';
import { ChildAgeTypes } from '@/constants/child-age-types';
import { getCitizenshipType } from '@/constants/immigration-status-types';
import { firstNameMaxLength, middleNameMaxLength, lastNameMaxLength } from '@/constants/html-validations.js';

const BASE_API_PATH = '/ahdc/api';
const SUBMIT_APPLICATION_URL = `${BASE_API_PATH}/jhaIntegration/application`;
const SUBMIT_ATTACHMENT_URL = `${BASE_API_PATH}/submit-attachment`;
const GET_DEDUCTIBLES_URL = `${BASE_API_PATH}/jhaIntegration/getDeductibles`;
const CHECK_ELIGIBILITY_URL = `${BASE_API_PATH}/jhaIntegration/forwardCheckEligibility`;
const MIDDLEWARE_VERSION_URL = `${BASE_API_PATH}/jhaIntegration/version`;

class ApiService {
  sendApplication(formState) {
    const headers = this._getHeaders(formState.captchaToken);
    const dateToday = new Date();
    const children = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child0To18);
    const dependents = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child19To24);
    const applyingForMSP = formState.isApplyingForMSP;

    const jsonPayload = {
      uuid: formState.applicationUuid,
      firstName: formState.ahFirstName ? formState.ahFirstName.substring(0, firstNameMaxLength) : null,
      secondName: formState.ahMiddleName ? formState.ahMiddleName.substring(0, middleNameMaxLength) : null,
      lastName: formState.ahLastName ? formState.ahLastName.substring(0, lastNameMaxLength) : null,
      sin: stripSpaces(formState.ahSIN) || null,
      phn: stripSpaces(formState.ahPHN) || null,
      gender: formState.ahGender || null,
      birthDate: formatISODate(formState.ahBirthdate) || null,
      telephone: stripPhoneFormatting(formState.phone) || null,
      addressLine1: formState.resAddressLine1 ? replaceSpecialCharacters(formState.resAddressLine1).substring(0, 25) : null,
      addressLine2: formState.resAddressLine2 ? replaceSpecialCharacters(formState.resAddressLine2).substring(0, 25) : null,
      addressLine3: formState.resAddressLine3 ? replaceSpecialCharacters(formState.resAddressLine3).substring(0, 25) : null,
      city: formState.resCity || null,
      postalCode: stripSpaces(formState.resPostalCode) || null,
      provinceOrState: formState.resProvince || null,
      country: formState.resCountry ? replaceSpecialCharacters(formState.resCountry).substring(0, 25) : null,
      authorizedByApplicant: 'Y',
      authorizedByApplicantDate: formatISODate(dateToday),
      powerOfAttorney: formState.hasPowerOfAttorney ? "Y" : "N",
      spousePowerOfAttorney: formState.hasPowerOfAttorney ? "Y" : "N",
      authorizedBySpouse: null, // Set below.
      spouse: null, // Set below.
    };
    
    // only mailing address is required for SuppBens and FPCare submissions
    if (!applyingForMSP) {
      jsonPayload.addressLine1 = formState.mailAddressLine1 ? replaceSpecialCharacters(formState.mailAddressLine1).substring(0, 25) : null;
      jsonPayload.addressLine2 = formState.mailAddressLine2 ? replaceSpecialCharacters(formState.mailAddressLine2).substring(0, 25) : null;
      jsonPayload.addressLine3 = formState.mailAddressLine3 ? replaceSpecialCharacters(formState.mailAddressLine3).substring(0, 25) : null;
      jsonPayload.city = formState.mailCity ? replaceSpecialCharacters(formState.mailCity).substring(0, 25) : null;
      jsonPayload.postalCode = stripSpaces(formState.mailPostalCode) || null;
      jsonPayload.provinceOrState = formState.mailProvince || null;
      jsonPayload.country = formState.mailCountry ? replaceSpecialCharacters(formState.mailCountry).substring(0, 25) : null;
    }

    if (formState.hasSpouse === 'Y') {
      jsonPayload.authorizedBySpouse = 'Y';
      jsonPayload.spouse = {
        firstName: formState.spouseFirstName ? formState.spouseFirstName.substring(0, firstNameMaxLength) : null,
        secondName: formState.spouseMiddleName ? formState.spouseMiddleName.substring(0, middleNameMaxLength) : null,
        lastName: formState.spouseLastName ? formState.spouseLastName.substring(0, lastNameMaxLength) : null,
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
      // formmatting for multiple values
      let fromProvinceOrCountry; 
      if (formState.ahFromProvinceOrCountry) {
        fromProvinceOrCountry = replaceSpecialCharacters(formState.ahFromProvinceOrCountry).substring(0, 25);
      } else if (formState.ahMoveFromOrigin) {
        fromProvinceOrCountry = replaceSpecialCharacters(formState.ahMoveFromOrigin).substring(0, 25);
      } else {
        fromProvinceOrCountry = null;
      }

      jsonPayload.medicalServicesPlan = {
        uuid: formState.mspUuid || null,
        citizenshipType: getCitizenshipType(formState.ahCitizenshipStatus, formState.ahCitizenshipStatusReason) || null,
        attachmentUuids: [
          ...formState.ahNameChangeSupportDocuments.map((image) => image.uuid),
          ...formState.ahCitizenshipSupportDocuments.map((image) => image.uuid),
          ...formState.mspPowerOfAttorneyDocuments.map(document => document.uuid),
        ],
        hasPreviousCoverage: formState.ahHasPreviousPHN || null,
        prevPHN: stripSpaces(formState.ahPreviousPHN) || null,
        hasLivedInBC: formState.ahHasLivedInBCSinceBirth || null,
        prevHealthNumber: formState.ahPreviousHealthNumber || null,
        recentBCMoveDate: formatISODate(formState.ahArrivalDateInBC) || null,
        recentCanadaMoveDate: formatISODate(formState.ahArrivalDateInCanada) || null,
        isPermanentMove: formState.ahIsMovedToBCPermanently || null,
        prevProvinceOrCountry: fromProvinceOrCountry || null,
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
          attachmentUuids: [
            ...formState.spouseNameChangeSupportDocuments.map((image) => image.uuid),
            ...formState.spouseCitizenshipSupportDocuments.map((image) => image.uuid)
          ],
          hasPreviousCoverage: formState.spouseHasPreviousBCHealthNumber || null,
          prevPHN: stripSpaces(formState.spousePreviousBCHealthNumber) || null,
          hasLivedInBC: formState.spouseLivedInBCSinceBirth || null,
          prevHealthNumber: formState.spousePreviousHealthNumber || null,
          recentBCMoveDate: formatISODate(formState.spouseRecentBCMoveDate) || null,
          recentCanadaMoveDate: formatISODate(formState.spouseCanadaArrivalDate) || null,
          isPermanentMove: formState.spouseMadePermanentMove || null,
          prevProvinceOrCountry: formState.spouseMoveFromOrigin ? replaceSpecialCharacters(formState.spouseMoveFromOrigin).substring(0, 25) : null,
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
              firstName: child.firstName ? child.firstName.substring(0, firstNameMaxLength) : null,
              secondName: child.middleName ? child.middleName.substring(0, middleNameMaxLength) : null,
              lastName: child.lastName ? child.lastName.substring(0, lastNameMaxLength) : null,
              gender: child.gender || null,
              birthDate: formatISODate(child.birthDate) || null,
              citizenshipType: getCitizenshipType(child.status, child.statusReason) || null,
              attachmentUuids: [
                ...child.nameChangeSupportDocuments.map((image) => image.uuid),
                ...child.citizenshipSupportDocuments.map((image) => image.uuid)
              ],
              hasPreviousCoverage: child.hasPreviousBCHealthNumber || null,
              prevPHN: stripSpaces(child.previousBCHealthNumber) || null,
              hasLivedInBC: child.livedInBCSinceBirth || null,
              prevHealthNumber: child.previousHealthNumber || null,
              recentBCMoveDate: formatISODate(child.recentBCMoveDate) || null,
              recentCanadaMoveDate: formatISODate(child.canadaArrivalDate) || null,
              isPermanentMove: child.madePermanentMove || null,
              prevProvinceOrCountry: child.moveFromOrigin ? replaceSpecialCharacters(child.moveFromOrigin).substring(0, 25) : null,
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
                addressLine1: dependent.schoolAddressLine1 ? replaceSpecialCharacters(dependent.schoolAddressLine1).substring(0, 25) : null,
                addressLine2: dependent.schoolAddressLine2 ? replaceSpecialCharacters(dependent.schoolAddressLine2).substring(0, 25) : null,
                addressLine3: dependent.schoolAddressLine3 ? replaceSpecialCharacters(dependent.schoolAddressLine3).substring(0, 25) : null,
                city: dependent.schoolCity || null,
                postalCode: dependent.schoolPostalCode || null,
                provinceOrState: dependent.schoolProvinceOrState || null,
                country: dependent.schoolCountry ? replaceSpecialCharacters(dependent.schoolCountry).substring(0, 25) : null,
              },
              citizenshipType: dependent.status || null,
              attachmentUuids: [
                ...dependent.nameChangeSupportDocuments.map((image) => image.uuid),
                ...dependent.citizenshipSupportDocuments.map((image) => image.uuid)
              ],
              hasPreviousCoverage: dependent.hasPreviousBCHealthNumber || null,
              prevPHN: stripSpaces(dependent.previousBCHealthNumber) || null,
              hasLivedInBC: dependent.livedInBCSinceBirth || null,
              prevHealthNumber: dependent.previousHealthNumber || null,
              recentBCMoveDate: formatISODate(dependent.recentBCMoveDate) || null,
              recentCanadaMoveDate: formatISODate(dependent.canadaArrivalDate) || null,
              isPermanentMove: dependent.madePermanentMove || null,
              prevProvinceOrCountry: dependent.moveFromOrigin ? replaceSpecialCharacters(dependent.moveFromOrigin).substring(0, 25) : null,
              beenOutsideBCMoreThan: dependent.outsideBCLast12Months || null,
              departureDate: formatISODate(dependent.outsideBCLast12MonthsDepartureDate) || null,
              returnDate: formatISODate(dependent.outsideBCLast12MonthsReturnDate) || null,
              familyMemberReason: dependent.outsideBCLast12MonthsReason || null,
              destination: dependent.outsideBCLast12MonthsDestination || null,
              isFullTimeStudent: 'Y', // Not a field, but is collected by the middleware. All overage children (dependents) are students
              isInBCafterStudies: dependent.willResideInBCAfterStudies || null,
              armedDischargeDate: formatISODate(dependent.dischargeDate) || null,
            };
          });
        }
      }
      
      // Add mailing address, copy residential address if same
      if (!formState.isMailSame) {
        jsonPayload.medicalServicesPlan.mailingAddress = {
          addressLine1: formState.mailAddressLine1 ? replaceSpecialCharacters(formState.mailAddressLine1).substring(0, 25) : null,
          addressLine2: formState.mailAddressLine2 ? replaceSpecialCharacters(formState.mailAddressLine2).substring(0, 25) : null,
          addressLine3: formState.mailAddressLine3 ? replaceSpecialCharacters(formState.mailAddressLine3).substring(0, 25) : null,
          city: formState.mailCity || null,
          postalCode: stripSpaces(formState.mailPostalCode) || null,
          provinceOrState: formState.mailProvince || null,
          country: formState.mailCountry ? replaceSpecialCharacters(formState.mailCountry).substring(0, 25) : null,
        };
      } else {
        jsonPayload.medicalServicesPlan.mailingAddress = {
          addressLine1: formState.resAddressLine1 ? replaceSpecialCharacters(formState.resAddressLine1).substring(0, 25) : null,
          addressLine2: formState.resAddressLine2 ? replaceSpecialCharacters(formState.resAddressLine2).substring(0, 25) : null,
          addressLine3: formState.resAddressLine3 ? replaceSpecialCharacters(formState.resAddressLine3).substring(0, 25) : null,
          city: formState.resCity || null,
          postalCode: stripSpaces(formState.resPostalCode) || null,
          provinceOrState: formState.resProvince || null,
          country: formState.resCountry ? replaceSpecialCharacters(formState.resCountry).substring(0, 25) : null,
        };
      }

      let documents = [
        ...formState.ahCitizenshipSupportDocuments,
        ...formState.ahNameChangeSupportDocuments
      ];
      if (formState.hasSpouse === 'Y') {
        documents = [
          ...documents,
          ...formState.spouseCitizenshipSupportDocuments,
          ...formState.spouseNameChangeSupportDocuments,
        ];
      }
      if (formState.hasChildren === 'Y') {
        documents = [
          ...documents,
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
      }

      if (formState.hasPowerOfAttorney) {
        documents = [...documents, ...formState.mspPowerOfAttorneyDocuments];
      }

      jsonPayload.medicalServicesPlan.attachments = this._createAttachmentDetails(documents);
    }

    // FPC.
    if (formState.isApplyingForFPCare) {
      const postalCode = formState.isMailSame && formState.resPostalCode ? stripSpaces(formState.resPostalCode) : stripSpaces(formState.mailPostalCode);
      const persons = [];
      formState.children.forEach((child) => {
        persons.push({
          givenName: child.firstName,
          surname: child.lastName,
          postalCode: postalCode,
          perType: '2', // 0 is applicant, 1 is spouse, 2 is children only.
          dateOfBirth: formatISODate(child.birthDate),
          phn: stripSpaces(child.personalHealthNumber) || null,
        });
      });
      
      jsonPayload.fairPharmaCare = {
        uuid: formState.fpcUuid,
        clientName: null,
        processDate: formatISODate(dateToday),
        accountHolderNetIncome: formState.ahFPCIncome,
        accountHolderRDSP: formState.ahFPCRDSP || '0',
        spouseNetIncome: formState.spouseFPCIncome || '0',
        spouseRDSP: formState.spouseFPCRDSP || '0',
        spousePostalCode: postalCode,
        persons, 
        attachments: [],
        familyNumber: null,
        deductibleAmount: null, // TODO.
        annualMaximumAmount: null, // TODO.
        copayPercentage: null
      };

      if (formState.hasPowerOfAttorney) {
        jsonPayload.fairPharmaCare.attachments = this._createAttachmentDetails(formState.fpcPowerOfAttorneyDocuments);
      } 
    }

    // SB.
    if (formState.isApplyingForSuppBen) {
      let numDisabled = parseInt(formState.numDisabilityChildren) || 0;
      // check if spouse is on disability
      if (formState.selectedDisabilityRecipients && formState.selectedDisabilityRecipients.includes('spouse')) {
        numDisabled += 1;
      }
      // check if applicant is on disability
      if (formState.selectedDisabilityRecipients && formState.selectedDisabilityRecipients.includes('ah')) {
        numDisabled += 1;
      }

      jsonPayload.supplementaryBenefits = {
        uuid: formState.sbUuid,
        assistanceYear: `${new Date().getFullYear()}`,
        taxYear: formState.selectedNOAYear,
        numberOfTaxYears: 0,
        adjustedNetIncome: parseInt(formState.sbAdjustedIncome) || 0,
        childDeduction: parseInt(formState.childDeduction) || 0,
        deductions: parseInt(formState.childAdjustedDeduction) || 0, // Stored as "deductionsDifference" in DB.
        disabilityDeduction: parseInt(formState.ahDisabilityCreditDeduction) + 
          parseInt(formState.spouseDisabilityCreditDeduction) +
          parseInt(formState.childDisabilityCreditDeduction) || 0,
        sixtyFiveDeduction: parseInt(formState.ah65Deduction) || 0,
        totalDeductions: parseInt(formState.sbTotalDeductions) || 0,
        totalNetIncome: parseInt(formState.sbTotalHouseholdIncome) || 0,
        childCareExpense: Math.floor(parseInt(formState.claimedChildCareExpenses) / 2 || 0), // amount recieved is half actual child care expenses 
        netIncomeLastYear: parseInt(formState.ahSBIncome) || 0, // Applicant net income. DB as "netIncome".
        numChildren: parseInt(formState.numChildren) || 0,
        numDisabled,
        spouseIncomeLine236: parseInt(formState.spouseSBIncome) || 0,
        reportedUCCBenefit: parseInt(formState.childDisabilityCreditDeduction) || 0,
        spouseDSPAmount: parseInt(formState.sbRDSPAmount) || 0, // for some reason the db expects total SB RDSP as "spouseDSPAmount" although this isn't specified for the user as being spouse only
        spouseDeduction: parseInt(formState.spouseDeduction) || 0,
        applicantAttendantCareExpense: parseInt(formState.ahAttendantNursingDeduction) || 0,
        spouseAttendantCareExpense: parseInt(formState.spouseAttendantNursingDeduction) || 0,
        childAttendantCareExpense: parseInt(formState.childAttendantNursingDeduction) || 0,
        spouseSixtyFiveDeduction: parseInt(formState.spouse65Deduction) || 0,
      };

      let documents = [
        ...formState.attendantNursingReceipts,
        ...formState.ahCRADocuments,
        ...formState.spouseCRADocuments,
      ];
      if (formState.hasPowerOfAttorney) {
        documents = [...documents, ...formState.sbPowerOfAttorneyDocuments]
      }
      jsonPayload.supplementaryBenefits.attachments = this._createAttachmentDetails(documents)
    }

    // console.log('JSON Payload:', jsonPayload);
    const jhaApplicationUuid = formState.applicationUuid;
    const url = `${SUBMIT_APPLICATION_URL}/${jhaApplicationUuid}`;
    return this._sendPostRequest(url, headers, jsonPayload);
  }

  sendAttachments(formState) {
    const children = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child0To18);
    const dependents = formState.children.filter((child) => child.ageRange === ChildAgeTypes.Child19To24);

    let mspImages = [
      ...formState.ahCitizenshipSupportDocuments,
      ...formState.ahNameChangeSupportDocuments
    ];
    if (formState.hasSpouse === 'Y') {
      mspImages = [
        ...mspImages,
        ...formState.spouseCitizenshipSupportDocuments,
        ...formState.spouseNameChangeSupportDocuments,
      ];
    }
    if (formState.hasChildren === 'Y') {
      mspImages = [
        ...mspImages,
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
    }

    const sbImages = [
      ...formState.attendantNursingReceipts,
      ...formState.ahCRADocuments,
      ...formState.spouseCRADocuments,
    ];
    
    // Send attachments.
    const promises = [];

    if (formState.hasPowerOfAttorney) {
      const addPoADocs = (applicationDocumentsKey, applicationUuid, programArea) => {
        formState[applicationDocumentsKey].forEach((document) => {
          promises.push(
            this._sendAttachment(
              document,
              applicationUuid,
              formState.captchaToken,
              'PowerOfAttorney',
              programArea,
            )
          );
        });
      }
      if (formState.isApplyingForFPCare) {
        addPoADocs('fpcPowerOfAttorneyDocuments', formState.fpcUuid, 'PHARMANET')
      }
      if (formState.isApplyingForMSP) {
        addPoADocs('mspPowerOfAttorneyDocuments', formState.mspUuid)
      }
      if (formState.isApplyingForSuppBen) {
        addPoADocs('sbPowerOfAttorneyDocuments', formState.sbUuid)
      }
    }

    if (formState.isApplyingForMSP) {
      mspImages.forEach((image) => {
        promises.push(this._sendAttachment(image, formState.mspUuid, formState.captchaToken));
      });
    }
    if (formState.isApplyingForSuppBen) {
      sbImages.forEach((image) => {
        promises.push(this._sendAttachment(image, formState.sbUuid, formState.captchaToken));
      });
    }
    return Promise.all(promises);
  }

  _sendAttachment(image, programUuid, token, docType='SupportDocument', programArea='ENROLMENT') {
    const url = `${SUBMIT_ATTACHMENT_URL}/${programUuid}/attachments/${image.uuid}?programArea=${programArea}&attachmentDocumentType=${docType}&contentType=image/jpeg&imageSize=${image.size}&dpackage=msp_enrolment_pkg`;
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
            reject({
              programUuid,
              imageUuid: image && image.uuid,
              size: image && image.size,
              programArea,
              docType,
              token,
              // getting status in ConsentPage.vue depends on response.data.response being under error.response
              response: response && response.data && response.data.response,
              // actual response from individual post request for extra detail
              _response: response
            });
          }
        })
        .catch((error) => {
          reject({
            programUuid,
            imageUuid: image && image.uuid,
            size: image && image.size,
            programArea,
            docType,
            token,
            error,
          });
        });
    });
  }

  getDeductibles(token, fpcUuid) {
    const headers = this._getHeaders(token);
    const payload = {
      uuid: fpcUuid,
      benefitYear: `${new Date().getFullYear()}`,
      taxYear: `${new Date().getFullYear() - 1}`
    };
    return this._sendPostRequest(GET_DEDUCTIBLES_URL, headers, payload);
  }

  checkEligibility(formState) {
    const headers = this._getHeaders(formState.captchaToken);
    const payload = {
      uuid: formState.fpcUuid,
      persons: [
        {
          perType: '0',
          phn: stripSpaces(formState.ahPHN),
          dateOfBirth: formatISODate(formState.ahBirthdate),
          surname: formState.ahLastName,
          sin: stripSpaces(formState.ahSIN),
        }
      ],
    };
    if (formState.hasSpouse === 'Y') {
      payload.persons.push({
        perType: '1',
        phn: stripSpaces(formState.spousePHN),
        dateOfBirth: formatISODate(formState.spouseBirthDate),
        surname: formState.spouseLastName,
        sin: stripSpaces(formState.spouseSIN),
      });
    }
    if (formState.hasChildren === 'Y' && Array.isArray(formState.children)) {
      formState.children.forEach(child => {
        payload.persons.push({
          perType: '2',
          phn: stripSpaces(child?.personalHealthNumber),
          dateOfBirth: formatISODate(child?.birthDate),
          surname: child?.lastName,
        })
      });
    }
    return this._sendPostRequest(CHECK_ELIGIBILITY_URL, headers, payload);
  }

  getMiddlewareVersion(token) {
    const headers = this._getHeaders(token);
    return axios.get(MIDDLEWARE_VERSION_URL, { headers });
  }

  _sendPostRequest(url, headers, payload) {
    return axios.post(url, payload, { headers });
  }

  _getHeaders(token) {
    return {
      "Content-Type": "application/json",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token
    };
  }

  _getAttachmentHeaders(token) {
    return {
      "Content-Type": "image/jpeg",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token
    };
  }

  _createAttachmentDetails(attachments) {
    const results = [];

    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i];
      let attachmentDocumentType = "SupportDocument";
      if (attachment.documentType === "PowerOfAttorney") attachmentDocumentType = "PowerOfAttorney";

      results.push({
        contentType: attachment.contentType,
        attachmentDocumentType,
        attachmentUuid: attachment.uuid,
        attachmentOrder: `${i + 1}`,
        description: attachment.description || null,
      });
    }
    return results;
  }
}

export default new ApiService();
