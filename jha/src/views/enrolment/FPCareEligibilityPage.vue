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
      <main class="container pt-3 pt-sm-5 mb-3">
        <EligibilityQuestionnaireHeader>
        <h2>Fair PharmaCare</h2>
        <p>
          Fair PharmaCare helps pay for some drugs and medical devices and supplies, such as prostheses and diabetes supplies. It is based on income. The less you earn, the more help you get.
        </p>
        </EligibilityQuestionnaireHeader>
        <Radio
          id='apply-fpc'
          name='apply-fpc'
          label='1. Will you use this form to apply for Fair PharmaCare?'
          v-model='eqFPCIsApplying'
          :items='radioOptionsApplyFPC' />
        <div v-if="eqFPCIsApplying === 'Y'">
          <p class="mb-0">2. To apply for Fair PharmaCare, you must:</p>
          <div class="ml-4">
            <p class="mb-0">a. have been a resident of B.C. for at least three months;</p>
            <p class="mb-0">b. be registered with MSP or be using this application form to also apply for MSP and Fair PharmaCare; and</p>
            <p>c. have filed an income tax return with the Canada Revenue Agency (CRA) for the relevant taxation year (two years before the current year).</p>
          </div>
          <Radio
            id='meets-fpc-criteria'
            name='meets-fpc-criteria'
            label='Do you meet the above eligibility criteria?'
            v-model='eqFPCMeetsCriteria'
            :items='radioOptionsYesNo' />
          <div class="text-danger ml-4" v-if="eqFPCMeetsCriteria === 'N'">
            <p>
              You are not eligible to apply for Fair PharmaCare at this time. 
            </p>

            <ul>
              <li>
                If you have not been a resident of B.C. for at least three months, apply after you have completed the required wait period. 
              </li>
              <li>
                If you and/or your spouse did not file taxes with the CRA two years ago, do so as soon as possible. When you have submitted your tax return(s), apply for Fair PharmaCare. 
              </li>
              <li>
                If you and/or your spouse were not able to file taxes with the CRA two years ago (because you did not live in Canada, were a minor, or were exempt from filing taxes), contact HIBC at:
                <ContactInformation />
              </li>
            </ul>
          </div>
          <div v-if="eqFPCMeetsCriteria === 'Y'">
            <p class="mb-0">3. To apply for Fair PharmaCare, you must provide the following information:</p>
            <div class="ml-4">
              <p class="mb-0">a. Social Insurance Number (SIN) for you and (if applicable) your spouse;</p>
              <p class="mb-0">b. Net Income (Line 23600) from your and (if applicable) your spouse's CRA Notice of Assessment (NOA), Notice of Reassessment (NORA) or federal income tax return for the tax year two years before the current year; and</p>
              <p>c. Registered Disability Savings Plan (RDSP) income (Line 12500) from the above CRA NOA, NORA or federal income tax return.</p>
            </div>
            <Radio
              id='has-fpc-info'
              name='has-fpc-info'
              label='Do you have this information to include with your application?'
              v-model='eqFPCHasInfo'
              :items='radioOptionsYesNo' />
            <div class="text-danger pl-4 ml-4" v-if="eqFPCHasInfo === 'N'">
              <p>
                You must have this information to apply for Fair PharmaCare.
              </p>
              <ul>
                <li>
                  If you and/or your spouse do not have a Social Insurance Number, Contact Service Canada before you apply. If you are a new resident to Canada and do not qualify for a Social Insurance Number, contact HIBC at:
                  <ContactInformation />
                </li>
                <li>
                  If you and/or your spouse did not file taxes with the CRA two years ago, do so as soon as possible. When you have submitted your tax return(s), apply for Fair PharmaCare. If you and/or your spouse were not able to file taxes with the CRA two years ago (because you did not live in Canada, were a minor, or were exempt from filing taxes), contact HIBC.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="text-danger"
          v-if="$v.eqFPCIsApplying.$dirty && !$v.eqFPCIsApplying.validateQuestionsAnswered"
          aria-live="assertive">Please complete the questionnaire to continue.</div>
      </main>
    </PageContent>
    <ContinueBar
    @continue="validateFields()" />
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
  SET_IS_APPLYING_FOR_FPCARE,
  SET_EQ_FPC_IS_APPLYING,
  SET_EQ_FPC_MEETS_CRITERIA,
  SET_EQ_FPC_HAS_INFO,
  SET_MSG_CODE_FPC,
} from '@/store/modules/enrolment-module';
import pageStepperMixin from '@/mixins/page-stepper-mixin';
import { eqMsgCodesFPC } from '@/constants/eqMsgCodes';
import EligibilityQuestionnaireHeader from '@/components/EligibilityQuestionnaireHeader.vue';
import ContactInformation from '@/components/ContactInformation.vue';

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
  components: {
    ContinueBar,
    PageContent,
    Radio,
    EligibilityQuestionnaireHeader,
    ContactInformation,
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
        label: 'No (Continue to Supplementary Benefits)',
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
      this.$v.$touch()
      if (this.$v.$invalid) {
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