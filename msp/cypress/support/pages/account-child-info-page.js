// DEAM child-info page
// (src/app/modules/account/pages/child-info/child-info.component.html).
// The happy path adds no child: submitLabel is "Skip" whenever
// hasChild is false (child-info.component.html:187), and canContinue()
// with no added/removed/updated children just falls back to
// super.canContinue() (child-info.component.ts:490-505), which is
// satisfied because the form has no required fields left on it once a
// spouse has already been removed (see account-spouse-info-page.js) -
// that keeps isFormMissingRequiredInfo() false
// (child-info.component.ts:522-525) so the "missing required information"
// modal never opens.

const { clickActionBarButton } = require('./common-controls');

function skip() {
  clickActionBarButton();
}

module.exports = {
  skip,
};
