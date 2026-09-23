// Smoke test for the Account Confirmation Letter (ACL) module, the other
// lazy module still reachable from src/app/app-routing.module.ts
// (APP_ROUTES.ACCOUNT_LETTER -> RequestAclModule).
//
// RequestLetterComponent wraps the consent notice in
// msp-consent-modal (src/app/modules/msp-core/components/consent-modal),
// which independently calls SpaEnvService.checkMaintenance('ACL') in its
// own ngOnInit - same '/msp/api/env' POST as the DEAM home route, stubbed
// here for the same reason (no local backend for that endpoint in dev).

describe("Account confirmation letter request page", () => {
  let consoleErrors;

  beforeEach(() => {
    consoleErrors = [];
    cy.on("window:before:load", (win) => {
      cy.stub(win.console, "error").callsFake((...args) => {
        consoleErrors.push(args.join(" "));
      });
    });

    cy.intercept("POST", "**/msp/api/env", {
      statusCode: 200,
      body: {
        SPA_ENV_MSP_MAINTENANCE_FLAG: "false",
        SPA_ENV_MSP_MAINTENANCE_MESSAGE: "",
        SPA_ENV_ACL_MAINTENANCE_FLAG: "false",
        SPA_ENV_ACL_MAINTENANCE_MESSAGE: "",
        SPA_ENV_PACUTOFF_MAINTENANCE_FLAG: "false",
        SPA_ENV_PACUTOFF_MAINTENANCE_MESSAGE: "",
        SPA_ENV_PACUTOFF_MAINTENANCE_START: "",
        SPA_ENV_NOW: "",
        SPA_ENV_PACUTOFF_MAINTENANCE_END: "",
        SPA_ENV_SUPPBEN_MAINTENANCE_FLAG: "false",
        SPA_ENV_SUPPBEN_MAINTENANCE_MESSAGE: "",
      },
    }).as("checkMaintenance");

    cy.visit("/account-letter/request-acl");
  });

  afterEach(() => {
    expect(consoleErrors, "browser console.error calls").to.have.length(0);
  });

  it("should open the consent modal and accept into the request form", () => {
    cy.wait("@checkMaintenance");
    cy.get(".modal.show .form-check-input").should("be.visible").check({ force: true });
    cy.get(".modal.show .modal-footer button").should("be.enabled").click();
    cy.get("h1").should(
      "contain.text",
      "Request Medical Services Plan Account Confirmation Letter"
    );
  });
});
