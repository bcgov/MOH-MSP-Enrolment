// DEAM review page (src/app/modules/account/pages/review/review.component.html).
// The page only renders read-only summary cards; canContinue() is just
// super.canContinue() with no required fields of its own
// (review.component.ts:132-135), so there is nothing to fill in.

const { clickActionBarButton } = require('./common-controls');

function continueToAuthorize() {
  clickActionBarButton();
}

module.exports = {
  continueToAuthorize,
};
