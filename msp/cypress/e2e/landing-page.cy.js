// Smoke test for the app entry route. AppRoutingModule (src/app/app-routing.module.ts)
// serves LandingComponent at '' with no lazy module, no consent modal and no
// HTTP dependency, so this is the cheapest possible proof the app bootstraps
// under /msp/ and the router renders something real, not a blank shell.
//
// Console-error check (spy on window.console.error via window:before:load,
// assert empty in afterEach) follows the same pattern used in fpcare's
// cypress specs.

describe("Landing page", () => {
  let consoleErrors;

  beforeEach(() => {
    consoleErrors = [];
    cy.on("window:before:load", (win) => {
      cy.stub(win.console, "error").callsFake((...args) => {
        consoleErrors.push(args.join(" "));
      });
    });

    cy.visit("/");
  });

  afterEach(() => {
    expect(consoleErrors, "browser console.error calls").to.have.length(0);
  });

  it("should display the two reachable application entry points", () => {
    cy.contains("button", "New MSP Account Change Request").should("be.visible");
    cy.contains("button", "New MSP Account Confirmation Letter Request").should(
      "be.visible"
    );
  });
});
