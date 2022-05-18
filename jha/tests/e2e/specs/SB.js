import { generateRequestObject } from '../fixtures/sbStandaloneRequest.js';
import { removeUniqueFields } from '../helpers';

describe('SB only application', () => {
  const options = {includeSB: true}
  it('Fills eligibility questionnaire', () => {
    cy.fillEligibilityQuestionnaire(options)
  })

  it('Accepts valid information for the personal-info page', () => {
    cy.fillPersonalInfoPage(options)
  });

  it('Accepts valid information for the spouse page', () => {
    cy.fillSpousePage(options)
  });

  it('Accepts valid information for the supplemental benefits information page', () => {
    cy.fillSBInfoPage(options)
  });

  it('Accepts valid information for the documents page', () => {
    cy.fillDocumentsPage()
  });

  it('Accepts valid information for the contact info page', () => {
    cy.fillMailingAddress()
  });

  it('submits form with expected payload', () => {
    cy.continue()
    cy.fillConsent(options)
    cy.submitApplication()
    cy.wait('@submitApplication')
      .then(interception => {
        expect(removeUniqueFields(interception.request.body)).to.deep.equal(removeUniqueFields(generateRequestObject()))
      })
  });

  it('Redirects user to confirmation page when successful', () => {
    cy.url().should('include', 'submission');
    cy.contains('Confirmation of Submission')
  });
});
