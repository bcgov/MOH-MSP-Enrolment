<template>
  <div>
    <div class="container stepper">
      <PageStepper
        :currentPath="$router.currentRoute.value.path"
        :routes="stepRoutes"
        @toggleShowMobileDetails="handleToggleShowMobileStepperDetails($event)"
        :isMobileStepperOpen="isMobileStepperOpen"
        @onClickLink="handleClickStepperLink($event)"
      />
    </div>
    <PageContent :deltaHeight="pageContentDeltaHeight">
      <main class="container pt-3 pt-sm-5 mb-3">
        <h1>Contact information</h1>
        <hr class="mt-0" />
        <div class="row">
          <div class="col-md-6" v-if="applyingForMSP">
            <div>
              <h2>Residential address</h2>
              <p class="address-description">
                Your residential address is the address where you currently live
                in B.C.
              </p>
            </div>
            <hr class="mt-0" />
            <AddressDoctorInput
              v-if="isAddressValidatorEnabled"
              label="Full street address"
              v-model="resAddressLine1"
              id="res-address-line1"
              class="mt-3"
              maxlength="25"
              serviceUrl="/ahdc/api/address"
              :inputStyle="mediumStyles"
              :required="true"
              @addressSelected="handleResAddressSelected($event)"
              @blur="handleBlurField(v$.resAddressLine1)"
            />
            <InputComponent
              v-else
              class="mt-3"
              label="Full street address"
              id="res-address-line1"
              v-model="resAddressLine1"
              :required="true"
              maxlength="25"
              :inputStyle="mediumStyles"
              @blur="handleBlurField(v$.resAddressLine1)"
            />
            <div
              class="text-danger"
              v-if="
                v$.resAddressLine1.$dirty &&
                v$.resAddressLine1.required.$invalid
              "
              aria-live="assertive"
            >
              Full street address is required.
            </div>
            <div
              class="text-danger"
              v-if="
                v$.resAddressLine1.$dirty &&
                !v$.resAddressLine1.required.$invalid &&
                v$.resAddressLine1.addressLineContentValidator.$invalid
              "
              aria-live="assertive"
            >
              Full street address must contain letters, numbers, and may include
              special characters such as a hyphen, period, apostrophe, number
              sign, ampersand, forward slash, and blank characters.
            </div>
            <InputComponent
              class="mt-3"
              label="Address Line 2 (optional)"
              id="res-address-line2"
              v-model="resAddressLine2"
              maxlength="25"
              :inputStyle="mediumStyles"
              @blur="handleBlurField(v$.resAddressLine2)"
            />
            <div
              class="text-danger"
              v-if="
                v$.resAddressLine2.$dirty &&
                v$.resAddressLine2.addressLineContentValidator.$invalid
              "
              aria-live="assertive"
            >
              Full street address must contain letters, numbers, and may include
              special characters such as a hyphen, period, apostrophe, number
              sign, ampersand, forward slash, and blank characters.
            </div>
            <InputComponent
              class="mt-3"
              label="Address Line 3 (optional)"
              id="res-address-line3"
              v-model="resAddressLine3"
              maxlength="25"
              :inputStyle="mediumStyles"
              @blur="handleBlurField(v$.resAddressLine3)"
            />
            <div
              class="text-danger"
              v-if="
                v$.resAddressLine3.$dirty &&
                v$.resAddressLine3.addressLineContentValidator.$invalid
              "
              aria-live="assertive"
            >
              Full street address must contain letters, numbers, and may include
              special characters such as a hyphen, period, apostrophe, number
              sign, ampersand, forward slash, and blank characters.
            </div>
            <InputComponent
              class="mt-3"
              label="City"
              id="res-city"
              v-model="resCity"
              maxlength="25"
              :inputStyle="mediumStyles"
              @blur="handleBlurField(v$.resCity)"
            />
            <div
              class="text-danger"
              v-if="v$.resCity.$dirty && v$.resCity.required.$invalid"
              aria-live="assertive"
            >
              City is required.
            </div>
            <div
              class="text-danger"
              v-if="
                v$.resCity.$dirty && v$.resCity.cityContentValidator.$invalid
              "
              aria-live="assertive"
            >
              City must contain letters and may include numbers and special
              characters such as hyphens, periods, apostrophes, and blank
              characters.
            </div>
            <RegionSelect
              class="mt-3"
              label="Province"
              id="res-province"
              v-model="resProvince"
              :inputStyle="mediumStyles"
              @blur="handleBlurField(v$.resProvince)"
              :required="true"
              :disabled="true"
            />
            <CountrySelect
              class="mt-3"
              label="Jurisdiction"
              id="res-country"
              v-model="resCountry"
              :inputStyle="mediumStyles"
              @blur="handleBlurField(v$.resCountry)"
              :required="true"
              :disabled="true"
            />
            <PostalCodeInput
              class="mt-3"
              label="Postal Code"
              id="res-postal-code"
              v-model="resPostalCode"
              :inputStyle="smallStyles"
              :required="true"
              @blur="handleBlurField(v$.resPostalCode)"
            />
            <div
              class="text-danger"
              v-if="
                v$.resPostalCode.$dirty && v$.resPostalCode.required.$invalid
              "
              aria-live="assertive"
            >
              Postal code is required.
            </div>
            <div
              class="text-danger"
              v-if="
                v$.resPostalCode.$dirty &&
                !v$.resPostalCode.required.$invalid &&
                v$.resPostalCode.completePostalCodeValidator.$invalid
              "
              aria-live="assertive"
            >
              Must be in the format A1A 1A1.
            </div>
            <div
              class="text-danger"
              v-if="
                v$.resPostalCode.$dirty &&
                !v$.resPostalCode.required.$invalid &&
                !v$.resPostalCode.completePostalCodeValidator.$invalid &&
                v$.resPostalCode.bcPostalCodeValidator.$invalid
              "
              aria-live="assertive"
            >
              Invalid postal code for British Columbia.
            </div>
          </div>
          <div class="col-md-6">
            <div>
              <h2>Mailing address</h2>
              <p v-if="applyingForMSP" class="address-description">
                Enter your mailing address if it is different from your
                residential address.
              </p>
              <p v-else>Enter your mailing address</p>
            </div>
            <hr class="mt-0" />
            <div v-if="isMailSame">
              <ButtonComponent
                label="My Mailing Address is Different"
                @click="handleClickDifferentAddress()"
                color="gold"
                class="different-address"
              />
            </div>
            <div v-else>
              <AddressDoctorInput
                v-if="isAddressValidatorEnabled && mailCountry === 'Canada'"
                label="Full street address, rural route, PO box, or general delivery"
                v-model="mailAddressLine1"
                id="mail-address-line1"
                class="mt-3"
                maxlength="25"
                serviceUrl="/ahdc/api/address"
                :inputStyle="mediumStyles"
                :required="true"
                @addressSelected="handleMailAddressSelected($event)"
                @blur="handleBlurField(v$.mailAddressLine1)"
              />
              <InputComponent
                v-else
                class="mt-3"
                label="Full street address, rural route, PO box, or general delivery"
                id="mail-address-line1"
                v-model="mailAddressLine1"
                maxlength="25"
                :inputStyle="mediumStyles"
                :required="true"
                @blur="handleBlurField(v$.mailAddressLine1)"
              />
              <div
                class="text-danger"
                v-if="
                  v$.mailAddressLine1.$dirty &&
                  v$.mailAddressLine1.required.$invalid
                "
                aria-live="assertive"
              >
                Full street address, rural route, PO box, or general delivery is
                required.
              </div>
              <div
                class="text-danger"
                v-if="
                  v$.mailAddressLine1.$dirty &&
                  !v$.mailAddressLine1.required.$invalid &&
                  v$.mailAddressLine1.addressLineContentValidator.$invalid
                "
                aria-live="assertive"
              >
                Full street address, rural route, PO box, or general delivery
                must contain letters, numbers, and may include special
                characters such as a hyphen, period, apostrophe, number sign,
                ampersand, forward slash, and blank characters.
              </div>
              <InputComponent
                class="mt-3"
                label="Address Line 2 (optional)"
                id="mail-address-line2"
                v-model="mailAddressLine2"
                maxlength="25"
                :inputStyle="mediumStyles"
                @blur="handleBlurField(v$.mailAddressLine2)"
              />
              <div
                class="text-danger"
                v-if="
                  v$.mailAddressLine2.$dirty &&
                  v$.mailAddressLine2.addressLineContentValidator.$invalid
                "
                aria-live="assertive"
              >
                Full street address, rural route, PO box, or general delivery
                must contain letters, numbers, and may include special
                characters such as a hyphen, period, apostrophe, number sign,
                ampersand, forward slash, and blank characters.
              </div>
              <InputComponent
                class="mt-3"
                label="Address Line 3 (optional)"
                id="mail-address-line3"
                v-model="mailAddressLine3"
                maxlength="25"
                :inputStyle="mediumStyles"
                @blur="handleBlurField(v$.mailAddressLine3)"
              />
              <div
                class="text-danger"
                v-if="
                  v$.mailAddressLine3.$dirty &&
                  v$.mailAddressLine3.addressLineContentValidator.$invalid
                "
                aria-live="assertive"
              >
                Full street address, rural route, PO box, or general delivery
                must contain letters, numbers, and may include special
                characters such as a hyphen, period, apostrophe, number sign,
                ampersand, forward slash, and blank characters.
              </div>
              <InputComponent
                class="mt-3"
                label="City"
                id="mail-city"
                v-model="mailCity"
                maxlength="25"
                :inputStyle="mediumStyles"
                @blur="handleBlurField(v$.mailCity)"
              />
              <div
                class="text-danger"
                v-if="v$.mailCity.$dirty && v$.mailCity.required.$invalid"
                aria-live="assertive"
              >
                City is required.
              </div>
              <div
                class="text-danger"
                v-if="
                  v$.mailCity.$dirty &&
                  v$.mailCity.cityContentValidator.$invalid
                "
                aria-live="assertive"
              >
                City must contain letters and may include numbers and special
                characters such as hyphens, periods, apostrophes, and blank
                characters.
              </div>
              <RegionSelect
                v-if="mailCountry === 'Canada'"
                class="mt-3"
                label="Province"
                id="mail-province"
                v-model="mailProvince"
                :inputStyle="mediumStyles"
                :required="true"
                :disablePlaceholder="true"
                @blur="handleBlurField(v$.mailProvince)"
              />
              <InputComponent
                v-else
                class="mt-3"
                label="Province or State"
                id="mail-province"
                v-model="mailProvince"
                maxlength="25"
                :inputStyle="mediumStyles"
                :required="true"
                @blur="handleBlurField(v$.mailProvince)"
              />
              <div
                class="text-danger"
                v-if="
                  v$.mailProvince.$dirty && v$.mailProvince.required.$invalid
                "
                aria-live="assertive"
              >
                Province or state is required.
              </div>
              <div
                class="text-danger"
                v-if="
                  v$.mailProvince.$dirty &&
                  v$.mailProvince.provinceContentValidator.$invalid
                "
                aria-live="assertive"
              >
                Province or State must contain letters and may include special
                characters such as hyphens, periods, apostrophes, and blank
                characters.
              </div>
              <CountrySelect
                class="mt-3"
                label="Jurisdiction"
                id="mail-country"
                v-model="mailCountry"
                :inputStyle="mediumStyles"
                :required="true"
                :disablePlaceholder="true"
                @blur="handleBlurField(v$.mailCountry)"
              />
              <div
                class="text-danger"
                v-if="v$.mailCountry.$dirty && v$.mailCountry.required.$invalid"
                aria-live="assertive"
              >
                Jurisdiction is required.
              </div>

              <div v-if="mailCountry === 'Canada'">
                <PostalCodeInput
                  class="mt-3"
                  label="Postal Code"
                  id="mail-postal-code"
                  v-model="mailPostalCode"
                  maxlength="25"
                  :inputStyle="smallStyles"
                  :required="true"
                  @blur="handleBlurField(v$.mailPostalCode)"
                />
                <div
                  class="text-danger"
                  v-if="
                    v$.mailPostalCode.$dirty &&
                    !v$.mailPostalCode.required.$invalid &&
                    v$.mailPostalCode.completePostalCodeValidator.$invalid
                  "
                  aria-live="assertive"
                >
                  Must be in the format A1A 1A1.
                </div>
                <div
                  class="text-danger"
                  v-if="
                    v$.mailPostalCode.$dirty &&
                    v$.mailPostalCode.required.$invalid
                  "
                  aria-live="assertive"
                >
                  Postal Code is required.
                </div>
              </div>
              <div v-else>
                <InputComponent
                  class="mt-3"
                  label="Postal Code or Zip Code"
                  id="mail-postal-code"
                  v-model="mailPostalCode"
                  maxlength="25"
                  :inputStyle="smallStyles"
                  :required="true"
                  @blur="handleBlurField(v$.mailPostalCode)"
                />
                <div
                  class="text-danger"
                  v-if="
                    v$.mailPostalCode.$dirty &&
                    !v$.mailPostalCode.required.$invalid &&
                    v$.mailPostalCode.specialCharacterValidator.$invalid
                  "
                  aria-live="assertive"
                >
                  Postal Code or Zip Code cannot include special characters
                  except hyphen, period, apostrophe, number sign and blank
                  space.
                </div>
                <div
                  class="text-danger"
                  v-if="
                    v$.mailPostalCode.$dirty &&
                    v$.mailPostalCode.required.$invalid
                  "
                  aria-live="assertive"
                >
                  Postal Code or Zip Code is required.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="applyingForMSP">
          <CheckboxComponent
            class="mt-3"
            id="same-address-check"
            v-model="isMailSame"
            label="This is my mailing address."
          />
        </div>
        <br />
        <h2>Phone</h2>
        <hr class="mt-0" />
        <div class="row">
          <div class="col-md-8">
            <PhoneNumberInput
              id="phone-input"
              label="Phone number (optional)"
              v-model="phone"
              className="mt-3"
              class="phone-number"
              :inputStyle="smallStyles"
            />
            <div
              class="text-danger"
              v-if="v$.phone.phoneValidator.$invalid"
              aria-live="assertive"
            >
              Phone number does not appear to be valid.
            </div>
            <br />
          </div>
          <div class="col-md-4">
            <TipBox title="Tip">
              <p>
                Please provide a phone number so we can contact you if there are
                any issues with your application.
              </p>
            </TipBox>
          </div>
        </div>
      </main>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import pageStateService from "@/services/page-state-service";
