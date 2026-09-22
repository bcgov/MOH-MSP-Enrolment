// DEAM personal-info page
// (src/app/modules/account/pages/personal-info/personal-info.component.html).
// Account holder identification is rendered by account-personal-information
// (src/app/modules/account/components/personal-information/personal-information.component.html:6-66),
// which always requires first name, last name and birthdate, and requires
// the PHN too as long as hasActiveMedicalServicePlan/immigrationStatusChange
// have not been set to false (personal-information.component.ts:113-116) -
// true for a fresh application, so PHN is required here.

const { fillLabeledField, fillDate, chooseRadio, clickActionBarButton } = require('./common-controls');

const UPDATE_QUESTION =
  'As the Account Holder, are you requesting an update to your personal information or renewing your status in Canada?';

function fillAccountHolder({ firstName, lastName, phn, birthDate }) {
  fillLabeledField('common-name', 'First name', firstName);
  fillLabeledField('common-name', 'Last name', lastName);
  fillLabeledField('common-phn', 'Personal Health Number', phn);
  fillDate('Birthdate', birthDate);
}

// personal-info.component.html:16-24 - answering "No" here keeps this
// happy path out of the document-upload branch (msp-update-request, shown
// only when the answer is "Yes").
function declineUpdateRequest() {
  chooseRadio(UPDATE_QUESTION, 'No');
}

function continueToSpouseInfo() {
  clickActionBarButton();
}

module.exports = {
  fillAccountHolder,
  declineUpdateRequest,
  continueToSpouseInfo,
};
