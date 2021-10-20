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
            <Input label="Address Line 2"
              id="res-address-line2"
              v-model="resAddressLine2"
              @blur="handleBlurField($v.resAddressLine2)" />
            <Input label="Address Line 3"
              id="res-address-line3"
              v-model="resAddressLine3"
              @blur="handleBlurField($v.resAddressLine3)" />
            <Input label="City"
              id="res-city"
              v-model="resCity"
              @blur="handleBlurField($v.resCity)" />
            <Input label="Province"
              id="res-province"
              v-model="resProvince"
              @blur="handleBlurField($v.resProvince)" />
            <Input label="Country"
              id="res-country"
              v-model="resCountry"
              @blur="handleBlurField($v.resCountry)" />
            <PostalCodeInput label="Postal Code"
              id="res-postal-code"
              v-model="resPostalCode"
              @blur="handleBlurField($v.resPostalCode)" />
          </div>
          <div class="col-md-6">
            <div>
              <h2>Mailing Address</h2>
              <p class="address-description">Enter your mailing address - if it's different</p>
            </div>
            <hr class="mt-0"/>
            <div v-if="mailSame">
              <Button label='My Mailing Address is Different'
                @click='differentAddress()'
                class='different-address btn-warning'/>
            </div>
            <div v-else>
              <Input label="Address Line 1"
                id="mail-address-line1"
                v-model="mailAddressLine1"
                @blur="handleBlurField($v.mailAddressLine1)" />
              <Input label="Address Line 2 (optional)"
                id="mail-address-line2"
                v-model="mailAddressLine2"
                @blur="handleBlurField($v.mailAddressLine2)" />
              <Input label="Address Line 3 (optional)"
                id="mail-address-line3"
                v-model="mailAddressLine3"
                @blur="handleBlurField($v.mailAddressLine3)" />
              <Input label="City"
                id="mail-city"
                v-model="mailCity"
                @blur="handleBlurField($v.mailCity)" />
              <Input label="Province"
                id="mail-province"
                v-model="mailProvince"
                @blur="handleBlurField($v.mailProvince)" />
              <Input label="Country"
                id="mail-country"
                v-model="mailCountry"
                @blur="handleBlurField($v.mailCountry)" />
              <PostalCodeInput label="Postal Code"
                id="mail-postal-code"
                v-model="mailPostalCode"
                @blur="handleBlurField($v.mailPostalCode)" />
            </div>
          </div>
        </div>
        <input type="checkbox" id="sameAddressCheck" v-model="mailSame">
        <label for="sameAddressCheck">This is my mailing address.</label>
        <h2>Phone</h2>   
        <hr class="mt-0"/>
        <PhoneNumberInput id='phone-input'
          label='Phone number (optional)'
          v-model='phone'
          className='mt-3'
          class='phone-number'
          :inputStyle='phoneInputStyle' />
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
  getTopScrollPosition
} from '@/helpers/scroll';
import {
  getConvertedPath,
} from '@/helpers/url';
import {
  MODULE_NAME as formModule,
  SET_PHONE,
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
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

const phoneValidator = (value) => {
  if (!value) {
    return true;
  }
  const stripped = value
        .replace(/_/g, '') // remove underlines
        .replace(/\s/g, '') // spaces
        .replace(/\+|-/g, '') // + or - symbol
        .replace('(', '')
        .replace(')', '');
  return stripped.length === 10;
};

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
      mailSame: true,
      phone: null,
      phoneInputStyle: {
        width: '160px',
        maxWidth: '100%',
      }
    };
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.CONTACT_INFO_PAGE.path,
      enrolmentRoutes.CONTACT_INFO_PAGE.title
    );

    this.phone = this.$store.state.enrolmentModule.phone;
  },
  validations() {
    const validations = {
      phone: {
        phoneValidator,
      },
    };
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
      this.mailDifferent = true;
    },
  },
  computed: {},
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (to.path === enrolmentRoutes.HOME_PAGE.path) {
      this.$store.dispatch(formModule + '/' + RESET_FORM);
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
