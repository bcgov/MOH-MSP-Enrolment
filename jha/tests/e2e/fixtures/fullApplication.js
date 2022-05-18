import { formatDate } from '../helpers';

export const generateRequestObject = () => {
  const currentDate = new Date();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(currentDate.getMonth() - 1);

  return {
    "firstName": "alex",
    "secondName": "jaimie",
    "lastName": "doe",
    "sin": "238795439",
    "phn": null,
    "gender": "X",
    "birthDate": "2000-01-01",
    "telephone": null,
    "addressLine1": "123 fake st.",
    "addressLine2": null,
    "addressLine3": null,
    "city": "duncan",
    "postalCode": "V8P1A1",
    "provinceOrState": "British Columbia",
    "country": "Canada",
    "authorizedByApplicant": "Y",
    "powerOfAttorney": "N",
    "spousePowerOfAttorney": "N",
    "authorizedBySpouse": "Y",
    "spouse": {
      "firstName": "sarah",
      "secondName": "jaimie",
      "lastName": "doe",
      "gender": "X",
      "birthDate": "1990-06-20",
      "telephone": null,
      "sin": "195544135",
      "phn": null
    },
    "medicalServicesPlan": {
      "citizenshipType": "CanadianCitizen",
      "hasPreviousCoverage": "Y",
      "prevPHN": "9999999998",
      "hasLivedInBC": null,
      "prevHealthNumber": "111 111 1111",
      "recentBCMoveDate": "2001-02-01",
      "recentCanadaMoveDate": "2001-02-01",
      "isPermanentMove": "Y",
      "prevProvinceOrCountry": "Alberta",
      "beenOutsideBCMoreThan": "Y",
      "departureDate": formatDate(lastMonthDate),
      "returnDate": formatDate(currentDate),
      "familyMemberReason": "vacation",
      "destination": "bahamas",
      "isFullTimeStudent": "Y",
      "isInBCafterStudies": "Y",
      "armedDischargeDate": "2010-02-01",
      "spouse": {
        "citizenshipType": "PermanentResident",
        "hasPreviousCoverage": "N",
        "prevPHN": null,
        "hasLivedInBC": null,
        "prevHealthNumber": null,
        "recentBCMoveDate": "2015-03-02",
        "recentCanadaMoveDate": "2014-03-02",
        "isPermanentMove": "Y",
        "prevProvinceOrCountry": "Afghanistan",
        "beenOutsideBCMoreThan": "N",
        "departureDate": null,
        "returnDate": null,
        "familyMemberReason": null,
        "destination": null,
        "isFullTimeStudent": null,
        "isInBCafterStudies": null,
        "armedDischargeDate": null
      },
      "children": [
        {
          "firstName": "ralph",
          "secondName": "j",
          "lastName": "wiggum",
          "gender": "M",
          "birthDate": "2019-02-01",
          "citizenshipType": "CanadianCitizen",
          "hasPreviousCoverage": "N",
          "prevPHN": null,
          "hasLivedInBC": "Y",
          "prevHealthNumber": null,
          "recentBCMoveDate": null,
          "recentCanadaMoveDate": null,
          "isPermanentMove": "Y",
          "prevProvinceOrCountry": null,
          "beenOutsideBCMoreThan": "N",
          "departureDate": null,
          "returnDate": null,
          "familyMemberReason": null,
          "destination": null,
          "isFullTimeStudent": null,
          "isInBCafterStudies": null,
          "armedDischargeDate": null
        }
      ],
      "mailingAddress": {
        "addressLine1": "123 fake st.",
        "addressLine2": null,
        "addressLine3": null,
        "city": "duncan",
        "postalCode": "V8P1A1",
        "provinceOrState": "British Columbia",
        "country": "Canada"
      },
      "attachments": [
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "1",
          "description": "Canadian Birth Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "2",
          "description": "Canadian Birth Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "3",
          "description": "Marriage Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "4",
          "description": "Marriage Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "5",
          "description": "Confirmation of Permanent Residence"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "6",
          "description": "Confirmation of Permanent Residence"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "7",
          "description": "Marriage Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "8",
          "description": "Marriage Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "9",
          "description": "Canadian Birth Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "10",
          "description": "Canadian Birth Certificate"
        }
      ]
    },
    "supplementaryBenefits": {
      "assistanceYear": "2022",
      "taxYear": "2021",
      "numberOfTaxYears": 0,
      "adjustedNetIncome": 41100,
      "childDeduction": 3000,
      "deductions": 2900,
      "disabilityDeduction": 3000,
      "sixtyFiveDeduction": 0,
      "totalDeductions": 12900,
      "totalNetIncome": 54000,
      "childCareExpense": 100,
      "netIncomeLastYear": 50000,
      "numChildren": 1,
      "numDisabled": 1,
      "spouseIncomeLine236": 4000,
      "reportedUCCBenefit": 0,
      "spouseDSPAmount": 1000,
      "spouseDeduction": 3000,
      "applicantAttendantCareExpense": 3000,
      "spouseAttendantCareExpense": 0,
      "childAttendantCareExpense": 0,
      "spouseSixtyFiveDeduction": 0,
      "attachments": [
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "1",
          "description": null
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "2",
          "description": null
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "3",
          "description": "Account holder NOA/NOR"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "4",
          "description": "Account holder NOA/NOR"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "5",
          "description": "Spouse NOA/NOR"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentOrder": "6",
          "description": "Spouse NOA/NOR"
        }
      ]
    }
  }
}