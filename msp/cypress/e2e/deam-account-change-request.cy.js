// Happy-path walk of the DEAM (Account Change Request) module, the flow
// deam-account-home.cy.js only smoke-tests the entry point of. Page list
// and paths come from src/app/modules/account/account-pages.route.ts and
// src/app/modules/account/account.constants.ts, not from the deleted
// Protractor suite (commit 908831e removed msp/e2e/account/**) - the old
// page objects (git show 908831e^:msp/e2e/account/src/mspac-account.po.ts)
// were only used to see what step order and field coverage looked like
// before this rewrite, and to source fixture values (see
// cypress/fixtures/account-holder.json, removed-spouse.json,
// contact-address.json).
//
// The account holder answers "No" to updating their own personal
// information and removes a spouse for reason "Deceased" instead of
// adding/updating one or a child: ChildInfoComponent blocks Continue with
// a "missing required information" modal unless at least one of
// personal-info/spouse-info/child-info actually changed something
// (child-info.component.ts:522-525), and removing a spouse for "Deceased"
// is the only one of those branches whose own validation
// (spouse-info.component.ts:313-370) does not also require a document
// upload - see cypress/support/pages/account-spouse-info-page.js.
//
// AccountSendingComponent submits the application through
// SchemaService.validate() (src/app/models/schema.ts, a ~1200-line Ajv
// schema) before it ever reaches the stubbed submission endpoint below;
// this spec's minimal fixture data has been confirmed, by running the
// suite, to pass that validation and reach /deam/confirmation with a
// success status. /deam/sending itself is a transitional page
// (AccountSendingComponent submits and redirects in ngAfterContentInit)
// and is not asserted on directly, since it can already be gone by the
// time an assertion against it runs.

const homePage = require('../support/pages/account-home-page');
const personalInfoPage = require('../support/pages/account-personal-info-page');
const spouseInfoPage = require('../support/pages/account-spouse-info-page');
const childInfoPage = require('../support/pages/account-child-info-page');
const contactInfoPage = require('../support/pages/account-contact-info-page');
const reviewPage = require('../support/pages/account-review-page');
const authorizePage = require('../support/pages/account-authorize-page');
const { stubCaptcha } = require('../support/pages/captcha-helpers');

describe('DEAM account change request - happy path', () => {
  let consoleErrors;

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
    // with no error handler, so a real failed POST here would surface as an
    // uncaught observable error - and it runs unconditionally as soon as
    // AccountSendingComponent loads (sending.component.ts:67-73).
    cy.intercept('POST', '**/msp/api/logging', { statusCode: 200, body: 'OK' });

    // Captcha challenge/verify, see cypress/support/pages/captcha-helpers.js.
    // Registered here, before any navigation, so the intercepts are already
    // active once the authorize page's captcha renders several steps later.
    stubCaptcha('/msp/api/captcha');

    // Defensive only: reached solely if SchemaService.validate() passes
    // against this spec's minimal data (see module comment above). Not
    // asserted on either way.
    cy.intercept('POST', '**/msp/api/submit-application/*', {
      statusCode: 200,
      body: { op_return_code: 'SUCCESS', op_reference_number: '999999' },
    });

    cy.visit('/deam/home');
    cy.wait('@checkMaintenance');
  });

  afterEach(() => {
    expect(consoleErrors, 'browser console.error calls').to.have.length(0);
  });

  it('walks personal info, spouse removal, child skip, contact info, review and authorize', () => {
    cy.fixture('account-holder').then((accountHolder) => {
      cy.fixture('removed-spouse').then((removedSpouse) => {
        cy.fixture('contact-address').then((contactAddress) => {
          homePage.acceptConsent();
          homePage.goToManageAccount();

          cy.get('h1').should('contain.text', 'Medical Services Plan Account Holder');
          personalInfoPage.fillAccountHolder(accountHolder);
          personalInfoPage.declineUpdateRequest();
          personalInfoPage.continueToSpouseInfo();

          cy.get('h1').should('contain.text', 'Manage spouse information on your account');
          spouseInfoPage.removeSpouse();
          spouseInfoPage.fillRemovedSpouse(removedSpouse);
          spouseInfoPage.continueToChildInfo();

          cy.get('h1').should('contain.text', 'Manage child information on your account');
          childInfoPage.skip();

          cy.get('h1').should('contain.text', 'Contact Information');
          contactInfoPage.fillResidentialAddress(contactAddress);
          contactInfoPage.continueToReview();

          cy.get('h1').should('contain.text', 'Review your request');
          reviewPage.continueToAuthorize();

          cy.get('h1').should('contain.text', 'Authorize and submit your request');
          authorizePage.agreeToAuthorization();
          authorizePage.solveCaptcha();
          authorizePage.submit();

          // confirmation.component.html:9,16,20 - the success block, shown
          // when AccountConfirmationComponent's isSuccess getter (driven by
          // the ?status= query param AccountSendingComponent navigates
          // with) is true. '999999' is the op_reference_number this spec's
          // stubbed **/msp/api/submit-application/* response returns.
          cy.location('pathname', { timeout: 10000 }).should('include', '/deam/confirmation');
          cy.get('h1').should('contain.text', 'Confirmation Message');
          cy.contains('Your update request has been submitted').should('be.visible');
          cy.contains('Reference # 999999').should('be.visible');
        });
      });
    });
  });
});
