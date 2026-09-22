// ACL confirmation page
// (src/app/modules/request-acl/pages/acl-confirmation/acl-confirmation.component.html).
// isSucess (component's own spelling, acl-confirmation.component.ts:61-63)
// drives which message block renders: the success block is
// `<p class="icon--message">Success</p>` (line 16), the error block is
// `<p class="icon--message">Error</p>` (line 55).

function assertSuccess(referenceNumber) {
  cy.get('h1').should('contain.text', 'Confirmation Message');
  cy.contains('.icon--message', 'Success').should('be.visible');
  cy.contains(`Reference # ${referenceNumber}`).should('be.visible');
}

module.exports = {
  assertSuccess,
};
