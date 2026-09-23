// DEAM spouse-info page
// (src/app/modules/account/pages/spouse-info/spouse-info.component.html).
//
// The happy path here removes a spouse for reason "Deceased" rather than
// adding or updating one: SpouseInfoComponent.checkAdd()/checkUpdate()
// (spouse-info.component.ts) both require at least one document upload,
// while checkRemove() only requires a cancellation reason plus, for
// "Deceased", a single cancellation date
// (spouse-info.component.ts:344-359) - no document needed. This is also
// the cheapest way to satisfy ChildInfoComponent.isFormMissingRequiredInfo()
// (child-info.component.ts:522-525) without touching the personal-info
// update branch or its document uploads.
//
// Field identification reuses account-personal-information
// (remove-spouse.component.html:1-4), same shape as the account holder's
// own identification block.

const { fillLabeledField, fillDate, clickActionBarButton } = require('./common-controls');

// spouse-info.component.html:26-34 - only the top button row exists before
// any of Add/Remove/Update has been clicked.
function removeSpouse() {
  cy.contains('button', 'Remove Spouse').click();
}

function fillRemovedSpouse({ firstName, lastName, phn, birthDate, cancellationDate }) {
  fillLabeledField('common-name', 'First name', firstName);
  fillLabeledField('common-name', 'Last name', lastName);
  fillLabeledField('common-phn', 'Personal Health Number', phn);
  fillDate('Birthdate', birthDate);

  // remove-spouse.component.html:10-26 - select box, options labelled from
  // remove-spouse.component.ts:65-90. "Deceased" is enum value 3.
  cy.get('select[aria-label="Reason for cancellation"]').select('Deceased');

  // remove-spouse.component.html:138-149 - only rendered once
  // cancellationReason === 3 (Deceased).
  fillDate('Date of deceased', cancellationDate);
}

function continueToChildInfo() {
  clickActionBarButton();
}

module.exports = {
  removeSpouse,
  fillRemovedSpouse,
  continueToChildInfo,
};
