// import { generateRequestObject } from '../fixtures/fullApplication.js';
// import { removeUniqueFields } from '../helpers';

describe("Full application for MSP FPC and SB (validations)", () => {
  // const options = {includeMSP: true, includeFPC: false, includeSB: true}
  it("Validates the MSP Elibility page", () => {
    const eligibilityError = "Please complete the questionnaire to continue.";
    cy.visit("/msp-eligibility");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/msp-eligibility");
    });
    //Question 1: Will you apply for MSP? (e2e test assumes yes)
    cy.get("[data-cy=apply-msp-yes]").click({
      force: true,
    });
    cy.get("[data-cy=continue]").click();
    cy.contains(eligibilityError);
    //Question 2: Do you live in BC Y/N
    //Click no
    cy.get("[data-cy=live-in-bc-no]").click({
      force: true,
    });
    //Contains error
    cy.contains(
      "you may not be eligible for MSP or related income-based programs."
    );
    //Click continue
    cy.get("[data-cy=continue]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/form-selection");
    });
    //Next page contains different error
    cy.contains(
      "You might not qualify for MSP or related income-based programs if you do not live in B.C."
    );
    //Stops form progress
    cy.get("[data-cy=continue]").click();
    cy.contains("You must select at least one program.");
    //Go back, set up form correctly for next question
    cy.go("back");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/msp-eligibility");
    });
    cy.get("[data-cy=live-in-bc-yes]").click({
      force: true,
    });
    //Question 3: Will you be away for 30 days Y/N
    //Click yes
    cy.get("[data-cy=away-over-30-yes]").click({
      force: true,
    });
    //Contains error
    cy.contains(
      "If you leave B.C. for more than 30 days in total during the first six months after applying for MSP, you may not be considered a B.C. resident"
    );
    //Click continue
    cy.get("[data-cy=continue]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/form-selection");
    });
    //Next page contains different error
    cy.contains(
      "You or your family member might not qualify for MSP or related income-based programs if you leave the province for more than 30 days in total during the first six months after you apply"
    );
    //Stops form progress
    cy.get("[data-cy=continue]").click();
    cy.contains("You must select at least one program.");
    //Go back, set up form correctly for next question
    cy.go("back");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/msp-eligibility");
    });
    cy.get("[data-cy=away-over-30-no]").click({
      force: true,
    });
    //Question 4: Are you an unaccompanied minor or refugee Y/N
    //Click yes
    cy.get("[data-cy=student-minor-refugee-yes]").click({
      force: true,
    });
    //Contains error
    cy.contains(
      "You can apply for MSP with some assistance from Health Insurance BC."
    );
    //Click continue
    cy.get("[data-cy=continue]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/form-selection");
    });
    //Next page contains different error
    cy.contains(
      "You can submit an application with some assistance from one of our representatives - please contact Health Insurance BC:"
    );
    //Stops form progress
    cy.get("[data-cy=continue]").click();
    cy.contains("You must select at least one program.");
    //Go back, set up form correctly for next question
    cy.go("back");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/msp-eligibility");
    });
    cy.get("[data-cy=student-minor-refugee-no]").click({
      force: true,
    });
    //Question 5: Do you have documents?
    //Click no
    cy.get("[data-cy=has-documents-no]").click({
      force: true,
    });
    //Contains error
    cy.contains(
      "You must have digital copies of the documents to apply for MSP using this form."
    );
    //Click continue
    cy.get("[data-cy=continue]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/form-selection");
    });
    //Next page contains different error
    cy.contains("Make sure you have digital copies of the above documents");
    //Stops form progress
    cy.get("[data-cy=continue]").click();
    cy.contains("You must select at least one program.");
    //Go back, set up form correctly for next question
    cy.go("back");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/msp-eligibility");
    });
    cy.get("[data-cy=has-documents-yes]").click({
      force: true,
    });
    cy.get("[data-cy=continue]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/fpcare-eligibility");
    });
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
