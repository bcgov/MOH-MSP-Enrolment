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
        <h1>Eligibility Questionnaire</h1>
        <p class="mb-0">You can use the British Columbia Application for Health Drug Coverage to apply for Medical Services Plan (MSP) enrolmnent, Fair PharmaCare, and/or MSP Supplementary Benefits.</p>
        <p class="mt-0">Answering the following questions will help you determine which programs you are eligible for, and ensure you have the required documents and information to complete your application(s).</p>
        <hr class="mt-0"/>
        <h2>Fair PharmaCare</h2>
        <Radio
          id='apply-fpc'
          name='apply-fpc'
          label='1. Will you use the British Columbia Application for Health Drug Coverage to register for Fair PharmaCare?'
          v-model='eqFPCIsApplying'
          :items='radioOptionsApplyFPC' />
        <div v-if="eqFPCIsApplying === 'Y'">
          <p class="mb-0">2. To register for Fair PharmaCare, you must:</p>
          <div class="ml-4">
            <p class="mb-0">a. have been a resident of British Columbia for at least three months;</p>
            <p class="mb-0">b. be registered with the Medical Services Plan (MSP); and</p>
            <p>c. have filed an income tax return with the Canada Revenue Agency (CRA) for the relevant taxation year (two years before the current year).</p>
          </div>
          <Radio
            id='meets-fpc-criteria'
            name='meets-fpc-criteria'
            label='Do you meet the above eligibility criteria?'
            v-model='eqFPCMeetsCriteria'
            :items='radioOptionsYesNo' />
          <p class="font-weight-bold ml-4" v-if="eqFPCMeetsCriteria === 'N'">You are not eligible to register for Fair PharmaCare at this time. Register after you have completed the required wait period and registered with the Medical Services Plan.  If you (or your spouse) did not submit a tax return for the taxation year two years before the current year: file an income tax return with the Canada Revenue Agency for the required taxation year as soon as possible.  When you have submitted your tax return(s), register your family for Fair PharmaCare.  If you cannot file an income tax return for the relevant year because you are a new resident of Canada, contact Health Insurance BC.</p>
          <div v-if="eqFPCMeetsCriteria === 'Y'">
            <p class="mb-0">3. To register for Fair PharmaCare, you must include the following with your application:</p>
            <div class="ml-4">
              <p class="mb-0">a. Social Insurance Number (SIN) for you and (if applicable) your spouse;</p>
              <p class="mb-0">b. Net Income shown on Line 23600 of your and if applicable, your spouse's CRA Notice of Assessment or federal income tax return for the relevant taxation year (two years before the current year); and</p>
              <p>c. If you received income form a Registered Disability Savings Plan (RDSP), income shown on Line 12500 of your and if applicable, your spouse's CRA Notice of Assessment or federal income tax return for the relevant taxation year (two years before the current year). If you did not receive RDSP income, you will enter $0.</p>
            </div>
            <Radio
              id='has-fpc-info'
              name='has-fpc-info'
              label='Do you have the above information to include with your application?'
              v-model='eqFPCHasInfo'
              :items='radioOptionsYesNo' />
            <ul class="font-weight-bold pl-4 ml-4" v-if="eqFPCHasInfo === 'N'">
              <li>If you (or your spouse) do not have a Social Insurance Number: Contact Service Canada before submitting an application. If you are a new resident to Canada and do not qualify for a Social Insurance Number, contact Health Insurance BC.</li>
              <li>If you (or your spouse) did not submit a tax return for the taxation year two years before the current year: file an income tax return with the Canada Revenue Agency for the required taxation year as soon as possible. When you have submitted your tax return(s), register your family for Fair PharmaCare.  If you cannot file an income tax return for the relevant year because you are a new resident of Canada, contact Health Insurance BC.</li>
            </ul>
          </div>
        </div>
        <div class="text-danger"
          v-if="v.eqFPCIsApplying.$dirty && !v.eqFPCIsApplying.validateQuestionsAnswered.$response"
          aria-live="assertive">Please complete the questionnaire to continue.</div>
      </div>
    </PageContent>
    <ContinueBar
    @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import logService from '@/services/log-service';