import { enrolmentRoutes, isEQPath, isPastPath } from "@/router/routes";
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition,
} from "@/helpers/scroll";
import { getConvertedPath } from "@/helpers/url";
import { smallStyles, mediumStyles } from "@/constants/input-styles";
import {
  MODULE_NAME as enrolmentModule,
  SET_PHONE,
  SET_RES_ADDRESS_LINE_1,
  SET_RES_ADDRESS_LINE_2,
  SET_RES_ADDRESS_LINE_3,
  SET_RES_CITY,
  SET_RES_PROVINCE,
  SET_RES_COUNTRY,
  SET_RES_POSTAL_CODE,
  SET_MAIL_ADDRESS_LINE_1,
  SET_MAIL_ADDRESS_LINE_2,
  SET_MAIL_ADDRESS_LINE_3,
  SET_MAIL_CITY,
  SET_MAIL_PROVINCE,
  SET_MAIL_COUNTRY,
  SET_MAIL_POSTAL_CODE,
  SET_IS_MAIL_SAME,
} from "@/store/modules/enrolment-module";
import logService from "@/services/log-service";
import {
  AddressDoctorInput,
  ButtonComponent,
  CheckboxComponent,
  ContinueBar,
  CountrySelect,
  InputComponent,
  PageContent,
  PhoneNumberInput,
  PostalCodeInput,
  RegionSelect,
  bcPostalCodeValidator,
  getProvinceNameByCode,
  phoneValidator,
  replaceSpecialCharacters,
  specialCharacterValidator,
  truncateAddressLines,
} from "common-lib-vue";
import { required } from "@vuelidate/validators";
import pageContentMixin from "@/mixins/page-content-mixin";
import pageStepperMixin from "@/mixins/page-stepper-mixin";
import TipBox from "@/components/TipBox";
import spaEnvService from "@/services/spa-env-service";

