// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { padInteger } from './helpers';
import { SupportDocumentTypes } from '../../src/constants/document-types';
import { StatusInCanada } from '../../src/constants/immigration-status-types';
// NOTE: using cy.fixture for the sample pdf multiple times has issues, using dir works better with selectFile
const samplePDF = 'cypress/fixtures/sample.pdf';
const currentDate = new Date();
const lastMonthDate = new Date();
lastMonthDate.setMonth(currentDate.getMonth() - 1);


Cypress.Commands.add('fillName', (firstName = 'alex', middleName = 'jaimie', lastName = 'doe') => {
  cy.get('input#first-name').type(firstName);
  cy.get('input#middle-name').type(middleName);
  cy.get('input#last-name').type(lastName);
});

Cypress.Commands.add('fillIdFields', (phn = '9999999998', sin = '238795439') => {
  cy.get('input#personal-health-number').type(phn)
  cy.get('input#social-insurance-number').type(sin)
})

Cypress.Commands.add('continue', () => {
  cy.get('div.continue-bar').contains('Continue').click()
})

Cypress.Commands.add("fillPersonalInfoPage", (options) => {
  cy.fillName();

  cy.get('select#birthdate-month').select('0');
  cy.get('input#birthdate-day').type('01');
  cy.get('input#birthdate-year').type('2000');

  if (!options?.includeMSP) {
    cy.fillIdFields();
  } else {
    if (options.includeSB || options.includeFPC) {
      cy.get('input#social-insurance-number').type('238795439')
    }
    cy.get('label[for=gender-x]').click();

    cy.get('select#immigration-status').select(StatusInCanada.Citizen);
    cy.get('label[for=-new-to-province]').click();
    cy.get('select#citizen-support-document-type').select(SupportDocumentTypes.CanadianBirthCertificate);
    cy.get('label[for=gender-matches-no]').click();

    cy.get('input#citizenship-support-documents').selectFile(samplePDF, { force: true });
    cy.get("#citizenship-support-documents").parent().within(() => {
      cy.get(".thumbnail-image-container", { timeout: 20000 })
        .first()
        .should("exist");
    });
    cy.get('label[for=name-change-yes]').click();

    cy.get('select#name-change-doc-type').select(SupportDocumentTypes.MarriageCertificate);
    cy.get('#name-change-support-documents').selectFile(samplePDF, { force: true });
    cy.get("#name-change-support-documents").parent().within(() => {
      cy.get(".thumbnail-image-container", { timeout: 20000 })
        .first()
        .should("exist");
    });

    cy.get('label[for=is-moved-to-bc-permanently-yes]').click();

    cy.get('select#province-of-origin').select('Alberta');

    cy.get('select#arrival-date-in-bc-month').select('1');
    cy.get('input#arrival-date-in-bc-day').type('01');
    cy.get('input#arrival-date-in-bc-year').type('2001');

    cy.get('select#arrival-date-in-canada-month').select('1');
    cy.get('input#arrival-date-in-canada-day').type('01');
    cy.get('input#arrival-date-in-canada-year').type('2001');

    cy.get('input#previous-health-number').type('111 111 1111');

    cy.get('label[for=outside-bc-12-months-yes]').click();
    cy.get('input#departure-reason').type('vacation');
    cy.get('input#departure-location').type('bahamas');

    cy.get('select#departure-begin-date-month').select(String(lastMonthDate.getMonth()));
    cy.get('input#departure-begin-date-day').type(padInteger(lastMonthDate.getDate()));
    cy.get('input#departure-begin-date-year').type(lastMonthDate.getFullYear());

    cy.get('select#departure-return-date-month').select(String(currentDate.getMonth()));
    cy.get('input#departure-return-date-day').type(padInteger(currentDate.getDate()));
    cy.get('input#departure-return-date-year').type(currentDate.getFullYear());

    cy.get('label[for=has-previous-phn-yes]').click();
    cy.get('input#previous-phn').type('9999 999 998');

    cy.get('label[for=is-released-from-armed-forces-yes]').click();

    cy.get('select#armed-forces-discharge-date-month').select('1');
    cy.get('input#armed-forces-discharge-date-day').type('01');
    cy.get('input#armed-forces-discharge-date-year').type('2010');

    cy.get('label[for=is-student-yes]').click();
    cy.get('label[for=will-student-reside-in-bc-yes]').click();
  }
  cy.continue();
})

