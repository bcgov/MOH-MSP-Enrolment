import { generateRequestObject } from '../fixtures/fpcStandaloneRequest';
import { removeUniqueFields } from '../helpers';

describe('FPC only application', () => {
  const options = { includeFPC: true }
  it('Fills eligibility questionnaire', () => {
    cy.fillEligibilityQuestionnaire(options)
  })

  it('Accepts valid information for the personal-info page', () => {
    cy.fillPersonalInfoPage(options)
  });

  it('Accepts valid information for the spouse page', () => {
    cy.fillSpousePage(options)
  });

  it('Accepts valid information for the child page', () => {
    cy.fillChildPage(options)
  })

  it('Accepts valid information for the FPC info page', () => {
    cy.fillFPCInfoPage()
  })

  it('Accepts valid information for the contact info page', () => {
    cy.fillMailingAddress()
  });

  it('Displays the phone number with contact information', () => {
    cy.contains('(555) 555-5555')
    cy.continue();
  })
  
  it('Submits with the expected payload', () => {
    cy.fillConsent(options);
    cy.submitApplication();
    cy.wait('@submitApplication')
      .then(interception => {
        expect(removeUniqueFields(interception.request.body)).to.deep.equal(removeUniqueFields(generateRequestObject()))
      });
  });

  it('Redirects user to confirmation page when successful', () => {
    cy.url().should('include', 'submission');
    cy.contains('Confirmation of submission')
  });
});
