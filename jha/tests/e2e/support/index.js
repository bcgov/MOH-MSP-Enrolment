// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

beforeEach(() => {
  cy.intercept('POST', '/ahdc/api/jhaIntegration/getDeductibles', {
    statusCode: 200,
  })

  cy.intercept('POST', '/ahdc/api/jhaIntegration/forwardCheckEligibility', {
    statusCode: 200,
    body: {
      regStatusCode: '0'
    }
  })

  cy.intercept('POST', '/ahdc/api/jhaIntegration/application/**', { statusCode: 200 } ).as('submitApplication')

  cy.intercept('/ahdc/api/jhaIntegration/version', {
    statusCode: 200,
  })

  cy.intercept('POST', '/ahdc/api/captcha/verify/captcha', {
    statusCode: 200,
    body: {
      valid: true,
    }
  });
  
  cy.intercept('POST', '/ahdc/api/submit-attachment/**', {
    statusCode: 200,
    body: {
      returnCode: 'success'
    }
  })
})
