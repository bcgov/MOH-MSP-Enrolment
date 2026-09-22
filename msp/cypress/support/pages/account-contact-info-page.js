// DEAM contact-info page
// (src/app/modules/account/pages/contact-info/contact-info.component.html).
// Only the residential address is filled: mailingSameAsResidentialAddress
// defaults to true (account.model.ts:103), so the mailing address block
// stays collapsed behind its "My mailing address is different." button
// (contact-info.component.html:60-90,124-134) and phone number is
// optional (contact-info.component.html:98).
//
// common-address is used with [disableGeocoder]="true"
// (contact-info.component.html:30,42), so common-street renders its plain
// input branch with no typeahead popup to dismiss
// (moh-common-lib-angular.mjs, common-street template). Province and
// country are [disabled]="{ province: true, country: true }"
// (contact-info.component.html:28,40) and pre-set to BC/Canada by
// [bcOnly]="true" - disabled controls are excluded from Angular's form
// validity, so they need no input here.

const { fillLabeledField, clickActionBarButton } = require('./common-controls');

// Label text sourced from AddressComponent's addrLabels default
// (moh-common-lib-angular.mjs, AddressComponent).
function fillResidentialAddress({ street, city, postal }) {
  fillLabeledField(
    'common-street',
    'Full street address, rural route, PO box or general delivery',
    street
  );
  fillLabeledField('common-city', 'City', city);
  fillLabeledField('common-postal-code', 'Postal Code or Zip Code', postal);
}

function continueToReview() {
  clickActionBarButton();
}

module.exports = {
  fillResidentialAddress,
  continueToReview,
};
