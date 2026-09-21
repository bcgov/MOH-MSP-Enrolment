// Smoke test for the DEAM (Account Change Request) module's home route,
// one of the two lazy modules still wired up in
// src/app/app-routing.module.ts (ENROLMENT and BENEFIT are commented out
// there, ASSISTANCE redirects to page-not-found).
//
// HomeComponent (src/app/modules/account/pages/home/home.component.ts)
// calls SpaEnvService.checkMaintenance('ACL') in ngOnInit, which POSTs to
// environment.appConstants.envServerBaseUrl ('/msp/api/env'). That endpoint
// has no local backend in this dev setup (src/proxy.conf.json points it at
// a remote OpenShift environment), so it's stubbed here the same way
// fpcare stubs its captcha endpoint - to keep the spec deterministic
// rather than dependent on an external service being reachable.
//
// The consent modal (moh-common-lib-angular's ConsentModalComponent,
// rendered directly in home.component.html) opens unconditionally on
// first visit because a fresh browser has no infoCollectionAgreement in
// sessionStorage yet (see HomeComponent.ngAfterViewInit).

describe("DEAM account home page", () => {
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

    cy.visit("/deam/home");
  });

  afterEach(() => {
    expect(consoleErrors, "browser console.error calls").to.have.length(0);
  });

  it("should open the consent modal and accept into the page", () => {
    cy.wait("@checkMaintenance");
    cy.get(".modal.show .form-check-input").should("be.visible").check({ force: true });
    cy.get(".modal.show .modal-footer button").should("be.enabled").click();
    cy.get("h1").should("contain.text", "Manage your Medical Services Plan Account");
  });
});
