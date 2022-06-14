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
        <EligibilityQuestionnaireHeader>
        <h2>Supplementary Benefits</h2>
        <p>
          Supplementary Benefits provides partial payment for certain medical services, such as acupuncture and massage therapy, and may provide access to other income-based programs. Individuals or families must have an adjusted net income of $42,000 a year or less to be eligible.
        </p>
        </EligibilityQuestionnaireHeader>
        <Radio
          id='apply-sb'
          name='apply-sb'
          label='1. Will you use the British Columbia Application for Health and Drug Coverage to apply for Supplementary Benefits?'
          v-model='eqSBIsApplying'
          :items='radioOptionsYesNo' />
        <div v-if="eqSBIsApplying === 'Y'">
          <p class="mb-0">2. To register for Supplementary Benefits, you must:</p>
          <div class="ml-4">
            <p class="mb-0">a. be a resident of British Columbia as defined by the <em>Medicare Protection Act</em>;</p>
            <p class="mb-0">b. have resided in Canada as a Canadian citizen or holder of a permanent resident status (landed immigrant) for at least the last 12 months immediately preceding this application; and</p>
            <p>c. not be exempt from liability to pay income tax by reason of any other Act</p>
          </div>
          <Radio
            id='meets-sb-criteria'
            name='meets-sb-criteria'
            label='Do you meet the above eligibility criteria?'
            v-model='eqSBMeetsCriteria'
            :items='radioOptionsYesNo' />
          <p class="text-danger ml-4" v-if="eqSBMeetsCriteria === 'N'">You are not eligible to apply for Supplementary Benefits at this time. Please submit an application when you meet the residency requirements.  For assistance, please contact Health Insurance BC.  For more information on eligibility requirements, see <a target="_blank" href="https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/benefits/services-covered-by-msp/supplementary-benefits#apply-for-benefits">Applying for Supplementary Benefits.</a></p>
          <div v-if="eqSBMeetsCriteria === 'Y'">
            <p class="mb-0">3. To apply for Supplementary Benefits, you must include the following with your application:</p>
            <div class="ml-4">
              <p class="mb-0">a. Social Insurance Number (SIN) for you and (if applicable) your spouse;</p>
              <p class="mb-0">b. a digital copy (pdf, jpg, png) of your and if applicable, your spouse's CRA Notice of Assessment (NOA) or Notice of Reassessment (NORA) for the most recent taxation year; and</p>
              <p>c. Net Income (Line 23600) and Registered Disability Savings Plan (RDSP) income (Line 12500) from the above CRA NOA or NORA.</p>
            </div>
            <Radio
              id='has-sb-info'
              name='has-sb-info'
              label='Do you have the above documents and information to include with your application?'
              v-model='eqSBhasInfo'
              :items='radioOptionsYesNo' />
            <ul class="text-danger pl-4 ml-4" v-if="eqSBhasInfo === 'N'">
              <li class="ml-0">If you (or your spouse) do not have a Social Insurance Number, Contact Service Canada before submitting an application. If you are a new resident to Canada and do not qualify for a Social Insurance Number, contact Health Insurance BC.</li>
              <li class="ml-0">If you and/or your spouse did not file taxes with the CRA two years ago, do so as soon as possible. If you and/or your spouse were not able to file taxes with the CRA two years ago (because you did not live in Canada, were a minor, or were exempt from filing taxes), please contact HIBC. If we are not able to verify your income or you do not provide your consent you will not receive coverage based on your income.</li>
            </ul>
          </div>
        </div>
        <div class="text-danger"
                      v-if="$v.applyFPC.$dirty && !$v.applyFPC.validateQuestionsAnswered"
                      aria-live="assertive">Please complete the questionnaire to continue.</div>
      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import logService from '@/services/log-service';
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
  radioOptionsYesNo,
} from '@/constants/radio-options';
import {
  PageContent,
  ContinueBar,
  Radio,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import {
  MODULE_NAME as enrolmentModule,
  SET_IS_APPLYING_FOR_SUPP_BEN,
  SET_EQ_SB_IS_APPLYING,
  SET_EQ_SB_MEETS_CRITERIA,
  SET_EQ_SB_HAS_INFO,
  SET_MSG_CODE_SB,
} from '@/store/modules/enrolment-module';
import pageStepperMixin from '@/mixins/page-stepper-mixin';
import { eqMsgCodesSB } from '@/constants/eqMsgCodes';
import EligibilityQuestionnaireHeader from '@/components/EligibilityQuestionnaireHeader.vue';

const validateQuestionsAnswered = (_value, vm) => {
      if(!vm.eqSBIsApplying
        || (vm.eqSBIsApplying === 'Y' && !vm.eqSBMeetsCriteria)
        || (vm.eqSBIsApplying === 'Y' && vm.eqSBMeetsCriteria === 'Y' && !vm.eqSBhasInfo)) {
        return false;
      }
      return true;
}

export default {
  name: 'MSPEligibilityPage',
  mixins: [
    pageContentMixin,
    pageStepperMixin,
  ],
  components: {
    ContinueBar,
    PageContent,
    Radio,
    EligibilityQuestionnaireHeader,
  },
  data: () => {
    return {
      isPageLoaded: false,
      eqSBIsApplying: null,
      eqSBMeetsCriteria: null,
      eqSBhasInfo: null,
      radioOptionsYesNo: radioOptionsYesNo,
    };
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path,
      enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.title
    );
    this.eqSBIsApplying = this.$store.state.enrolmentModule.eqSBIsApplying;
    this.eqSBMeetsCriteria = this.$store.state.enrolmentModule.eqSBMeetsCriteria;
    this.eqSBhasInfo = this.$store.state.enrolmentModule.eqSBhasInfo;

    this.$nextTick(() => {
      this.isPageLoaded = true;
    })
  },
  validations() {
    const validations = {
      applyFPC: {
        validateQuestionsAnswered,
      }
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
      this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_SUPP_BEN, this.eqSBIsApplying === "Y");
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_SB_IS_APPLYING, this.eqSBIsApplying);
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_SB_MEETS_CRITERIA, this.eqSBMeetsCriteria);
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_SB_HAS_INFO, this.eqSBhasInfo);
      this.$store.dispatch(enrolmentModule + '/' + SET_MSG_CODE_SB, this.msgCode);
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.FORM_SELECTION_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    }
  },
  computed: {
    msgCode(){
      if (this.eqSBIsApplying === 'N') {
        // Not applying for SB
        return eqMsgCodesSB.NotApplying;
      } else if (this.eqSBMeetsCriteria  === 'N') {
        // Ineligible
        return eqMsgCodesSB.NotMeetsCriteria;
      } else if (this.eqSBhasInfo === 'N') {
        // Ineligible
        return eqMsgCodesSB.NotHasInfo;
      } else {
        // Eligible for SB
        return eqMsgCodesSB.EligibleAndApplying;
      }
    }
  },
  watch: {
    eqSBIsApplying() {
      if (this.isPageLoaded) {
        this.eqSBMeetsCriteria = null;
      }
    },
    eqSBMeetsCriteria() {
      if (this.isPageLoaded) {
        this.eqSBhasInfo = null;
      }
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path
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

<style>
.md-radio {
  margin-left: 24px !important;
}
</style>