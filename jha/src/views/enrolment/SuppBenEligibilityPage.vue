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
        <h1>Eligibility questionnaire</h1>
        <p class="mb-0">You can use the Joint Health Application to apply for Medical Services Plan (MSP) enrolmnent, Fair PharmaCare, and/or MSP Supplementary Benefits.</p>
        <p class="mt-0">Answering the following questions will help you determine which programs you are eligible for, and ensure you have the required documents and information to complete your application(s).</p>
        <hr class="mt-0"/>
        <h2>MSP Supplementary Benefits</h2>
        <Radio
          id='apply-sb'
          name='apply-sb'
          label='1. Will you use the Joint Health Application to apply for supplementary benefits?'
          v-model='applySB'
          :items='radioOptionsYesNo' />
        <div v-if="applySB === 'Y'">
          <p class="mb-0">2. To register for MSP supplementary benefits, you must:</p>
          <div class="ml-5">
            <p class="mb-0">1. be a resident of British Columbia as defined by the Medicare Protection Act;</p>
            <p class="mb-0">2. have resided in Canada as a Canadian citizen or holder of a permanent resident status (landed immigrant) for at least the last 12 months immediately preceding this application; and</p>
            <p>3. not be exempt from liability to pay income tax by reason of any other act</p>
          </div>
          <Radio
            id='meets-sb-criteria'
            name='meets-sb-criteria'
            label='Do you meet the above eligibility criteria?'
            v-model='eqSBMeetsCriteria'
            :items='radioOptionsYesNo' />
          <p class="font-weight-bold" v-if="eqSBMeetsCriteria === 'N'">You are not eligible to apply for MSP supplementary benefits at this time. Please submit an application when you meet the residency requirements.  For assistance, please contact Health Insurance BC.  For more information on eligibility requirements, see Applying for Supplementary Benefits.</p>
          <div v-if="eqSBMeetsCriteria === 'Y'">
            <p class="mb-0">3. To apply for MSP supplementary benefits, you must include the following with your application:</p>
            <div class="ml-5">
              <p class="mb-0">1. Social Insurance Number (SIN) for you and (if applicable) your spouse;</p>
              <p class="mb-0">2. a digital copy (pdf, jpg, png) of your and if applicable, your spouse's CRA Notice of Assessment (NOA) or Notice of Reassessment (NORA) for the relevant taxation year (previous year or previous two tax year to the current calendar year); and</p>
              <p>3. Net Income (Line 23600) and Registered Disability Savings Plan (RDSP) income (Line 12500) from the above CRA NOA or NORA.</p>
            </div>
            <Radio
              id='has-sb-info'
              name='has-sb-info'
              label='Do you have the above documents and information to include with your application?'
              v-model='eqSBhasInfo'
              :items='radioOptionsYesNo' />
            <ul class="font-weight-bold pl-4" v-if="eqSBhasInfo === 'N'">
              <li class="ml-0">If you (or your spouse) do not have a Social Insurance Number: Contact Service Canada before submitting an application. If you are a new resident to Canada and do not qualify for a Social Insurance Number, contact Health Insurance BC.</li>
              <li class="ml-0">If you (or your spouse) did not submit a tax return for a valid taxation year: file an income tax return with the Canada Revenue Agency for the required year as soon as possible. When you have recieved an NOA/NORA, apply for supplementary benefits.  If you cannot file an income tax return for the relevant year because you are a new resident of Canada, contact Health Insurance BC.</li>
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
  SET_EQ_SB_MEETS_CRITERIA,
  SET_EQ_SB_HAS_INFO,
  SET_MSG_CODE_SB,
} from '@/store/modules/enrolment-module';
import pageStepperMixin from '@/mixins/page-stepper-mixin';

const validateQuestionsAnswered = (_value, vm) => {
        if(!vm.applySB
          || (vm.applySB === 'Y' && !vm.eqSBMeetsCriteria)
          || (vm.applySB === 'Y' && vm.eqSBMeetsCriteria === 'Y' && !vm.eqSBhasInfo)) {
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
  },
  data: () => {
    return {
      isPageLoaded: false,
      applySB: null,
      eqSBMeetsCriteria: null,
      eqSBhasInfo: null,
      radioOptionsYesNo: radioOptionsYesNo,
    };
  },
  created() {
    logService.logNavigation(
      this.applicationUuid,
      enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path,
      enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.title
    );
    const isApplyingForFPCare = this.$store.state.enrolmentModule.isApplyingForSuppBen;
    if (isApplyingForFPCare !== null) {
      isApplyingForFPCare ? this.applySB = "Y" : this.applySB = "N";
    }
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
      this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_SUPP_BEN, this.applySB === "Y");
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
      if (this.applySB === 'N') {
        // Not applying for SB
        return 0;
      } else if (this.eqSBMeetsCriteria  === 'N') {
        // Ineligible
        return 1;
      } else if (this.eqSBhasInfo === 'N') {
        // Ineligible
        return 2;
      } else {
        // Eligible for SB
        return 3;
      }
    }
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