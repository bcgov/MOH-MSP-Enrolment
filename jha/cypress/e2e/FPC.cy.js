import { generateRequestObject } from '../fixtures/fpcStandaloneRequest';
import { removeUniqueFields } from '../support/helpers';
import envData from '../fixtures/env-data.js'

describe('FPC only application', () => {
  const options = { includeFPC: true }
  it('Fills eligibility questionnaire', () => {
    cy.fillEligibilityQuestionnaire(options)
  })

  it('Accepts valid information for the personal-info page', () => {
    cy.fillPersonalInfoPage(options)
  });

  it('Accepts valid information for the spouse page', () => {
    if (envData.skipSpouse) {
      cy.skipSpousePage();
    } else {
      cy.fillSpousePage(options);
    }    
  });

  it('Accepts valid information for the child page', () => {
    if (envData.skipChild) {
      cy.skipChildPage();
    } else {
      cy.fillChildPage(options)      
    } 
  })

  it('Accepts valid information for the FPC info page', () => {
    cy.fillFPCInfoPage()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/contact-info");
    });
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
    if (envData.enableIntercepts) {
      //in the local environment, we want to check that the intercepted API response matches what it should
      cy.wait('@submitApplication')
      .then(interception => {
        expect(removeUniqueFields(interception.request.body)).to.deep.equal(removeUniqueFields(generateRequestObject()))
      });
    }
  });

  it('Redirects user to confirmation page when successful', () => {
    cy.url({ timeout: 20000 }).should('include', 'submission');
    cy.contains('Confirmation of submission')
  });
});
