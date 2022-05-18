import { generateRequestObject } from '../fixtures/mspStandaloneRequest.js';
import { removeUniqueFields } from '../helpers';

describe('MSP only application', () => {
  it('Fills eligibility questionnaire', () => {
    cy.fillEligibilityQuestionnaire({
      includeMSP: true,
      includeFPC: false,
      includeSB: false,
    })
  })

  it('Accepts valid information for the personal-info page', () => {
    cy.fillPersonalInfoPage()
  });

  it('Accepts valid information for the spouse page', () => {
    cy.fillSpousePage()
  });

  it('Accepts valid information for the child page', () => {
    cy.fillChildPage()
  })

  it('Accepts valid information for the contact info page', () => {
    cy.fillContactInfoPage()
  })

  it('submits form with expected payload', () => {
    cy.intercept('POST', '/ahdc/api/jhaIntegration/application/**', { statusCode: 200 }).as('submitApplication')
    cy.continue()
    cy.get('label[for=msp-ah]').click()
    cy.get('label[for=msp-spouse]').click()
    cy.get('div.continue-bar').contains('Submit').click()
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