Cypress.Commands.add('fillEligibilityQuestionnaire', (options) => {
  cy.visit('/')

  if (!options.includeMSP) {
    cy.get('label[for=apply-msp-no]').click();
  } else {
    cy.get('label[for=apply-msp-yes]').click();
    cy.get('label[for=live-in-bc-yes]').click();
    cy.get('label[for=away-over-30-no]').click();
    cy.get('label[for=student-minor-refugee-no]').click();
    cy.get('label[for=has-documents-yes]').click();
  }
  cy.continue()

  if (!options.includeFPC) {
    cy.get('label[for=apply-fpc-no]').click();
  } else {
    cy.get('label[for=apply-fpc-yes]').click();
    cy.get('label[for=meets-fpc-criteria-yes]').click();
    cy.get('label[for=has-fpc-info-yes]').click();
  }
  cy.continue()

  if (!options.includeSB) {
    cy.get('label[for=apply-sb-no]').click();
  } else {
    cy.get('label[for=apply-sb-yes]').click();
    cy.get('label[for=meets-sb-criteria-yes]').click();
    cy.get('label[for=has-sb-info-yes]').click();
  }
  cy.continue()

  cy.get('input#msp').should('be.disabled')
  cy.get('input#msp').should(options.includeMSP ? 'be.checked' : 'not.be.checked')
  cy.get('input#fpc').should(options.includeFPC ? 'be.checked' : 'not.be.checked')
  cy.get('input#sb').should(options.includeSB ? 'be.checked' : 'not.be.checked')
  cy.continue()

  cy.get('input#input-answer').type('aaaaaa');
  cy.get('input#is-terms-accepted').click();
  cy.get('div.modal-footer').contains('Continue').click()

})

Cypress.Commands.add('fillSpousePage', (options) => {
  cy.get('label[for=has-spouse-yes]').click();
  cy.fillName('sarah');

  cy.get('select#birth-date-month').select('5');
  cy.get('input#birth-date-day').type('20')
  cy.get('input#birth-date-year').type('1990')

  if (!options?.includeMSP) {
    cy.fillIdFields('9348671676', '195544135');
  } else {

    if (options.includeSB || options.includeFPC) {
      cy.get('input#social-insurance-number').type('195544135')
    }

    cy.get('label[for=spouse-gender-x]').click();

    cy.get('select#spouse-status').select(StatusInCanada.PermanentResident)
    cy.get('label[for=spouse-status-reason-new-to-country]').click();
    cy.get('select#citizen-support-document-type').select(SupportDocumentTypes.PermanentResidentConfirmation);

    cy.get('label[for=spouse-gender-matches-no]').click();

    cy.get('input#spouse-citizenship-support-documents').selectFile(samplePDF, { force: true });
    cy.get("#spouse-citizenship-support-documents").parent().within(() => {
      cy.get(".thumbnail-image-container", { timeout: 20000 })
        .first()
        .should("exist");
    });
    cy.get('label[for=name-change-yes]').click();
    cy.get('select#name-change-doc-type').select(SupportDocumentTypes.MarriageCertificate);

    cy.get('input#spouse-name-change-support-documents').selectFile(samplePDF, { force: true });
    cy.get("#spouse-name-change-support-documents").parent().within(() => {
      cy.get(".thumbnail-image-container", { timeout: 20000 })
        .first()
        .should("exist");
    });

    cy.get('label[for=permanent-move-yes]').click();

    cy.get('select#spouse-country-of-origin').select('Afghanistan');

    cy.get('select#move-date-month').select('2');
    cy.get('input#move-date-day').type('02');
    cy.get('input#move-date-year').type('2015');

    cy.get('select#canada-arrival-date-month').select('2');
    cy.get('input#canada-arrival-date-day').type('02');
    cy.get('input#canada-arrival-date-year').type('2014');

    cy.get('label[for=outside-bc-past-12-no]').click();
    cy.get('label[for=has-previous-bc-health-number-no]').click();
  }
  cy.continue()
})

Cypress.Commands.add('fillChildPage', (options) => {
  cy.get('label[for=has-children-yes]').click()


  cy.get('input#child-first-name-0').type('ralph')
  cy.get('input#child-middle-name-0').type('j')
  cy.get('input#child-last-name-0').type('wiggum')

  cy.get('select#child-birth-date-0-month').select('1')
  cy.get('input#child-birth-date-0-day').type('01')
  cy.get('input#child-birth-date-0-year').type('2019')

  if (options?.includeFPC) {
    cy.get('input#personal-health-number-0').type('9344 507 929')
  }

  if (options?.includeMSP) {
    cy.get('label[for=child-age-range-0-0-18]').click()

    cy.get('label[for=child-gender-0-male]').click()
    cy.get('select#child-status-0').select(StatusInCanada.Citizen)

    cy.get('label[for=child-status-reason-0-not-new]').click()

    cy.get('select#citizen-support-document-type-0').select(SupportDocumentTypes.CanadianBirthCertificate)
    cy.get('label[for=gender-matches-0-yes]').click()

    cy.get('input#child-citizenship-support-documents-0').selectFile(samplePDF, { force: true });
    cy.get("#child-citizenship-support-documents-0").parent().within(() => {
      cy.get(".thumbnail-image-container", { timeout: 20000 })
        .first()
        .should("exist");
    });

    cy.get('label[for=name-change-0-no]').click()

    cy.get('label[for=lived-in-bc-0-yes]').click()
    cy.get('label[for=permanent-move-0-yes]').click()
    cy.get('label[for=permanent-move-0-yes]').click()
    cy.get('label[for=outside-bc-0-no]').click()

    cy.get('label[for=has-bc-health-number-0-no]').click()
    cy.get('label[for=been-released-0-no]').click()
  }
  cy.continue()
})

