import { generateRequestObject } from '../fixtures/mspStandaloneRequest.js';
import { removeUniqueFields } from '../helpers';

describe('MSP only application', () => {
  const options = {includeMSP: true}
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

  it('Accepts valid information for the contact info page', () => {
    cy.fillResidentialAddress()
  })

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
