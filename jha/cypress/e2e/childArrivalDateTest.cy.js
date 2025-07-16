import { generateRequestObject } from "../fixtures/fullApplication.js";
import { removeUniqueFields } from "../support/helpers.js";
import envData from "../fixtures/env-data.js";
import { StatusInCanada } from "../../src/constants/immigration-status-types.js";
import { SupportDocumentTypes } from "../../src/constants/document-types.js";
import { padInteger } from "../support/helpers.js";
const samplePDF = "cypress/fixtures/sample.pdf";
const currentDate = new Date();
const lastMonthDate = new Date();
lastMonthDate.setMonth(currentDate.getMonth() - 1);

//in mid 2025, we ran into a bug where the application wasn't assigning validators correctly
//the canadaArrivalDate field in the Child component was affected, since it uses nested validations
//I created this test to confirm that the bug no longer occurs
//Someday it could probably get rolled into the fullApplicationValidations test suite

describe("childArrivalDateCanada test", () => {
  const options = { includeMSP: true, includeFPC: false, includeSB: true };
  it("Fills eligibility questionnaire", () => {
    cy.fillEligibilityQuestionnaire(options);
  });

  it("Accepts valid information for the personal-info page", () => {
    cy.fillName();

    const selectOption = parseInt(envData.birthMonth);

    cy.get("select#birthdate-month").select(selectOption);
    cy.get("input#birthdate-day").type(envData.birthDay);
    cy.get("input#birthdate-year").type(envData.birthYear);

    if (!options?.includeMSP) {
      cy.fillIdFields();
    } else {
      if (options.includeSB || options.includeFPC) {
        cy.get("input#social-insurance-number").type(envData.sin);
      }
      cy.get("label[for=gender-x]").click();

      cy.get("select#immigration-status").select(StatusInCanada.Citizen);
      cy.get("label[for=-new-to-province]").click();
      cy.get("select#citizen-support-document-type").select(
        SupportDocumentTypes.CanadianBirthCertificate
      );
      cy.get("label[for=gender-matches-yes]").click();

      cy.get("input#citizenship-support-documents").selectFile(samplePDF, {
        force: true,
      });
      cy.get("#citizenship-support-documents")
        .parent()
        .within(() => {
          cy.get(".thumbnail-image-container", { timeout: 80000 })
            .first()
            .should("exist");
        });
      cy.get("label[for=name-change-no]").click();

      // cy.get('select#name-change-doc-type').select(SupportDocumentTypes.MarriageCertificate);
      // cy.get('#name-change-support-documents').selectFile(samplePDF, { force: true });
      // cy.get("#name-change-support-documents").parent().within(() => {
      //   cy.get(".thumbnail-image-container", { timeout: 20000 })
      //     .first()
      //     .should("exist");
      // });

      cy.get("label[for=is-moved-to-bc-permanently-yes]").click();

      cy.get("select#province-of-origin").select("Alberta");

      cy.get("select#arrival-date-in-bc-month").select("6");
      cy.get("input#arrival-date-in-bc-day").type("09");
      cy.get("input#arrival-date-in-bc-year").type("2024");

      cy.get("select#arrival-date-in-canada-month").select("6");
      cy.get("input#arrival-date-in-canada-day").type("09");
      cy.get("input#arrival-date-in-canada-year").type("2024");

      // cy.get('input#previous-health-number').type('111 111 1111');
      cy.get("label[for=has-previous-phn-no]").click();

      cy.get("label[for=outside-bc-12-months-no]").click();
      // cy.get('input#departure-reason').type('vacation');
      // cy.get('input#departure-location').type('bahamas');

      // cy.get('select#departure-begin-date-month').select(String(lastMonthDate.getMonth()));
      // cy.get('input#departure-begin-date-day').type(padInteger(lastMonthDate.getDate()));
      // cy.get('input#departure-begin-date-year').type(lastMonthDate.getFullYear());

      // cy.get('select#departure-return-date-month').select(String(currentDate.getMonth()));
      // cy.get('input#departure-return-date-day').type(padInteger(currentDate.getDate()));
      // cy.get('input#departure-return-date-year').type(currentDate.getFullYear());

      // cy.get('label[for=has-previous-phn-yes]').click();
      // cy.get('input#previous-phn').type('9999 999 998');

      cy.get("label[for=is-released-from-armed-forces-no]").click();

      // cy.get('select#armed-forces-discharge-date-month').select('1');
      // cy.get('input#armed-forces-discharge-date-day').type('01');
      // cy.get('input#armed-forces-discharge-date-year').type('2010');

      cy.get("label[for=is-student-yes]").click();
      cy.get("label[for=will-student-reside-in-bc-yes]").click();
    }
    cy.continue();
  });

  it("Accepts valid information for the spouse page", () => {
    cy.get("label[for=has-spouse-yes]").click();
    cy.fillName("sarah");

    cy.get("select#birth-date-month").select("5");
    cy.get("input#birth-date-day").type("20");
    cy.get("input#birth-date-year").type("1990");

    if (!options?.includeMSP) {
      cy.fillIdFields("9348671676", "195544135");
    } else {
      if (options.includeSB || options.includeFPC) {
        cy.get("input#social-insurance-number").type("195544135");
      }

      cy.get("label[for=spouse-gender-x]").click();

      cy.get("select#spouse-status").select(StatusInCanada.Citizen);
      cy.get("label[for=spouse-status-reason-new-to-province]").click();
      cy.get("select#citizen-support-document-type").select(
        SupportDocumentTypes.CanadianBirthCertificate
      );

      cy.get("label[for=spouse-gender-matches-yes]").click();

      cy.get("input#spouse-citizenship-support-documents").selectFile(
        samplePDF,
        { force: true }
      );
      cy.get("#spouse-citizenship-support-documents")
        .parent()
        .within(() => {
          cy.get(".thumbnail-image-container", { timeout: 80000 })
            .first()
            .should("exist");
        });
      cy.get("label[for=name-change-no]").click();
      // cy.get('select#name-change-doc-type').select(SupportDocumentTypes.MarriageCertificate);

      // cy.get('input#spouse-name-change-support-documents').selectFile(samplePDF, { force: true });
      // cy.get("#spouse-name-change-support-documents").parent().within(() => {
      //   cy.get(".thumbnail-image-container", { timeout: 20000 })
      //     .first()
      //     .should("exist");
      // });

      cy.get("label[for=permanent-move-yes]").click();

      cy.get("select#spouse-province-of-origin").select("Alberta");

      cy.get("select#move-date-month").select("2");
      cy.get("input#move-date-day").type("02");
      cy.get("input#move-date-year").type("2015");

      cy.get("select#canada-arrival-date-month").select("2");
      cy.get("input#canada-arrival-date-day").type("02");
      cy.get("input#canada-arrival-date-year").type("2014");

      cy.get("label[for=outside-bc-past-12-no]").click();
      cy.get("label[for=has-previous-bc-health-number-no]").click();
      cy.get("label[for=been-released-from-institution-no]").click();
    }
    cy.continue();
  });

  it("Accepts valid information for the child page (optional)", () => {
    cy.get("label[for=has-children-yes]").click();

    cy.get("input#child-first-name-0").type("ralph");
    cy.get("input#child-middle-name-0").type("j");
    cy.get("input#child-last-name-0").type("wiggum");

    cy.get("select#child-birth-date-0-month").select("1");
    cy.get("input#child-birth-date-0-day").type("01");
    cy.get("input#child-birth-date-0-year").type("2019");

    if (options?.includeFPC) {
      cy.get("input#personal-health-number-0").type("9344 507 929");
    }

    if (options?.includeMSP) {
      cy.get("label[for=child-age-range-0-0-18]").click();

      cy.get("label[for=child-gender-0-male]").click();
      cy.get("select#child-status-0").select(StatusInCanada.Citizen);

      cy.get("label[for=child-status-reason-0-new-to-province]").click();

      cy.get("select#citizen-support-document-type-0").select(
        SupportDocumentTypes.CanadianBirthCertificate
      );
      cy.get("label[for=gender-matches-0-yes]").click();

      cy.get("input#child-citizenship-support-documents-0").selectFile(
        samplePDF,
        { force: true }
      );
      cy.get("#child-citizenship-support-documents-0")
        .parent()
        .within(() => {
          cy.get(".thumbnail-image-container", { timeout: 80000 })
            .first()
            .should("exist");
        });

      cy.get("label[for=name-change-0-no]").click();

      // cy.get('label[for=lived-in-bc-0-yes]').click()
      cy.get("label[for=permanent-move-0-yes]").click();
      // cy.get('label[for=permanent-move-0-yes]').click()
      cy.get("select#province-select-0").select("Alberta");
      cy.get("select#bc-move-0-month").select("6");
      cy.get("input#bc-move-0-day").type("09");
      cy.get("input#bc-move-0-year").type("2024");

      cy.get("label[for=outside-bc-0-no]").click();
      cy.get("label[for=has-bc-health-number-0-no]").click();
      cy.get("label[for=been-released-0-no]").click();
    }
    cy.continue();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ahdc/supp-ben-info");
    });
  });

  it("Accepts valid information for the child page (required)", () => {
    cy.go("back");
    cy.get("select#child-status-0").select(StatusInCanada.TemporaryResident);
    cy.get("label[for=child-status-reason0-working-permit]").click();
    cy.get("select#citizen-support-document-type-0").select(
      SupportDocumentTypes.WorkPermit
    );
    cy.get("label[for=gender-matches-0-yes]").click();

    cy.get("input#child-citizenship-support-documents-0").selectFile(
      samplePDF,
      { force: true }
    );
    cy.get("#child-citizenship-support-documents-0")
      .parent()
      .within(() => {
        cy.get(".thumbnail-image-container", { timeout: 80000 })
          .first()
          .should("exist");
      });

    cy.get("label[for=name-change-0-no]").click();

    cy.get("label[for=permanent-move-0-yes]").click();
    cy.get("select#bc-move-0-month").select("6");
    cy.get("input#bc-move-0-day").type("09");
    cy.get("input#bc-move-0-year").type("2024");
    cy.get("label[for=outside-bc-0-no]").click();
    cy.get("label[for=has-bc-health-number-0-no]").click();

    cy.continue();
    cy.contains('Arrival date in Canada is required.')
  });
});
