// Shared helpers for the moh-common-lib-angular form controls that recur
// across the DEAM and ACL pages. Every DOM shape referenced here was read
// out of the compiled component templates that ship in
// node_modules/moh-common-lib-angular/fesm2022/moh-common-lib-angular.mjs
// (the library has no source .html files in this install, only the AOT
// output), not out of the old Protractor page objects:
//
// - common-name, common-phn, common-street, common-city and
//   common-postal-code all render a plain `<label>{{label}}</label>`
//   followed by a sibling `<input>` inside the custom element, and the
//   label text is interpolated so it is always present in the DOM
//   regardless of build mode.
// - common-date renders a `<fieldset>` containing
//   `<select aria-label="Month">`, `<input aria-label="Day">` and
//   `<input aria-label="Year">`.
// - common-radio renders a `<fieldset><legend>{{label}}</legend>` followed
//   by one `<div class="md-radio">` per option, each with a
//   `<label>{{val.label}}</label>` next to its `<input type="radio">`.
// - common-checkbox renders a sibling `<input type="checkbox">` and
//   `<label>{{label}}</label>` pair, the same shape the consent modal
//   checkbox uses in the existing smoke specs.
//
// Because none of these ids are stable (they are suffixed with a
// runtime-generated uuid), every helper here locates fields by their
// visible label text instead.

/** Types into the input inside a labelled custom element (common-name,
 * common-phn, common-street, common-city, common-postal-code, ...). */
function fillLabeledField(tag, labelText, value) {
  cy.contains(tag, labelText).find('input').clear().type(value);
}

/** Fills a common-date field, identified by its legend text, with a
 * {month, day, year} object. month is 0-based (January = 0), matching
 * JS Date#getMonth() and the *ngFor index common-date's <option> uses.
 *
 * DateComponent (moh-common-lib-angular.mjs, DateComponent class) wires the
 * month select and the day/year inputs to (blur) only - onBlurMonth/
 * onBlurDay/onBlurYear (moh-common-lib-angular.mjs:4860-4871) each read
 * only their own event.target.value into _month/_day/_year and then call
 * processDate() (moh-common-lib-angular.mjs:4771), which is the only place
 * that calls _onChange(this.date) and only builds a non-null date once
 * canCreateDate() (moh-common-lib-angular.mjs:4810) sees _month, _day and
 * _year all already set. There is no (input)/(change) listener on any of
 * the three controls, so a value that is typed or selected but never
 * blurred stays in the browser's native input value - visible on screen -
 * without ever reaching the component's model or the form control's
 * validity. Each field is blurred explicitly here rather than left to the
 * next command's focus shift, which does not exist for whichever date
 * field happens to be the last one filled before a submit click. */
function fillDate(labelText, { month, day, year }) {
  const scope = () => cy.contains('common-date', labelText);
  scope().find('select[aria-label="Month"]').select(String(month)).blur();
  scope().find('input[aria-label="Day"]').clear().type(String(day)).blur();
  scope().find('input[aria-label="Year"]').clear().type(String(year)).blur();
}

/** Clicks a common-radio option by the fieldset's legend text and the
 * option's own label text (e.g. "No" / "Yes"). */
function chooseRadio(legendText, optionLabel) {
  cy.contains('common-radio', legendText).contains('label', optionLabel).click();
}

/** Checks a common-checkbox by its label text. */
function checkLabeledCheckbox(labelText) {
  cy.contains('common-checkbox', labelText).find('input[type="checkbox"]').check({ force: true });
}

/** Clicks the submit button rendered by common-form-action-bar. Every page
 * in the DEAM flow has exactly one. */
function clickActionBarButton() {
  cy.get('common-form-action-bar button.submit').click();
}

module.exports = {
  fillLabeledField,
  fillDate,
  chooseRadio,
  checkLabeledCheckbox,
  clickActionBarButton,
};
