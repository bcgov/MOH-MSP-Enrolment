// ACL request-letter page
// (src/app/modules/request-acl/pages/request-letter/request-letter.component.html).
//
// stubCaptcha() (cypress/support/pages/captcha-helpers.js) must be called
// by the spec before navigating onto this page: RequestLetterComponent
// only renders <common-captcha> once the rest of the form is valid and the
// consent has been accepted (request-letter.component.ts:134-136), but the
// intercepts still need to be registered ahead of that first fetch.
//
// Neither common-phn nor common-postal-code overrides the [label] input in
// this template (request-letter.component.html:23-31,43-48), so both use
// PhnComponent/PostalCodeComponent's own defaults, "Personal Health Number
// (PHN)" and "Postal Code" - read from the component class fields in
// moh-common-lib-angular.mjs (PhnComponent.label, PostalCodeComponent.label),
// not from this app's template.

const { fillLabeledField, fillDate, chooseRadio, clickActionBarButton } = require('./common-controls');
const { solveCaptcha } = require('./captcha-helpers');

const MEMBERSHIP_QUESTION =
  'Whose Medical Services Plan enrolment information should be included in the Account Confirmation Letter?';

function acceptConsent() {
  cy.get('.modal.show .form-check-input').should('be.visible').check({ force: true });
  cy.get('.modal.show .modal-footer button').should('be.enabled').click();
}

function fillAccountHolder({ phn, birthDate, postal }) {
  fillLabeledField('common-phn', 'Personal Health Number', phn);
  fillDate('Birthdate', birthDate);
  fillLabeledField('common-postal-code', 'Postal Code', postal);
}

// request-letter.component.ts:100-108 - selecting "Myself only" keeps
// isSpecificMember false, so the Specific Member Information section
// (request-letter.component.html:62-79) never opens.
function chooseMyselfOnly() {
  chooseRadio(MEMBERSHIP_QUESTION, 'Myself only');
}

function submit() {
  clickActionBarButton();
}

module.exports = {
  acceptConsent,
  fillAccountHolder,
  chooseMyselfOnly,
  solveCaptcha,
  submit,
};
