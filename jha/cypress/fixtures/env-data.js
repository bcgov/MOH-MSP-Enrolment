import * as fixtureDataTest from "./data-test.json";
import * as fixtureDataDev from "./data-dev.json";
import * as fixtureDataLocal from "./data-local.json";

//api intercepts should always be enabled in the local environment so the build pipeline doesn't fail due to an API issue
//api intercepts are disabled in DEV/TEST by default
//this way these tests can actually check whether the APIs are working or not

const envData = {
  forceFPCIntercept: true, //if you don't have working test data for the DEV/TEST environment, set this to true so you can still verify the other APIs
  skipChild: false, //if do have test data, but that test data doesn't have children on its account, you may want to skip the child data entry + verification on the form. You can do all of them at once here
  skipSpouse: false, //same with spouse
};

if (Cypress.env("environment") === "test") {
  Object.assign(envData, fixtureDataTest);
  envData.enableIntercepts = false;
} else if (Cypress.env("environment") === "dev") {
  Object.assign(envData, fixtureDataDev);
  envData.enableIntercepts = false;
} else {
  //local environment
  Object.assign(envData, fixtureDataLocal);
  envData.enableIntercepts = true;
  envData.skipChild = false; //spouse and child should always be entered in local, since the API is intercepted and the validation will never fail
  envData.skipSpouse = false;
}

envData.birthDateTotal = `${envData.birthYear}-${envData.birthMonth}-${envData.birthDay}`;

/*envData is now an object with an enableIntercepts property and some combination of test data
eg
{
  enableIntercepts: false,
  skipChild: false,
  skipSpouse: false,
  firstName: "alex",
  middleName: "jaimie",
  lastName: "doe",
  phn: "9999999998",
  sin: "238795439",
  birthMonth: "01",
  birthDay: "01",
  birthYear: "2000",
  birthDateTotal: "2000-01-01"
}
*/

export default envData;
