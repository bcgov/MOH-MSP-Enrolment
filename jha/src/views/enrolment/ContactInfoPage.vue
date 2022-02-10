<template>
  <div>
    <div class="container stepper">
      <PageStepper :currentPath='$router.currentRoute.path'
        :routes='stepRoutes'
        @toggleShowMobileDetails='handleToggleShowMobileStepperDetails($event)'
        :isMobileStepperOpen='isMobileStepperOpen'
        @onClickLink='handleClickStepperLink($event)'/>
    </div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Contact Information</h1>
        <hr class="mt-0"/>
        <div class="row">
            <div class="col-md-6" v-if="!onlyFPC">
              <div>
                <h2>Residential Address</h2>
                <p class="address-description">Enter your residential address - that's the address you currently live at in B.C.</p>
              </div>
              <hr class="mt-0"/>
              <Input class="mt-3"
                label="Full street address, rural route, or general delivery"
                id="res-address-line1"
                v-model="resAddressLine1"
                maxlength="25"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.resAddressLine1)" />
              <div class="text-danger" v-if="$v.resAddressLine1.$dirty && !$v.resAddressLine1.required" aria-live="assertive">Full street address, rural route, or general delivery is required.</div>
              <div class="text-danger"
                  v-if="$v.resAddressLine1.$dirty && $v.resAddressLine1.required && !$v.resAddressLine1.addressLineContentValidator"
                  aria-live="assertive">Full street address, rural route, PO box or general delivery must contain letters, numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
              <Input class="mt-3"
                label="Address Line 2 (optional)"
                id="res-address-line2"
                v-model="resAddressLine2"
                maxlength="25"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.resAddressLine2)" />
              <div class="text-danger"
                  v-if="$v.resAddressLine2.$dirty && !$v.resAddressLine2.addressLineContentValidator"
                  aria-live="assertive">Full street address, rural route, PO box or general delivery must contain letters, numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
              <Input class="mt-3"
                label="Address Line 3 (optional)"
                id="res-address-line3"
                v-model="resAddressLine3"
                maxlength="25"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.resAddressLine3)" />
              <div class="text-danger"
                  v-if="$v.resAddressLine3.$dirty && !$v.resAddressLine3.addressLineContentValidator"
                  aria-live="assertive">Full street address, rural route, PO box or general delivery must contain letters, numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
              <Input class="mt-3"
                label="City"
                id="res-city"
                v-model="resCity"
                maxlength="25"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.resCity)" />
              <div class="text-danger" v-if="$v.resCity.$dirty && !$v.resCity.required" aria-live="assertive">City is required.</div>
              <div class="text-danger"
                  v-if="$v.resCity.$dirty && !$v.resCity.cityContentValidator"
                  aria-live="assertive">City must contain letters and may include numbers and special characters such as hyphens, periods, apostrophes, and blank characters.</div>
              <RegionSelect class="mt-3"
                label="Province"
                id="res-province"
                v-model="resProvince"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.resProvince)"
                :disabled='true' />
              <CountrySelect class="mt-3"
                label="Country"
                id="res-country"
                v-model="resCountry"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.resCountry)"
                :disabled='true' />
              <PostalCodeInput class="mt-3"
                label="Postal Code"
                id="res-postal-code"
                v-model="resPostalCode"
                :inputStyle='smallStyles'
                @blur="handleBlurField($v.resPostalCode)" />
              <div class="text-danger" v-if="$v.resPostalCode.$dirty && !$v.resPostalCode.required" aria-live="assertive">Postal code is required.</div>
              <div class="text-danger" v-if="$v.resPostalCode.$dirty
                                          && $v.resPostalCode.required
                                          && !$v.resPostalCode.completePostalCodeValidator" aria-live="assertive">Must be in the format A1A 1A1.</div>
              <div class="text-danger" v-if="$v.resPostalCode.$dirty
                                          && $v.resPostalCode.required
                                          && $v.resPostalCode.completePostalCodeValidator
                                          && !$v.resPostalCode.bcPostalCodeValidator" aria-live="assertive">Invalid postal code for British Columbia.</div>
            </div>
          <div class="col-md-6">
            <div>
              <h2>Mailing Address</h2>
              <p v-if="!onlyFPC" class="address-description">Enter your mailing address - if it's different</p>
              <p v-else>Enter your mailing address - if it's different</p>
            </div>
            <hr class="mt-0"/>
            <div v-if="isMailSame">
              <Button label='My Mailing Address is Different'
                @click='handleClickDifferentAddress()'
                color='gold'
                class='different-address'/>
            </div>
            <div v-else>
              <Input class="mt-3"
                label="Full street address, rural route, PO box, or general delivery"
                id="mail-address-line1"
                v-model="mailAddressLine1"
                maxlength="25"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.mailAddressLine1)" />
              <div class="text-danger" v-if="$v.mailAddressLine1.$dirty && !$v.mailAddressLine1.required" aria-live="assertive">
                Full street address, rural route, PO box, or general delivery is required.
              </div>
              <div class="text-danger"
                v-if="$v.mailAddressLine1.$dirty && $v.mailAddressLine1.required && !$v.mailAddressLine1.addressLineContentValidator"
                aria-live="assertive">Full street address, rural route, PO box or general delivery must contain letters, numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
              <Input class="mt-3"
                label="Address Line 2 (optional)"
                id="mail-address-line2"
                v-model="mailAddressLine2"
                maxlength="25"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.mailAddressLine2)" />
              <div class="text-danger"
                v-if="$v.mailAddressLine2.$dirty && !$v.mailAddressLine2.addressLineContentValidator"
                aria-live="assertive">Full street address, rural route, PO box or general delivery must contain letters, numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
              <Input class="mt-3"
                label="Address Line 3 (optional)"
                id="mail-address-line3"
                v-model="mailAddressLine3"
                maxlength="25"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.mailAddressLine3)" />
              <div class="text-danger"
                v-if="$v.mailAddressLine3.$dirty && !$v.mailAddressLine3.addressLineContentValidator"
                aria-live="assertive">Full street address, rural route, PO box or general delivery must contain letters, numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
              <Input class="mt-3"
                label="City"
                id="mail-city"
                v-model="mailCity"
                maxlength="25"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.mailCity)" />
              <div class="text-danger" v-if="$v.mailCity.$dirty && !$v.mailCity.required" aria-live="assertive">City is required.</div>
              <div class="text-danger"
                v-if="$v.mailCity.$dirty && !$v.mailCity.cityContentValidator"
                  aria-live="assertive">City must contain letters and may include numbers and special characters such as hyphens, periods, apostrophes, and blank characters.</div>
              <RegionSelect v-if="mailCountry === 'Canada'"
                class="mt-3"
                label="Province"
                id="mail-province"
                v-model="mailProvince"
                :inputStyle='mediumStyles'
                :disablePlaceholder="true"
                @blur="handleBlurField($v.mailProvince)" />
              <Input v-else
                class="mt-3"
                label="Province or State"
                id="mail-province"
                v-model="mailProvince"
                maxlength="25"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.mailProvince)" />
              <div class="text-danger" v-if="$v.mailProvince.$dirty && !$v.mailProvince.required" aria-live="assertive">Province or state is required.</div>
              <div class="text-danger"
                v-if="$v.mailProvince.$dirty && !$v.mailProvince.provinceContentValidator"
                aria-live="assertive">Province or State must contain letters and may include special characters such as hyphens, periods, apostrophes, and blank characters.</div>
              <CountrySelect class="mt-3"
                label="Jurisdiction"
                id="mail-country"
                v-model="mailCountry"
                :inputStyle='mediumStyles'
                :disablePlaceholder="true"
                @blur="handleBlurField($v.mailCountry)" />
              <div class="text-danger" v-if="$v.mailCountry.$dirty && !$v.mailCountry.required" aria-live="assertive">Jurisdiction is required.</div>

              <div v-if="mailCountry === 'Canada'">
                <PostalCodeInput 
                  class="mt-3"
                  label="Postal Code"
                  id="mail-postal-code"
                  v-model="mailPostalCode"
                  maxlength="25"
                  :inputStyle='smallStyles'
                  @blur="handleBlurField($v.mailPostalCode)" />
                <div class="text-danger" v-if="$v.mailPostalCode.$dirty
                                            && $v.mailPostalCode.required
                                            && !$v.mailPostalCode.completePostalCodeValidator" aria-live="assertive">Must be in the format A1A 1A1.</div>
                <div class="text-danger" v-if="$v.mailPostalCode.$dirty && !$v.mailPostalCode.required" aria-live="assertive">Postal Code is required.</div>
              </div>
              <div v-else>
                <Input
                  class="mt-3"
                  label="Postal Code or Zip Code"
                  id="mail-postal-code"
                  v-model="mailPostalCode"
                  maxlength="25"
                  :inputStyle='smallStyles'
                  @blur="handleBlurField($v.mailPostalCode)" />
                <div class="text-danger"
                  v-if="$v.mailPostalCode.$dirty && $v.mailPostalCode.required && !$v.mailPostalCode.specialCharacterValidator"
                  aria-live="assertive">Postal Code or Zip Code cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
                <div class="text-danger" v-if="$v.mailPostalCode.$dirty && !$v.mailPostalCode.required" aria-live="assertive">Postal Code or Zip Code is required.</div>
              </div>
              
            </div>
          </div>
        </div>
        <div v-if="!onlyFPC">
          <Checkbox class="mt-3"
                id="same-address-check"
                v-model="isMailSame"
                label="This is my mailing address."/>
        </div>
        <br/>
        <h2>Phone</h2>   
        <hr class="mt-0"/>
        <div class="row">
          <div class="col-md-8">
            <PhoneNumberInput id='phone-input'
              label='Phone number (optional)'
              v-model='phone'
              className='mt-3'
              class='phone-number'
              :inputStyle='smallStyles' />
            <div class="text-danger"
                v-if="!$v.phone.phoneValidator"
                aria-live="assertive">Phone number does not appear to be valid.</div>
            <br/>
          </div>
          <div class="col-md-4">
            <TipBox title="Tip">
              <p>
                Please provide a phone number so you may be contacted in case of any issues with your application.
              </p>
            </TipBox>
          </div>
        </div>
      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import {
  enrolmentRoutes,
  isPastPath,
} from '@/router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition,
} from '@/helpers/scroll';
import {
  getConvertedPath,
} from '@/helpers/url';
import { 
  smallStyles,
  mediumStyles,
}  from '@/constants/input-styles'
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
  RESET_FORM,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import {
  Button,
  Checkbox,
  ContinueBar,
  CountrySelect,
  Input,
  PageContent,
  PhoneNumberInput,
  PostalCodeInput,
  RegionSelect,
  bcPostalCodeValidator,
  phoneValidator,
  specialCharacterValidator,
} from 'common-lib-vue';
import {
  required,
} from 'vuelidate/lib/validators';
import pageContentMixin from '@/mixins/page-content-mixin';
import pageStepperMixin from '@/mixins/page-stepper-mixin';
import TipBox from '@/components/TipBox';

