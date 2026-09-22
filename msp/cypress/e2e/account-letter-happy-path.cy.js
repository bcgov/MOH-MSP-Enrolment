// Happy-path walk of the ACL (Account Confirmation Letter) module, past the
// consent-modal smoke test in account-letter-request.cy.js. Page list comes
// from src/app/modules/request-acl/request-acl-routing.module.ts and
// src/app/modules/request-acl/request-acl-route-constants.ts: request-acl
// then confirmation are the only two routes RequestAclModule registers.
//
// The deleted Protractor suite (commit 908831e) never had a working ACL
// spec of its own - only a page object
// (git show 908831e^:msp/e2e/acl/src/mspacl.po.ts) with no matching
// *.data.ts or *-spec.ts alongside it - so this flow and its fixture
// (cypress/fixtures/acl-request.json) were built from the current
// request-letter.component.ts/.html directly, reusing only the two literal
// values that old page object's fillPage() left as evidence of what the
// backend expects (the PHN and postal code fixed in
// cypress/fixtures/acl-request.json).
//
// "Myself only" is chosen for the membership question so the Specific
// Member Information section (request-letter.component.html:62-79) never
// opens - the happy path only needs one identity's worth of fields.

const requestLetterPage = require('../support/pages/request-letter-page');
const aclConfirmationPage = require('../support/pages/acl-confirmation-page');
const { stubCaptcha } = require('../support/pages/captcha-helpers');

describe('Account confirmation letter request - happy path', () => {
  let consoleErrors;
  const referenceNumber = '888777';

  beforeEach(() => {
    consoleErrors = [];
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake((...args) => {
        consoleErrors.push(args.join(' '));
      });
    });

    cy.intercept('POST', '**/msp/api/env', {
      statusCode: 200,
      body: {
        SPA_ENV_MSP_MAINTENANCE_FLAG: 'false',
        SPA_ENV_MSP_MAINTENANCE_MESSAGE: '',
        SPA_ENV_ACL_MAINTENANCE_FLAG: 'false',
        SPA_ENV_ACL_MAINTENANCE_MESSAGE: '',
        SPA_ENV_PACUTOFF_MAINTENANCE_FLAG: 'false',
        SPA_ENV_PACUTOFF_MAINTENANCE_MESSAGE: '',
        SPA_ENV_PACUTOFF_MAINTENANCE_START: '',
        SPA_ENV_NOW: '',
        SPA_ENV_PACUTOFF_MAINTENANCE_END: '',
        SPA_ENV_SUPPBEN_MAINTENANCE_FLAG: 'false',
        SPA_ENV_SUPPBEN_MAINTENANCE_MESSAGE: '',
      },
    }).as('checkMaintenance');

    // MspLogService.log() (src/app/services/log.service.ts:71-72) subscribes
    // with no error handler; RequestLetterComponent.continue() calls it on
    // the success path too (request-letter.component.ts:212-218).
    cy.intercept('POST', '**/msp/api/logging', { statusCode: 200, body: 'OK' });

    // Captcha challenge/verify, see cypress/support/pages/captcha-helpers.js.
    stubCaptcha('/msp/api/captcha');

    // AclApiService.sendAclRequest() (acl-api.service.ts:26-46) posts to
    // {apiBaseUrl}{aclContextPath}{uuid} - apiBaseUrl and aclContextPath are
    // src/environments/environment.ts:24-25. The response shape below is
    // what RequestLetterComponent.continue() (request-letter.component.ts:
    // 204-206) treats as success: a referenceNumber plus
    // dberrorCode/rapidResponse both 'Y'.
    cy.intercept('POST', '**/accLetterIntegration/*', {
      statusCode: 200,
      body: { referenceNumber, dberrorCode: 'Y', rapidResponse: 'Y' },
    }).as('sendAclRequest');

    cy.visit('/account-letter/request-acl');
    cy.wait('@checkMaintenance');
  });

  afterEach(() => {
    expect(consoleErrors, 'browser console.error calls').to.have.length(0);
  });

  it('requests a confirmation letter for myself and reaches the confirmation page', () => {
    cy.fixture('acl-request').then((data) => {
      requestLetterPage.acceptConsent();

      cy.get('h1').should('contain.text', 'Request Medical Services Plan Account Confirmation Letter');
      requestLetterPage.fillAccountHolder(data);
      requestLetterPage.chooseMyselfOnly();
      requestLetterPage.solveCaptcha();
      requestLetterPage.submit();

      cy.wait('@sendAclRequest');
      aclConfirmationPage.assertSuccess(referenceNumber);
    });
  });
});
