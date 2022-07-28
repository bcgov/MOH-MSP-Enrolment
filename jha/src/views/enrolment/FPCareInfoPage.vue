<template>
  <div>
    <div class="container stepper">
      <PageStepper :currentPath='$router.currentRoute.value.path'
        :routes='stepRoutes'
        @toggleShowMobileDetails='handleToggleShowMobileStepperDetails($event)'
        :isMobileStepperOpen='isMobileStepperOpen'
        @onClickLink='handleClickStepperLink($event)'/>
    </div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <main class="container pt-3 pt-sm-5 mb-3">
        <h1>Fair PharmaCare Financial Information</h1>
        <hr class="mt-0"/>
        <div class="row">
          <div class="col-md-7">
            <div>
              <CurrencyInput v-model="ahIncome"
                id="ah-income"
                :required="true"
                @blur="handleBlurField(v$.ahIncome)">
                <template v-slot:description>
                  <label for="ah-income">Enter the net income (Line 23600) from your {{noaYear}} CRA Notice of Assessment (NOA, <a href="javascript:void(0)" @click="handleClickIncomeSample()">sample</a>). For more information, see <a href='https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/fair-pharmacare-plan/frequently-asked-questions-about-registration-income-and-consent' target='_blank'>Frequently Asked Questions</a>.</label>
                </template>
              </CurrencyInput>
              <div class="text-danger"
                v-if="v$.ahIncome.$dirty
                  && v$.ahIncome.required.$invalid"
                aria-live="assertive">Your net income from {{noaYear}} is required.</div>
              <div class="text-danger"
                v-if="v$.ahIncome.$dirty
                  && v$.ahIncome.positiveNumberValidator.$invalid"
                aria-live="assertive">Your net income from {{noaYear}} is must be a positive number.</div>
            </div>
            <div v-if="hasSpouse">
              <CurrencyInput v-model="spouseIncome"
                id="spouse-income"
                class="mt-3"
                :required="true"
                @blur="handleBlurField(v$.spouseIncome)">
                <template v-slot:description>
                  <label for="spouse-income">Enter the net income (Line 23600) from your spouse's {{noaYear}} CRA Notice of Assessment (NOA, <a href="javscript:void(0)" @click="handleClickIncomeSample()">sample</a>). For more information, see <a href='https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/fair-pharmacare-plan/frequently-asked-questions-about-registration-income-and-consent' target='_blank'>Frequently Asked Questions</a>.</label>
                </template>
              </CurrencyInput>
              <div class="text-danger"
                v-if="v$.spouseIncome.$dirty
                  && hasSpouse
                  && v$.spouseIncome.required.$invalid"
                aria-live="assertive">Your spouse/common-law partner's net income from {{noaYear}} is required.</div>
              <div class="text-danger"
                v-if="v$.spouseIncome.$dirty
                  && hasSpouse
                  && v$.spouseIncome.positiveNumberValidator.$invalid"
                aria-live="assertive">Your spouse/common-law partner's net income from {{noaYear}} must be a positive number.</div>
            </div>
            <h2 class="mt-5">Registered Disability Savings Plan</h2>
            <hr/>
            <div>
              <CurrencyInput :label="`Enter the Registered Disability Savings Plan income (Line 12500) from your ${noaYear} tax return.`"
                v-model="ahRDSP"
                id="ah-disability-savings"
                class="mt-3"
                @blur="handleBlurField(v$.ahRDSP)"/>
              <div class="text-danger"
                v-if="v$.ahRDSP.$dirty
                  && v$.ahRDSP.positiveNumberValidator.$invalid"
                aria-live="assertive">Your Registered Disability Savings Plan amount from {{noaYear}} must be a positive number.</div>
            </div>
            <div v-if="hasSpouse">
              <CurrencyInput :label="`Enter the Registered Disability Savings Plan income (Line 12500) from your spouse's ${noaYear} tax return.`"
                v-model="spouseRDSP"
                id="spouse-disability-savings"
                class="mt-3"
                @blur="handleBlurField(v$.spouseRDSP)"/>
              <div class="text-danger"
                v-if="v$.spouseRDSP.$dirty
                  && v$.spouseRDSP.positiveNumberValidator.$invalid"
                aria-live="assertive">Your spouse/common-law partner's Registered Disability Savings Plan amount from {{noaYear}} must be a positive number.</div>
            </div>
          </div>
          <div class="col-md-5 mt-4 mt-md-0">
            <TipBox>
              <FPCWidget v-model="widgetData"/>
            </TipBox>
          </div>
        </div>
        <div v-if="isSystemUnavailable"
          class="text-danger mt-3 mb-5"
          aria-live="assertive">Unable to continue, system unavailable. Please try again later.</div>
        <div v-if="checkEligibilityErrorMessage"
          class="text-danger mt-3 mb-5"
          aria-live="assertive"
          v-html="checkEligibilityErrorMessage"></div>
      </main>
    </PageContent>
    <Teleport v-if="isSampleModalOpen"
      to="#modal-target">
      <ContentModal @close="handleCloseSampleModal()"
        title="Tax Documents">
        <p>Income Tax T1 General Sample</p>
        <div class="sample-image-container text-center">
          <img src="/ahdc/images/income-tax-t1-sample.jpeg"
            alt="Income tax T1 sample" />
        </div>
      </ContentModal>
    </Teleport>
    <ContinueBar @continue="validateFields()"
      :hasLoader='isLoading'
      class="continue-bar" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import {
  enrolmentRoutes,
  isEQPath,
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
  MODULE_NAME as enrolmentModule,
  SET_AH_FPC_INCOME,
  SET_AH_FPC_RDSP,
  SET_SPOUSE_FPC_INCOME,
  SET_SPOUSE_FPC_RDSP,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import apiService from '@/services/api-service';
import {
  ContentModal,
  ContinueBar,
  CurrencyInput,
  PageContent,
  optionalValidator,
  positiveNumberValidator,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import TipBox from '@/components/TipBox.vue';
import FPCWidget from '@/components/enrolment/FPCWidget.vue';
import { required } from '@vuelidate/validators';
import pageStepperMixin from '@/mixins/page-stepper-mixin';
import useVuelidate from '@vuelidate/core'

export default {
  name: 'FPCareInfoPage',
  mixins: [
    pageContentMixin,
    pageStepperMixin
  ],
  components: {
    ContentModal,
    ContinueBar,
    CurrencyInput,
    FPCWidget,
    PageContent,
    TipBox,
  },
  data: () => {
    return {
      noaYear: null,
      ahIncome: null,
      ahRDSP: null,
      spouseIncome: null,
      spouseRDSP: null,
      isSampleModalOpen: false,
      isLoading: false,
      isSystemUnavailable: false,
      checkEligibilityErrorMessage: null,
    };
  },
  setup () {
    return { v$: useVuelidate() }
  },
  created() {
    this.noaYear = new Date().getFullYear() - 2;

    this.ahIncome = this.$store.state.enrolmentModule.ahFPCIncome;
    this.ahRDSP = this.$store.state.enrolmentModule.ahFPCRDSP;
    this.spouseIncome = this.$store.state.enrolmentModule.spouseFPCIncome;
    this.spouseRDSP = this.$store.state.enrolmentModule.spouseFPCRDSP;

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.FPCARE_INFO_PAGE.path,
      enrolmentRoutes.FPCARE_INFO_PAGE.title
    );
  },
  validations() {
    const validations = {
      ahIncome: {
        required,
        positiveNumberValidator: optionalValidator(positiveNumberValidator),
      },
      ahRDSP: {
        positiveNumberValidator: optionalValidator(positiveNumberValidator),
      },
      spouseIncome: {
        positiveNumberValidator: optionalValidator(positiveNumberValidator),
      },
      spouseRDSP: {
        positiveNumberValidator: optionalValidator(positiveNumberValidator),
      },
    };
    if (this.hasSpouse) {
      validations.spouseIncome.required = required;
    }
    return validations;
  },
  methods: {
    validateFields() {
      this.v$.$touch()
      if (this.v$.$invalid) {
        scrollToError();
        return;
      }

      this.saveData();

      if (this.shouldCheckEligibility) {
        this.isLoading = true;
        this.isSystemUnavailable = false;
        this.checkEligibilityErrorMessage = null;

        apiService.checkEligibility(this.$store.state.enrolmentModule)
          .then((response) => {
            this.isLoading = false;

            if (response.data && response.data.regStatusCode === '0') {
              this.navigateToNextPage();
            } else if (response.data && response.data.exception) {
              this.isSystemUnavailable = true;
              scrollToError();
            } else {
              this.checkEligibilityErrorMessage = response.data.regStatusMsg;
              scrollToError();
            }
          })
          .catch(() => {
            this.isLoading = false;
            this.isSystemUnavailable = true;
            scrollToError();
          });
      } else {
        this.navigateToNextPage();
      }
    },
    saveData() {
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_FPC_INCOME}`, this.ahIncome);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_FPC_RDSP}`, this.ahRDSP);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_FPC_INCOME}`, this.spouseIncome);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_FPC_RDSP}`, this.spouseRDSP);
    },
    navigateToNextPage() {
      // Navigate to next path.
      const nextPath = this.$store.state.enrolmentModule.isApplyingForSuppBen ? enrolmentRoutes.SUPP_BEN_INFO_PAGE.path : enrolmentRoutes.CONTACT_INFO_PAGE.path;
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
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
    handleClickIncomeSample() {
      this.isSampleModalOpen = true;
    },
    handleCloseSampleModal() {
      this.isSampleModalOpen = false;
    }
  },
  computed: {
    hasSpouse() {
      return this.$store.state.enrolmentModule.hasSpouse === 'Y';
    },
    widgetData() {
      return {
        ahBirthdate: this.$store.state.enrolmentModule.ahBirthdate,
        spouseBirthdate: this.$store.state.enrolmentModule.spouseBirthDate,
        ahIncome: this.ahIncome,
        ahRDSP: this.ahRDSP,
        spouseIncome: this.spouseIncome,
        spouseRDSP: this.spouseRDSP,
      };
    },
    shouldCheckEligibility() {
      return this.$store.state.enrolmentModule.isApplyingForFPCare
          && !this.$store.state.enrolmentModule.isApplyingForMSP;
    }
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)
      && !isEQPath(to.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.FPCARE_INFO_PAGE.path
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
.continue-bar {
  z-index: 4; /* Fixes Bootstrap input group overlapping ContinueBar component. */
}
.sample-image-container img {
  max-width: 100%;
}
</style>