Cypress.Commands.add('fillSBInfoPage', (options) => {
  cy.get('label[for=select-noa-year-currentNOAYear').click()
  cy.get('input#ah-net-income').type('50000')
  cy.get('input#spouse-net-income').type('4000')

  if (!options.includeMSP) {
    cy.get('label[for=has-children-yes').click()
    cy.get('input#num-children').type('12')
  }

  cy.get('input#child-care-expenses').type('200')

  cy.get('label[for=has-disability-credit-yes').click()
  cy.get('label[for=selected-disability-credit-recipients-spouse').click()
  
  cy.get('label[for=has-disability-savings-yes').click()
  cy.get('input#disability-savings-plan').type('1000')

  cy.get('label[for=has-attendant-nursing-expenses-yes').click()
  cy.get('label[for=selected-attendant-nursing-recipients-ah').click()

  cy.get('input#attendant-nursing-receipts').selectFile(samplePDF, { force: true });
  cy.get("#attendant-nursing-receipts").parent().within(() => {
    cy.get(".thumbnail-image-container", { timeout: 20000 })
      .first()
      .should("exist");
  });
  
  // wait for file to fully upload
  cy.get("#attendant-nursing-receipts").parent().within(() => {
    cy.get(".thumbnail-image-container", { timeout: 20000 })
      .first()
      .should("exist");
  });
  cy.continue();  
})

Cypress.Commands.add('fillDocumentsPage', () => {
  cy.get('input#ah-cra-documents').selectFile(samplePDF, { force: true });
  cy.get("#ah-cra-documents").parent().within(() => {
    cy.get(".thumbnail-image-container", { timeout: 20000 })
      .first()
      .should("exist");
  });
  cy.get('input#spouse-cra-documents').selectFile(samplePDF, { force: true });
  cy.get("#spouse-cra-documents").parent().within(() => {
    cy.get(".thumbnail-image-container", { timeout: 20000 })
      .first()
      .should("exist");
  });
  // wait for file to fully upload
  cy.get("#spouse-cra-documents").parent().within(() => {
    cy.get(".thumbnail-image-container", { timeout: 20000 })
      .first()
      .should("exist");
  });
  cy.continue();
});

Cypress.Commands.add('fillResidentialAddress', () => {
  cy.get('input#res-address-line1').type('123 fake st.')
  cy.get('input#res-city').type('duncan')
  cy.get('input#res-postal-code').type('V8P1A1')
  cy.get('input#phone-input').type('555 555 5555')
  cy.continue()
});

Cypress.Commands.add('fillMailingAddress', () => {
  cy.get('input#mail-address-line1').type('123 fake st.')
  cy.get('input#mail-city').type('duncan')
  cy.get('input#mail-postal-code').type('V8P1A1')
  cy.get('input#phone-input').type('555 555 5555')
  cy.continue()
});

Cypress.Commands.add('fillFPCInfoPage', () => {
  cy.get('input#ah-income').type('20000')
  cy.get('input#spouse-income').type('20000')
  cy.get('input#ah-disability-savings').type('2000')
  cy.get('input#spouse-disability-savings').type('2000')
  cy.continue()
})

Cypress.Commands.add('fillConsent', (options) => {
  if (options?.includeMSP) {
    cy.get('label[for=msp-ah]').click()
    cy.get('label[for=msp-spouse]').click()
  }
  if (options?.includeFPC) {
    cy.get('label[for=fpc-ah]').click()
    cy.get('label[for=fpc-spouse]').click()
  }
  if (options?.includeSB) {
    cy.get('label[for=sb-ah]').click()
    cy.get('label[for=sb-spouse]').click()
  }
})

Cypress.Commands.add('submitApplication', () => {
  cy.get('div.continue-bar').contains('Submit').click()
})

Cypress.Commands.add('validateApplicant', () => {
  //First name
  cy.get('[data-cy=first-name]').clear()
  cy.get("[data-cy=continue]").click();
  cy.contains(
    "First name is required."
  );
  cy.get('[data-cy=first-name]').type("111")
  cy.get("[data-cy=continue]").click();
  cy.contains(
    "First name must begin with a letter"
  );
  cy.get('[data-cy=first-name]').clear()
  cy.get('[data-cy=first-name]').type("alex")
  //Middle name
  cy.get('[data-cy=middle-name]').clear()
  cy.get('[data-cy=middle-name]').type("111")
  cy.contains(
    "Middle name must begin with a letter"
  );
  cy.get('[data-cy=middle-name]').clear()
  cy.get('[data-cy=middle-name]').type("jaimie")
  //Last name
  cy.get('[data-cy=last-name]').clear()
  cy.get('[data-cy=last-name]').type("111")
  cy.contains(
    "Last name must begin with a letter"
  );
  cy.get('[data-cy=last-name]').clear()
  cy.get('[data-cy=last-name]').type("doe")
})
