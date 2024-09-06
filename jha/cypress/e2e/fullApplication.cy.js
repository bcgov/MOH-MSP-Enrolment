import { generateRequestObject } from '../fixtures/fullApplication.js';
import { removeUniqueFields } from '../support/helpers';
import envData from '../fixtures/env-data.js'

describe('Full application for MSP FPC and SB', () => {
  const options = {includeMSP: true, includeFPC: false, includeSB: true}
  it('Fills eligibility questionnaire', () => {
    cy.fillEligibilityQuestionnaire(options)
  });

  it('Accepts valid information for the personal-info page', () => {
    cy.fillPersonalInfoPage(options)
  });

  it('Accepts valid information for the spouse page', () => {
    cy.fillSpousePage(options)
  });

  it('Accepts valid information for the child page', () => {
    cy.fillChildPage(options)
  });

  it('Accepts valid information for the supplemental benefits information page', () => {
    cy.fillSBInfoPage(options)
  });

  it('Accepts valid information for the documents page', () => {
    cy.fillDocumentsPage()
  });

  it('Accepts valid information for the contact info page', () => {
    cy.fillResidentialAddress()
  });

  it('Displays the phone number with contact information', () => {
    cy.contains('(555) 555-5555')
    cy.continue();
  });

  it('submits form with expected payload', () => {
    cy.fillConsent(options)
    cy.submitApplication()
    //in the local environment, we want to check that the intercepted API response matches what it should
    if (envData.enableIntercepts) {
      cy.wait('@submitApplication')
      .then(interception => {
        expect(removeUniqueFields(interception.request.body)).to.deep.equal(removeUniqueFields(generateRequestObject()))
      })
    }    
  });

  it('Redirects user to confirmation page when successful', () => {
    cy.url({ timeout: 20000 }).should('include', 'submission');
    cy.contains('Confirmation of submission')
  });
});
