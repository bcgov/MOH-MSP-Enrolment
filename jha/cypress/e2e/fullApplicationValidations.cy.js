// import { generateRequestObject } from '../fixtures/fullApplication.js';
// import { removeUniqueFields } from '../helpers';

describe('Full application for MSP FPC and SB (validations)', () => {
  // const options = {includeMSP: true, includeFPC: false, includeSB: true}
  it('Navigates the MSP Elibility page', () => {
    const eligibilityError = "Please complete the questionnaire to continue.";
    cy.visit("/msp-eligibility");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/msp-eligibility");
    });
    cy.get("[data-cy=apply-msp-yes]").click({
      force: true,
    });
    cy.get("[data-cy=continue]").click();
    cy.contains(eligibilityError);
    cy.get("[data-cy=live-in-bc-no]").click({
      force: true,
    });
    cy.contains("you may not be eligible for MSP or related income-based programs.");
  });
    
  // it('Fills eligibility questionnaire', () => {
  //   cy.fillEligibilityQuestionnaire(options)
  // });

  // it('Accepts valid information for the personal-info page', () => {
  //   cy.fillPersonalInfoPage(options)
  // });

  // it('Accepts valid information for the spouse page', () => {
  //   cy.fillSpousePage(options)
  // });

  // it('Accepts valid information for the child page', () => {
  //   cy.fillChildPage(options)
  // });

  // it('Accepts valid information for the supplemental benefits information page', () => {
  //   cy.fillSBInfoPage(options)
  // });

  // it('Accepts valid information for the documents page', () => {
  //   cy.fillDocumentsPage()
  // });

  // it('Accepts valid information for the contact info page', () => {
  //   cy.fillResidentialAddress()
  // });

  // it('Displays the phone number with contact information', () => {
  //   cy.contains('(555) 555-5555')
  //   cy.continue();
  // });

  // it('submits form with expected payload', () => {
  //   cy.fillConsent(options)
  //   cy.submitApplication()
  //   cy.wait('@submitApplication')
  //     .then(interception => {
  //       expect(removeUniqueFields(interception.request.body)).to.deep.equal(removeUniqueFields(generateRequestObject()))
  //     })
  // });

  // it('Redirects user to confirmation page when successful', () => {
  //   cy.url().should('include', 'submission');
  //   cy.contains('Confirmation of submission')
  // });
});
