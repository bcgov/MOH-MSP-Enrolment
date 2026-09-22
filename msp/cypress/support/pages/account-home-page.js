// DEAM home page (src/app/modules/account/pages/home/home.component.html).
// The consent modal markup and selectors here match the pattern already
// established in cypress/e2e/deam-account-home.cy.js.

function acceptConsent() {
  cy.get('.modal.show .form-check-input').should('be.visible').check({ force: true });
  cy.get('.modal.show .modal-footer button').should('be.enabled').click();
}

// "Manage Account" button, home.component.html:81-83:
// <button #manageAccount ... routerLink="/deam/personal-info"><span>Manage Account</span></button>
function goToManageAccount() {
  cy.contains('button', 'Manage Account').click();
}

module.exports = {
  acceptConsent,
  goToManageAccount,
};
