// DEAM authorize page
// (src/app/modules/account/pages/authorize/authorize.component.html).
//
// stubCaptcha() (cypress/support/pages/captcha-helpers.js) must be called
// by the spec before navigating onto this page, so the intercepts are in
// place before CaptchaComponent's ngAfterViewInit fires its first fetch.
//
// The agreement checkbox uses lang.agreeLabel
// (src/app/modules/account/pages/authorize/i18n/data/en/index.ts:6,
// "Yes, I agree") and is rendered by common-checkbox
// (authorize.component.html:32-38).

const { checkLabeledCheckbox, clickActionBarButton } = require('./common-controls');
const { solveCaptcha } = require('./captcha-helpers');

function agreeToAuthorization() {
  checkLabeledCheckbox('Yes, I agree');
}

function submit() {
  clickActionBarButton();
}

module.exports = {
  agreeToAuthorization,
  solveCaptcha,
  submit,
};