const addressLineContentValidator = (value) => {
  if (value === "" || value === null) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.'#& /]*$/;
  const criteriaMustHaveLetterOrNumber = /.*[a-z0-9].*/i;
  return criteriaAllowedCharecters.test(value) && criteriaMustHaveLetterOrNumber.test(value);
};

const cityContentValidator = (value) => {
  if (value === "" || value === null) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.' ]*$/;
  const criteriaMustHaveLetter = /.*[a-z].*/i;
  return criteriaAllowedCharecters.test(value)
          && criteriaMustHaveLetter.test(value);
};

const provinceContentValidator = (value) => {
  if (value === "" || value === null) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.' ]*$/;
  const criteriaMustHaveLetter = /.*[a-z].*/i;
  const criteriaMustHaveNumber = /.*[0-9].*/;
  return criteriaAllowedCharecters.test(value)
          && criteriaMustHaveLetter.test(value)
          && !(criteriaMustHaveNumber.test(value));
};

const completePostalCodeValidator = (value) => {
  if (value === "" || value === null) {
    // Don't show error if field is blank.
    return true;
  }
  return value.length === 7;
}

export default {
  name: 'ContactInfoPage',
  mixins: [
    pageContentMixin,
    pageStepperMixin,
  ],
  components: {
    Button,
    Checkbox,
    ContinueBar,
    CountrySelect,
    Input,
    PageContent,
    PhoneNumberInput,
    PostalCodeInput,
    RegionSelect,
    TipBox
  },
  data: () => {
    return {
      isPageLoaded: false,
      onlyFPC: false,
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
      enrolmentRoutes.CONTACT_INFO_PAGE.title
    );

    this.onlyFPC = this.$store.state.enrolmentModule.isApplyingForFPCare
                  && !(this.$store.state.enrolmentModule.isApplyingForMSP || this.$store.state.enrolmentModule.isApplyingForSuppBen)
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

    if (this.onlyFPC) {
      this.isMailSame = false;
    }
    this.$nextTick(() => {
      this.isPageLoaded = true;
    })
  },
  validations() {
    let validations = {
      phone: {
        phoneValidator,
      },
    };
    if (!this.onlyFPC) {
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
      validations = {...validations, ...resValidations};
    }
    if ( !this.isMailSame ) {
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
          provinceContentValidator
        },
        mailCountry: {
          required,
        },
        
        mailPostalCode: {
          required,
          specialCharacterValidator: this.mailCountry === 'Canada' ? () => true : specialCharacterValidator,
          completePostalCodeValidator: this.mailCountry === 'Canada' ? completePostalCodeValidator : () => true,
        },
      };
      validations = {...validations, ...mailValidations};
    }

    return validations;
  },
  methods: {
    validateFields() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        scrollToError();
        return;
      }

      this.saveData();
      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(`${enrolmentModule}/${SET_RES_ADDRESS_LINE_1}`, this.resAddressLine1);
      this.$store.dispatch(`${enrolmentModule}/${SET_RES_ADDRESS_LINE_2}`, this.resAddressLine2);
      this.$store.dispatch(`${enrolmentModule}/${SET_RES_ADDRESS_LINE_3}`, this.resAddressLine3);
      this.$store.dispatch(`${enrolmentModule}/${SET_RES_CITY}`, this.resCity);
      this.$store.dispatch(`${enrolmentModule}/${SET_RES_PROVINCE}`, this.resProvince);
      this.$store.dispatch(`${enrolmentModule}/${SET_RES_COUNTRY}`, this.resCountry);
      this.$store.dispatch(`${enrolmentModule}/${SET_RES_POSTAL_CODE}`, this.resPostalCode);
      this.$store.dispatch(`${enrolmentModule}/${SET_MAIL_ADDRESS_LINE_1}`, this.mailAddressLine1);
      this.$store.dispatch(`${enrolmentModule}/${SET_MAIL_ADDRESS_LINE_2}`, this.mailAddressLine2);
      this.$store.dispatch(`${enrolmentModule}/${SET_MAIL_ADDRESS_LINE_3}`, this.mailAddressLine3);
      this.$store.dispatch(`${enrolmentModule}/${SET_MAIL_CITY}`, this.mailCity);
      this.$store.dispatch(`${enrolmentModule}/${SET_MAIL_PROVINCE}`, this.mailProvince);
      this.$store.dispatch(`${enrolmentModule}/${SET_MAIL_COUNTRY}`, this.mailCountry);
      this.$store.dispatch(`${enrolmentModule}/${SET_MAIL_POSTAL_CODE}`, this.mailPostalCode);
      this.$store.dispatch(`${enrolmentModule}/${SET_IS_MAIL_SAME}`, this.isMailSame);
      this.$store.dispatch(`${enrolmentModule}/${SET_PHONE}`, this.phone);
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
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
    handleClickDifferentAddress(){
      this.isMailSame = false;
    },
  },
  watch: {
    mailCountry: function(value, oldValue) {
      // don't clear province if the change is from loading from store
      if (this.isPageLoaded) {
        if(oldValue === "Canada" && value !== "Canada") {
          // don't keep a Canadian province if not in canada
          this.mailProvince = "";
          this.mailPostalCode = "";
        } else if (oldValue !== "Canada" && value === "Canada") {
          // if changing to canada, a canadian province must be selected by default.
          this.mailProvince = "British Columbia";
          this.mailPostalCode = "";
        }
      }
    }
  },
  computed: {},
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (to.path === enrolmentRoutes.HOME_PAGE.path) {
      this.$store.dispatch(enrolmentModule + '/' + RESET_FORM);
      next();
    } else if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.CONTACT_INFO_PAGE.path
      );
      next({
        path: toPath,
        replace: true
      });
      setTimeout(() => {
        scrollTo(topScrollPosition);
      }, 0);
    }
  }
}
</script>

<style scoped>
  .address-description {
    min-height: 3.5rem;
  }
</style>
