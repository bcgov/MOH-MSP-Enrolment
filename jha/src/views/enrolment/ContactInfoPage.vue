<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Contact Information</h1>
        <hr class="mt-0"/>
        <div class="row">
          <div class="col-md-6">
            <div>
              <h2>Residential Address</h2>
              <p class="address-description">Enter your residential address - that's the address you currently live at in B.C.</p>
            </div>
            <hr class="mt-0"/>
            <Input label="Address Line 1"
              id="res-address-line1"
              v-model="resAddressLine1"
              @blur="handleBlurField($v.resAddressLine1)" />
            <div class="text-danger" v-if="$v.resAddressLine1.$dirty && !$v.resAddressLine1.required" aria-live="assertive">Street address is required.</div>
            <div class="text-danger"
                v-if="$v.resAddressLine1.$dirty && !$v.resAddressLine1.specialCharacterValidator"
                aria-live="assertive">Street address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
            <div class="text-danger"
              v-if="$v.resAddressLine1.$dirty && $v.resAddressLine1.required && !$v.resAddressLine1.maxLength"
              aria-live="assertive">Street address exceeds the maximum number of allowable characters.</div>
            <Input label="Address Line 2 (optional)"
              id="res-address-line2"
              v-model="resAddressLine2"
              @blur="handleBlurField($v.resAddressLine2)" />
            <div class="text-danger"
                v-if="$v.resAddressLine2.$dirty && !$v.resAddressLine2.specialCharacterValidator"
                aria-live="assertive">Street address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
              <div class="text-danger"
              v-if="$v.resAddressLine2.$dirty && !$v.resAddressLine2.maxLength"
              aria-live="assertive">Street address exceeds the maximum number of allowable characters.</div>
            <Input label="Address Line 3 (optional)"
              id="res-address-line3"
              v-model="resAddressLine3"
              @blur="handleBlurField($v.resAddressLine3)" />
            <div class="text-danger"
                v-if="$v.resAddressLine3.$dirty && !$v.resAddressLine3.specialCharacterValidator"
                aria-live="assertive">Street address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
            <div class="text-danger"
              v-if="$v.resAddressLine3.$dirty && !$v.resAddressLine3.maxLength"
              aria-live="assertive">Street address exceeds the maximum number of allowable characters.</div>
            <Input label="City"
              id="res-city"
              v-model="resCity"
              @blur="handleBlurField($v.resCity)" />
            <div class="text-danger" v-if="$v.resCity.$dirty && !$v.resCity.required" aria-live="assertive">City is required.</div>
            <div class="text-danger"
              v-if="$v.resCity.$dirty && $v.resCity.required && !$v.resCity.maxLength"
              aria-live="assertive">City exceeds the maximum number of allowable characters.</div>
            <div class="text-danger"
                v-if="$v.resCity.$dirty && !$v.resCity.specialCharacterValidator"
                aria-live="assertive">City cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
            <Input label="Province"
              id="res-province"
              v-model="resProvince"
              @blur="handleBlurField($v.resProvince)"
              :disabled='true' />
            <Input label="Country"
              id="res-country"
              v-model="resCountry"
              @blur="handleBlurField($v.resCountry)"
              :disabled='true' />
            <PostalCodeInput label="Postal Code"
              id="res-postal-code"
              v-model="resPostalCode"
              @blur="handleBlurField($v.resPostalCode)" />
            <div class="text-danger" v-if="$v.resPostalCode.$dirty && !$v.resPostalCode.required" aria-live="assertive">Postal code is required.</div>
            <div class="text-danger" v-if="$v.resPostalCode.$dirty && $v.resPostalCode.required && !$v.resPostalCode.bcPostalCodeValidator" aria-live="assertive">Postal code entered must be in BC.</div>
          </div>
          <div class="col-md-6">
            <div>
              <h2>Mailing Address</h2>
              <p class="address-description">Enter your mailing address - if it's different</p>
            </div>
            <hr class="mt-0"/>
            <div v-if="isMailSame">
              <Button label='My Mailing Address is Different'
                @click='differentAddress()'
                color='gold'
                class='different-address'/>
            </div>
            <div v-else>
              <Input label="Address Line 1"
                id="mail-address-line1"
                v-model="mailAddressLine1"
                @blur="handleBlurField($v.mailAddressLine1)" />
              <div class="text-danger" v-if="$v.mailAddressLine1.$dirty && !$v.mailAddressLine1.required" aria-live="assertive">Mailing address is required.</div>
              <div class="text-danger"
                v-if="$v.mailAddressLine1.$dirty && !$v.mailAddressLine1.specialCharacterValidator"
                aria-live="assertive">Mailing address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
              <div class="text-danger"
                v-if="$v.mailAddressLine1.$dirty && $v.mailAddressLine1.required && !$v.mailAddressLine1.maxLength"
                aria-live="assertive">Mailing address exceeds the maximum number of allowable characters.</div>
              <Input label="Address Line 2 (optional)"
                id="mail-address-line2"
                v-model="mailAddressLine2"
                @blur="handleBlurField($v.mailAddressLine2)" />
              <div class="text-danger"
                v-if="$v.mailAddressLine2.$dirty && !$v.mailAddressLine2.maxLength"
                aria-live="assertive">Mailing address exceeds the maximum number of allowable characters.</div>
              <div class="text-danger"
                v-if="$v.mailAddressLine2.$dirty && !$v.mailAddressLine2.specialCharacterValidator"
                aria-live="assertive">Mailing address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
              <Input label="Address Line 3 (optional)"
                id="mail-address-line3"
                v-model="mailAddressLine3"
                @blur="handleBlurField($v.mailAddressLine3)" />
              <div class="text-danger"
                v-if="$v.mailAddressLine3.$dirty && !$v.mailAddressLine3.specialCharacterValidator"
                aria-live="assertive">Mailing address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
              <div class="text-danger"
                v-if="$v.mailAddressLine3.$dirty && !$v.mailAddressLine3.maxLength"
                aria-live="assertive">Mailing address exceeds the maximum number of allowable characters.</div>
              <Input label="City"
                id="mail-city"
                v-model="mailCity"
                @blur="handleBlurField($v.mailCity)" />
              <div class="text-danger" v-if="$v.mailCity.$dirty && !$v.mailCity.required" aria-live="assertive">City is required.</div>
              <div class="text-danger"
                v-if="$v.mailCity.$dirty && $v.mailCity.required && !$v.mailCity.maxLength"
                aria-live="assertive">City exceeds the maximum number of allowable characters.</div>
              <div class="text-danger"
                v-if="$v.mailCity.$dirty && !$v.mailCity.specialCharacterValidator"
                aria-live="assertive">City cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
              <Input label="Province"
                id="mail-province"
                v-model="mailProvince"
                @blur="handleBlurField($v.mailProvince)" />
              <div class="text-danger" v-if="$v.mailProvince.$dirty && !$v.mailProvince.required" aria-live="assertive">Province is required.</div>
              <div class="text-danger"
                v-if="$v.mailProvince.$dirty && !$v.mailProvince.specialCharacterValidator"
                aria-live="assertive">Province cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
              <div class="text-danger"
                v-if="$v.mailProvince.$dirty && $v.mailProvince.required && !$v.mailProvince.maxLength"
                aria-live="assertive">Province exceeds the maximum number of allowable characters.</div>
              <Input label="Country"
                id="mail-country"
                v-model="mailCountry"
                @blur="handleBlurField($v.mailCountry)" />
              <div class="text-danger" v-if="$v.mailCountry.$dirty && !$v.mailCountry.required" aria-live="assertive">Country is required.</div>
              <div class="text-danger"
                v-if="$v.mailCountry.$dirty && !$v.mailCountry.specialCharacterValidator"
                aria-live="assertive">Country cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
              <div class="text-danger"
                v-if="$v.mailCountry.$dirty && $v.mailCountry.required && !$v.mailCountry.maxLength"
                aria-live="assertive">Country exceeds the maximum number of allowable characters.</div>
              <Input label="Postal Code"
                id="mail-postal-code"
                v-model="mailPostalCode"
                @blur="handleBlurField($v.mailPostalCode)" />
              <div class="text-danger" v-if="$v.mailPostalCode.$dirty && !$v.mailPostalCode.required" aria-live="assertive">Postal code is required.</div>
              <div class="text-danger"
                v-if="$v.mailPostalCode.$dirty && !$v.mailPostalCode.specialCharacterValidator"
                aria-live="assertive">Postal Code cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
              <div class="text-danger"
                v-if="$v.mailPostalCode.$dirty && $v.mailPostalCode.required && !$v.mailPostalCode.maxLength"
                aria-live="assertive">Postal Code exceeds the maximum number of allowable characters.</div>
            </div>
          </div>
        </div>
        <input type="checkbox" id="sameAddressCheck" v-model="isMailSame">
        <label for="sameAddressCheck">This is my mailing address.</label>
        <h2>Phone</h2>   
        <hr class="mt-0"/>
        <PhoneNumberInput id='phone-input'
          label='Phone number (optional)'
          v-model='phone'
          className='mt-3'
          class='phone-number'
          :inputStyle='smallStyles' />
        <div class="text-danger"
            v-if="!$v.phone.phoneValidator"
            aria-live="assertive">The phone number you entered is not valid.</div>
        <br/>
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
  ContinueBar,
  PageContent,
  Input,
  PostalCodeInput,
  Button,
  PhoneNumberInput,
  phoneValidator,
  bcPostalCodeValidator,
  specialCharacterValidator,
} from 'common-lib-vue';
import {
  required,
  maxLength,
} from 'vuelidate/lib/validators';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'ContactInfoPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    PageContent,
    Input,
    PostalCodeInput,
    Button,
    PhoneNumberInput,
  },
  data: () => {
    return {
      resAddressLine1: null,
      resAddressLine2: null,
      resAddressLine3: null,
      resCity: null,
      resProvince: "British Columbia",
      resCountry: "Canada",
      resPostalCode: null,
      mailAddressLine1: null,
      mailAddressLine2: null,
      mailAddressLine3: null,
      mailCity: null,
      mailProvince: "British Columbia",
      mailCountry: "Canada",
      mailPostalCode: null,
      isMailSame: true,
      phone: null,
    };
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.CONTACT_INFO_PAGE.path,
      enrolmentRoutes.CONTACT_INFO_PAGE.title
    );

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
  },
  validations() {
    let validations = {
      resAddressLine1: {
        required,
        specialCharacterValidator,
        maxLength: maxLength(25),
      },
      resAddressLine2: {
        specialCharacterValidator,
        maxLength: maxLength(25),
      },
      resAddressLine3: {
        specialCharacterValidator,
        maxLength: maxLength(25),
      },
      resCity: {
        required,
        maxLength: maxLength(25),
        specialCharacterValidator,
      },
      resPostalCode: {
        required,
        bcPostalCodeValidator,
      },
      phone: {
        phoneValidator,
      },
    };
    if ( !this.isMailSame ) {
      let mailValidations = {
        mailAddressLine1: {
          required,
          specialCharacterValidator,
          maxLength: maxLength(25),
        },
        mailAddressLine2: {
          specialCharacterValidator,
          maxLength: maxLength(25),
        },
        mailAddressLine3: {
          specialCharacterValidator,
          maxLength: maxLength(25),
        },
        mailCity: {
          required,
          maxLength: maxLength(25),
          specialCharacterValidator,
        },
        mailProvince: {
          required,
          maxLength: maxLength(25),
          specialCharacterValidator
        },
        mailCountry: {
          required,
          maxLength: maxLength(250),
          specialCharacterValidator
        },
        
        mailPostalCode: {
          required,
          maxLength: maxLength(25),
          specialCharacterValidator
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
      let nextPath;
      if (this.$store.state.enrolmentModule.isApplyingForFPCare) {
        nextPath = enrolmentRoutes.FPCARE_INFO_PAGE.path;
      } else if (this.$store.state.enrolmentModule.isApplyingForSuppBen) {
        nextPath = enrolmentRoutes.SUPP_BEN_INFO_PAGE.path;
      } else {
        nextPath = enrolmentRoutes.DOCUMENTS_PAGE.path;
      }
      
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        nextPath
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
    differentAddress(){
      this.isMailSame = false;
    },
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
  #sameAddressCheck {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
</style>
