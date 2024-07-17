import { generateRequestObject } from '../fixtures/sbStandaloneRequest.js';
import { removeUniqueFields } from '../support/helpers';

describe('SB only application', () => {
  const options = {includeSB: true}
  it('Fills eligibility questionnaire', () => {
    cy.fillEligibilityQuestionnaire(options)
  });

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
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/contact-info");
    });
  });

  it('Accepts valid information for the contact info page', () => {
    cy.fillMailingAddress()
  });

  it('Displays the phone number with contact information', () => {
    cy.contains('(555) 555-5555')
    cy.continue();
  });

  it('submits form with expected payload', () => {
    cy.fillConsent(options)
    cy.submitApplication()
    cy.wait('@submitApplication')
      .then(interception => {
        expect(removeUniqueFields(interception.request.body)).to.deep.equal(removeUniqueFields(generateRequestObject()))
      })
  });

  it('Redirects user to confirmation page when successful', () => {
    cy.url().should('include', 'submission');
    cy.contains('Confirmation of submission')
  });
});