const addressLineContentValidator = (value) => {
  if (value === "" || value === null) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.'#& /]*$/;
  const criteriaMustHaveLetterOrNumber = /.*[a-z0-9].*/i;
  return (
    criteriaAllowedCharecters.test(value) &&
    criteriaMustHaveLetterOrNumber.test(value)
  );
};

const cityContentValidator = (value) => {
  if (value === "" || value === null) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.' ]*$/;
  const criteriaMustHaveLetter = /.*[a-z].*/i;
  return (
    criteriaAllowedCharecters.test(value) && criteriaMustHaveLetter.test(value)
  );
};

const provinceContentValidator = (value) => {
  if (value === "" || value === null) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.' ]*$/;
  const criteriaMustHaveLetter = /.*[a-z].*/i;
  const criteriaMustHaveNumber = /.*[0-9].*/;

  return (
    criteriaAllowedCharecters.test(value) &&
    criteriaMustHaveLetter.test(value) &&
    !criteriaMustHaveNumber.test(value)
  );
};

const completePostalCodeValidator = (value) => {
  if (value === "" || value === null) {
    // Don't show error if field is blank.
    return true;
  }
  return value.length === 7;
};

export default {
  name: "ContactInfoPage",
  mixins: [pageContentMixin, pageStepperMixin],
  components: {
    AddressDoctorInput,
    ButtonComponent,
    CheckboxComponent,
    ContinueBar,
    CountrySelect,
    InputComponent,
    PageContent,
    PhoneNumberInput,
    PostalCodeInput,
    RegionSelect,
    TipBox,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data: () => {
    return {
      isPageLoaded: false,
      applyingForMSP: true,
      resAddressLine1: null,
      resAddressLine2: null,
      resAddressLine3: null,
      resCity: null,
      resProvince: null,
      resCountry: null,
      resPostalCode: null,
      mailAddressLine1: null,
      mailAddressLine2: null,
      mailAddressLine3: null,
      mailCity: null,
      mailProvince: null,
      mailCountry: "_",
      mailPostalCode: null,
      isMailSame: true,
      phone: null,
      smallStyles: smallStyles,
      mediumStyles: mediumStyles,
    };
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.CONTACT_INFO_PAGE.path,
      enrolmentRoutes.CONTACT_INFO_PAGE.title,
    );

    this.applyingForMSP = this.$store.state.enrolmentModule.isApplyingForMSP;
    this.resAddressLine1 = this.$store.state.enrolmentModule.resAddressLine1;
    this.resAddressLine2 = this.$store.state.enrolmentModule.resAddressLine2;
    this.resAddressLine3 = this.$store.state.enrolmentModule.resAddressLine3;
    this.resCity = this.$store.state.enrolmentModule.resCity;
    this.resProvince = this.$store.state.enrolmentModule.resProvince;
    this.resCountry = this.$store.state.enrolmentModule.resCountry;
    this.resPostalCode = this.$store.state.enrolmentModule.resPostalCode;
    this.mailAddressLine1 = this.$store.state.enrolmentModule.mailAddressLine1;
    this.mailAddressLine2 = this.$store.state.enrolmentModule.mailAddressLine2;
    this.mailAddressLine3 = this.$store.state.enrolmentModule.mailAddressLine3;
    this.mailCity = this.$store.state.enrolmentModule.mailCity;
    this.mailProvince = this.$store.state.enrolmentModule.mailProvince;
    this.mailCountry = this.$store.state.enrolmentModule.mailCountry;
    this.mailPostalCode = this.$store.state.enrolmentModule.mailPostalCode;
    this.isMailSame = this.$store.state.enrolmentModule.isMailSame;
    this.phone = this.$store.state.enrolmentModule.phone;

    if (!this.applyingForMSP) {
      this.isMailSame = false;
    }
    this.$nextTick(() => {
      this.isPageLoaded = true;
    });
  },
  validations() {
    let validations = {
      phone: {
        phoneValidator,
      },
    };
    if (this.applyingForMSP) {
      const resValidations = {
        resAddressLine1: {
          required,
          addressLineContentValidator,
        },
        resAddressLine2: {
          addressLineContentValidator,
        },
        resAddressLine3: {
          addressLineContentValidator,
        },
        resCity: {
          required,
          cityContentValidator,
        },
        resPostalCode: {
          required,
          completePostalCodeValidator,
          bcPostalCodeValidator,
        },
      };
      validations = { ...validations, ...resValidations };
    }
    if (!this.isMailSame) {
      const mailValidations = {
        mailAddressLine1: {
          required,
          addressLineContentValidator,
        },
        mailAddressLine2: {
          addressLineContentValidator,
        },
        mailAddressLine3: {
          addressLineContentValidator,
        },
        mailCity: {
          required,
          cityContentValidator,
        },
        mailProvince: {
          required,
          provinceContentValidator,
        },
        mailCountry: {
          required,
        },
        mailPostalCode: {
          required,
          specialCharacterValidator:
            this.mailCountry === "Canada"
              ? true
              : specialCharacterValidator,
          completePostalCodeValidator:
            this.mailCountry === "Canada"
              ? completePostalCodeValidator
              : true,
        },
      };
      validations = { ...validations, ...mailValidations };
    }

    return validations;
  },
  methods: {
    validateFields() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        scrollToError();
        return;
      }

      this.saveData();
      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(
        `${enrolmentModule}/${SET_RES_ADDRESS_LINE_1}`,
        this.resAddressLine1,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_RES_ADDRESS_LINE_2}`,
        this.resAddressLine2,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_RES_ADDRESS_LINE_3}`,
        this.resAddressLine3,
      );
      this.$store.dispatch(`${enrolmentModule}/${SET_RES_CITY}`, this.resCity);
      this.$store.dispatch(
        `${enrolmentModule}/${SET_RES_PROVINCE}`,
        this.resProvince,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_RES_COUNTRY}`,
        this.resCountry,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_RES_POSTAL_CODE}`,
        this.resPostalCode,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_MAIL_ADDRESS_LINE_1}`,
        this.mailAddressLine1,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_MAIL_ADDRESS_LINE_2}`,
        this.mailAddressLine2,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_MAIL_ADDRESS_LINE_3}`,
        this.mailAddressLine3,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_MAIL_CITY}`,
        this.mailCity,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_MAIL_PROVINCE}`,
        this.mailProvince,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_MAIL_COUNTRY}`,
        this.mailCountry,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_MAIL_POSTAL_CODE}`,
        this.mailPostalCode,
      );
      this.$store.dispatch(
        `${enrolmentModule}/${SET_IS_MAIL_SAME}`,
        this.isMailSame,
      );
      this.$store.dispatch(`${enrolmentModule}/${SET_PHONE}`, this.phone);
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.REVIEW_PAGE.path,
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    handleBlurField(validationObject) {
      if (validationObject) {
        validationObject.$touch();
      }
    },
    handleClickDifferentAddress() {
      this.isMailSame = false;
    },
    handleResAddressSelected(address) {
      // Display error message when province isn't BC.
      if (address.province !== "BC") {
        this.resAddressLine1 = null;
        alert("Please select a valid B.C. address.");
        return;
      }

      // prevent "Cannot read property of undefined" error should the address not be complete
      if (address.addressLines) {
        for (let i = 0; i < address.addressLines.length; i++) {
          // replace special characters PRIOR to truncating address lines
          address.addressLines[i] = replaceSpecialCharacters(
            address.addressLines[i],
          );
        }
      }

      const addressLines = truncateAddressLines(address.addressLines, 25);

      // Remove all address lines.
      for (let i = 0; i < 3; i++) {
        this[`resAddressLine${i + 1}`] = null;
      }
      // Add new address lines.
      for (
        let i = 0;
        i < (addressLines.length <= 3 ? addressLines.length : 3);
        i++
      ) {
        this[`resAddressLine${i + 1}`] = addressLines[i];
      }
      this.resCity =
        typeof address.city === "string"
          ? replaceSpecialCharacters(address.city).substring(0, 25)
          : null;
      this.resPostalCode = replaceSpecialCharacters(address.postalCode);
    },
    handleMailAddressSelected(address) {
      // prevent "Cannot read property of undefined" error should the address not be complete
      if (address.addressLines) {
        for (let i = 0; i < address.addressLines.length; i++) {
          // replace special characters PRIOR to truncating address lines
          address.addressLines[i] = replaceSpecialCharacters(
            address.addressLines[i],
          );
        }
      }

      const addressLines = truncateAddressLines(address.addressLines, 25);

      // Remove all address lines.
      for (let i = 0; i < 3; i++) {
        this[`mailAddressLine${i + 1}`] = null;
      }
      // Add new address lines.
      for (
        let i = 0;
        i < (addressLines.length <= 3 ? addressLines.length : 3);
        i++
      ) {
        this[`mailAddressLine${i + 1}`] = addressLines[i];
      }
      this.mailCountry = replaceSpecialCharacters(address.country);
      this.mailProvince = getProvinceNameByCode(address.province);
      this.mailCity =
        typeof address.city === "string"
          ? replaceSpecialCharacters(address.city).substring(0, 25)
          : null;
      this.mailPostalCode = replaceSpecialCharacters(address.postalCode);
    },
  },
  watch: {
    mailCountry: function (value, oldValue) {
      // don't clear province if the change is from loading from store
      if (this.isPageLoaded) {
        if (oldValue === "Canada" && value !== "Canada") {
          // don't keep a Canadian province if not in canada
          this.mailProvince = "";
          this.mailPostalCode = "";
        } else if (oldValue !== "Canada" && value === "Canada") {
          // if changing to canada, a canadian province must be selected by default.
          this.mailProvince = "British Columbia";
          this.mailPostalCode = "";
        }
      }
    },
  },
  computed: {
    isAddressValidatorEnabled() {
      return (
        spaEnvService.values.SPA_ENV_JHA_ENABLE_ADDRESS_VALIDATOR === "true"
      );
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (
      pageStateService.isPageComplete(to.path) ||
      (isPastPath(to.path, from.path) && !isEQPath(to.path))
    ) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.CONTACT_INFO_PAGE.path,
      );
      next({
        path: toPath,
        replace: true,
      });
      setTimeout(() => {
        scrollTo(topScrollPosition);
      }, 0);
    }
  },
};
</script>

<style scoped>
.address-description {
  min-height: 3.5rem;
}
</style>
