import { formatISODate } from 'common-lib-vue';
import { SupportDocumentTypes } from '../../../src/constants/document-types';

export const generateRequestObject = () => {
  const currentDate = new Date();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(currentDate.getMonth() - 1);

  return {
    "uuid": "412d35d7-8446-4dfa-ac03-d19d3dd2ad03",
    "firstName": "alex",
    "secondName": "jaimie",
    "lastName": "doe",
    "sin": null,
    "phn": null,
    "gender": "X",
    "birthDate": "2000-01-01",
    "telephone": "5555555555",
    "addressLine1": "123 fake st.",
    "addressLine2": null,
    "addressLine3": null,
    "city": "duncan",
    "postalCode": "V8P1A1",
    "provinceOrState": "British Columbia",
    "country": "Canada",
    "authorizedByApplicant": "Y",
    "authorizedByApplicantDate": "2022-05-17",
    "powerOfAttorney": "N",
    "spousePowerOfAttorney": "N",
    "authorizedBySpouse": "Y",
    "spouse": {
      "firstName": "sarah",
      "secondName": "jaimie",
      "lastName": "doe",
      "gender": "X",
      "birthDate": "1990-06-20",
      "telephone": "5555555555",
      "sin": null,
      "phn": null
    },
    "medicalServicesPlan": {
      "uuid": "e744361d-335a-4fc8-8f6e-fedf9675a96b",
      "citizenshipType": "CanadianCitizen",
      "attachmentUuids": [
        "45c86f8d-9e64-4d9b-8326-85349a8080b1",
        "c23e0467-8f6c-45ca-b797-4876fbd1843f",
        "95d272ee-b5ce-45c2-8dfb-3b0979d86068",
        "3984a7ec-7a20-46d1-bfb6-5c986d4bb052"
      ],
      "hasPreviousCoverage": "Y",
      "prevPHN": "9999999998",
      "hasLivedInBC": null,
      "prevHealthNumber": "111 111 1111",
      "recentBCMoveDate": "2001-02-01",
      "recentCanadaMoveDate": "2001-02-01",
      "isPermanentMove": "Y",
      "prevProvinceOrCountry": "Alberta",
      "beenOutsideBCMoreThan": "Y",
      "departureDate": formatISODate(lastMonthDate),
      "returnDate": formatISODate(currentDate),
      "familyMemberReason": "vacation",
      "destination": "bahamas",
      "isFullTimeStudent": "Y",
      "isInBCafterStudies": "Y",
      "armedDischargeDate": "2010-02-01",
      "spouse": {
        "citizenshipType": "PermanentResident",
        "attachmentUuids": [
          "eedbf9ff-3970-4895-92d2-253dfd9cf767",
          "976f4ab1-41e1-4e14-8efc-847b34392db4",
          "65ba6bd8-11af-462b-8eb5-6259c0d368d4",
          "cc0d7067-c495-434f-aa35-d066af2053f5"
        ],
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
          "attachmentUuids": [
            "4c502613-0298-4f48-a9aa-23831038e247",
            "033350b3-3ff8-483f-9095-aab0af58f44c"
          ],
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
          "attachmentUuid": "95d272ee-b5ce-45c2-8dfb-3b0979d86068",
          "attachmentOrder": "1",
          "description": SupportDocumentTypes.CanadianBirthCertificate
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentUuid": "3984a7ec-7a20-46d1-bfb6-5c986d4bb052",
          "attachmentOrder": "2",
          "description": SupportDocumentTypes.CanadianBirthCertificate
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentUuid": "45c86f8d-9e64-4d9b-8326-85349a8080b1",
          "attachmentOrder": "3",
          "description": "Marriage Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentUuid": "c23e0467-8f6c-45ca-b797-4876fbd1843f",
          "attachmentOrder": "4",
          "description": "Marriage Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentUuid": "65ba6bd8-11af-462b-8eb5-6259c0d368d4",
          "attachmentOrder": "5",
          "description": "Confirmation of Permanent Residence"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentUuid": "cc0d7067-c495-434f-aa35-d066af2053f5",
          "attachmentOrder": "6",
          "description": "Confirmation of Permanent Residence"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentUuid": "eedbf9ff-3970-4895-92d2-253dfd9cf767",
          "attachmentOrder": "7",
          "description": "Marriage Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentUuid": "976f4ab1-41e1-4e14-8efc-847b34392db4",
          "attachmentOrder": "8",
          "description": "Marriage Certificate"
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentUuid": "4c502613-0298-4f48-a9aa-23831038e247",
          "attachmentOrder": "9",
          "description": SupportDocumentTypes.CanadianBirthCertificate
        },
        {
          "contentType": "IMAGE_JPEG",
          "attachmentDocumentType": "SupportDocument",
          "attachmentUuid": "033350b3-3ff8-483f-9095-aab0af58f44c",
          "attachmentOrder": "10",
          "description": SupportDocumentTypes.CanadianBirthCertificate
        }
      ]
    }
  }
}