import useVuelidate from '@vuelidate/core'
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
  SET_IS_APPLYING_FOR_FPCARE,
  SET_EQ_FPC_IS_APPLYING,
  SET_EQ_FPC_MEETS_CRITERIA,
  SET_EQ_FPC_HAS_INFO,
  SET_MSG_CODE_FPC,
} from '@/store/modules/enrolment-module';
import pageStepperMixin from '@/mixins/page-stepper-mixin';
import { eqMsgCodesFPC } from '@/constants/eqMsgCodes';

const validateQuestionsAnswered = (_value, vm) => {
        if(!vm.eqFPCIsApplying
          || (vm.eqFPCIsApplying === 'Y' && !vm.eqFPCMeetsCriteria)
          || (vm.eqFPCIsApplying === 'Y' && vm.eqFPCMeetsCriteria === 'Y' && !vm.eqFPCHasInfo)) {
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
  setup () {
    return { v: useVuelidate() }
  },
  components: {
    ContinueBar,
    PageContent,
    Radio,
  },
  data: () => {
    return {
      isPageLoaded: false,
      eqFPCIsApplying: null,
      eqFPCMeetsCriteria: null,
      eqFPCHasInfo: null,
      radioOptionsYesNo: radioOptionsYesNo,
      radioOptionsApplyFPC: null,
    };
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.path,
      enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.title
    );
    this.eqFPCIsApplying = this.$store.state.enrolmentModule.eqFPCIsApplying;
    this.eqFPCMeetsCriteria = this.$store.state.enrolmentModule.eqFPCMeetsCriteria;
    this.eqFPCHasInfo = this.$store.state.enrolmentModule.eqFPCHasInfo;

    this.radioOptionsApplyFPC = [
      {
        id: 'yes',
        label: 'Yes',
        value: 'Y',
      },
      {
        id: 'no',
        label: 'No: (continue to MSP Supplementary Benefits).',
        value: 'N',
      }
    ];

    this.$nextTick(() => {
      this.isPageLoaded = true;
    })
  },
  validations() {
    const validations = {
      eqFPCIsApplying: {
        validateQuestionsAnswered,
      }
    };
    return validations;
  },
  methods: {
    validateFields() {
      this.v.$touch()
      if (this.v.$invalid) {
        scrollToError();
        return;
      }
      this.saveData();
      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_FPCARE, this.eqFPCIsApplying === "Y");
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_FPC_IS_APPLYING, this.eqFPCIsApplying);
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_FPC_MEETS_CRITERIA, this.eqFPCMeetsCriteria);
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_FPC_HAS_INFO, this.eqFPCHasInfo);
      this.$store.dispatch(enrolmentModule + '/' + SET_MSG_CODE_FPC, this.msgCode);
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    }
  },
  computed: {
    msgCode(){
      if (this.eqFPCIsApplying === 'N') {
        // Not applying for FPC
        return eqMsgCodesFPC.NotApplying;
      } else if (this.eqFPCMeetsCriteria === 'N') {
        // Ineligible
        return eqMsgCodesFPC.NotMeetsCriteria;
      } else if (this.eqFPCHasInfo === 'N') {
        // Ineligible
        return eqMsgCodesFPC.NotHasInfo;
      } else {
        // Eligible for FPC
        return eqMsgCodesFPC.EligibleAndApplying;
      }
    }
  },
  watch: {
    eqFPCIsApplying() {
      if (this.isPageLoaded) {
        this.eqFPCMeetsCriteria = null;
      }
    },
    eqFPCMeetsCriteria() {
      if (this.isPageLoaded) {
        this.eqFPCHasInfo = null;
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
        enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.path
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