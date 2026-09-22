// The BC gov common-captcha widget (moh-common-lib-angular, captcha entry
// point) fetches an image challenge and verifies the typed answer against a
// real backend - there is no local server for either call in this dev
// setup, the same reason /msp/api/env is stubbed elsewhere. Both endpoints
// are read out of CaptchaDataService in
// node_modules/moh-common-lib-angular/fesm2022/moh-common-lib-angular-captcha.mjs:15-19:
//   fetchData    -> POST {apiBaseUrl}/captcha         body { nonce }
//   verifyCaptcha -> POST {apiBaseUrl}/verify/captcha  body { nonce, answer, validation }
//
// CaptchaComponent.answerChanged() (same file, ~line 148) calls
// this._onChange(event) - the raw DOM input event, not the typed string -
// the instant the answer reaches 6 characters, before the verify response
// is even back. Angular's required validator only rejects null/undefined/
// empty-string values, and an Event object is none of those, so typing a
// full 6-character answer is what satisfies the captcha's own required
// validator; the stubbed /verify/captcha response only has to come back
// with valid:true so CaptchaComponent reaches its success state and emits
// onValidToken. This is read from the installed source, not something this
// suite has watched happen in a browser - Cypress cannot run here yet (see
// package.json test:e2e:headless).

/** Intercepts both captcha network calls so the widget can be driven
 * offline. apiBaseUrl must match the app's captchaApiBaseUrl constant
 * (src/environments/environment.ts:29, '/msp/api/captcha'). */
function stubCaptcha(apiBaseUrl) {
  cy.intercept('POST', `**${apiBaseUrl}/captcha`, {
    statusCode: 200,
    body: { captcha: '<div>stub captcha challenge</div>', validation: 'stub-validation-token' },
  }).as('captchaFetch');

  cy.intercept('POST', `**${apiBaseUrl}/verify/captcha`, {
    statusCode: 200,
    body: { valid: true, jwt: 'stub-jwt-token' },
  }).as('captchaVerify');
}

/** Waits for the stubbed challenge, types a 6-character answer (the
 * component only calls verify once the field reaches 6 characters, see
 * name="answer" maxlength="6" in the template), and waits for the stubbed
 * verify response. */
function solveCaptcha() {
  cy.wait('@captchaFetch');
  cy.get('#answer').type('123456');
  cy.wait('@captchaVerify');
}

module.exports = {
  stubCaptcha,
  solveCaptcha,
};
