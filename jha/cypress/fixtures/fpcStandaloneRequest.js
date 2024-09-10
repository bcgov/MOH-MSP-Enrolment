import { formatISODate } from 'common-lib-vue';
import envData from '../fixtures/env-data.js';

export const generateRequestObject = () => {
  const currentDate = new Date();

  return {
    "firstName": envData.firstName,
    "secondName": envData.middleName,
    "lastName": envData.lastName,
    "sin": envData.sin,
    "phn": envData.phn,
    "gender": null,
    "birthDate": envData.birthDateTotal,
    "telephone": "5555555555",
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
      "gender": null,
      "birthDate": "1990-06-20",
      "telephone": "5555555555",
      "sin": "195544135",
      "phn": "9348671676"
    },
    "fairPharmaCare": {
      "uuid": "1f630383-be09-4bbf-b980-a516ce6ffb6f",
      "clientName": null,
      "processDate": formatISODate(currentDate),
      "accountHolderNetIncome": "20000",
      "accountHolderRDSP": "2000",
      "spouseNetIncome": "20000",
      "spouseRDSP": "2000",
      "spousePostalCode": "V8P1A1",
      "persons": [
        {
          "givenName": "ralph",
          "surname": "wiggum",
          "postalCode": "V8P1A1",
          "perType": "2",
          "dateOfBirth": "2019-02-01",
          "phn": "9344507929"
        }
      ],
      "attachments": [],
      "familyNumber": null,
      "deductibleAmount": null,
      "annualMaximumAmount": null,
      "copayPercentage": null
    }
  }
}