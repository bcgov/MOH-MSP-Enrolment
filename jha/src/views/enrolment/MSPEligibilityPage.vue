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
        <p class="mb-0">You can use the Joint Health Application to apply for Medical Services Plan (MSP) enrolmnent, Fair PharmaCare, and/or MSP Supplementary Benefits.</p>
        <p class="mt-0">Answering the following questions will help you determine which programs you are eligible for, and ensure you have the required documents and information to complete your application(s).</p>
        <hr class="mt-0"/>
        <h2>Medical Services Plan (MSP) Enrolment</h2>
        <Radio
          id='apply-msp'
          name='apply-msp'
          label='1. Will you use the Joint Health Application to apply for MSP coverage?'
          v-model='applyMSP'
          :items='radioOptionsApplyMSP' />
        <div v-if="applyMSP === 'Y'">
          <Radio
            id='live-in-bc'
            name='live-in-bc'
            label='2. Do you currently live in British Columbia? (i.e. Do you have an address here?)'
            v-model='eqMSPLiveInBC'
            :items='radioOptionsYesNo' />
          <p class="font-weight-bold" v-if="eqMSPLiveInBC === 'N'">You might not qualify for MSP or related income-based programs if you do not live in B.C. Contact Health Insurance BC for more information.</p>
          <div v-if="eqMSPLiveInBC === 'Y'">
            <Radio
              id='away-over-30'
              name='away-over-30'
              label='3. Will you or anyone in your immediate family (included on this application) be away from B.C. for more than 30 days in total over the next six months?'
              v-model='eqMSPAwayOver30'
              :items='radioOptionsYesNo' />
            <p class="font-weight-bold" v-if="eqMSPAwayOver30 === 'Y'">You or your family member might not qualify for MSP or related income-based programs if you leave the province for more than 30 days in total during the first six months after you apply - doing this could mean you are no longer considered a B.C. resident.  Find out more by contacting Health Insurance BC.</p>
            <div v-if="eqMSPAwayOver30 === 'N'">
              <Radio
                id='student-minor-refugee'
                name='student-minor-refugee'
                label='4. Is anyone included in this application (yourself, spouse, or child): a student returning to a home province outside B.C. at the end of a course or program; a minor (under the age of 16); or a person seeking refugee status who has not yet been approved?'
                v-model='eqMSPStudentMinorRefugee'
                :items='radioOptionsYesNo' />
              <div class="font-weight-bold" v-if="eqMSPStudentMinorRefugee === 'Y'">
                <p class="mb-0">You can submit an application with some assistance from one of out representatives - please contact Health Insurance BC:</p>
                <p class="mb-0">(604)683-7151 (Lower Mainland)</p>
                <p class="mb-0">1-800-663-7100 (Elsewhere in B.C.)</p>
              </div>
              <div v-if="eqMSPStudentMinorRefugee === 'N'">
                <p>When applying for MSP coverage, you are required to submit digital copies (pdf, jpeg, png) of the following documents for yourself and (if applicable) your spouse.  For more information see ID Requirements for Online MSP Enrolment - Province of British Columbia.</p>
                <div class="ml-5">
                  <p>Canadian Citizens: Canadian Birth Certificate, Canadian Passport, or Canadian Citizenship Card/Certificate</p>
                  <p>Permanent Residents: Record of Landing or Perrmanent Resident Card</p>
                  <p>Temporary Permit Holders: Work, Study, or Visitor Permit</p>
                  <p>Diplomats: Valid Passport with Entry Stamps and Acceptance Foils</p>
                  <p>Supporting Documents: Marriage Certificate and/or Legal Name Change Certificate</p>
                </div>
                <Radio 
                  id='has-documents'
                  name='has-documents'
                  label='5. Do you have copies of the above documents to include with your application?'
                  v-model='eqMSPHasDocuments'
                  :items='radioOptionsYesNo' />
                <p class="font-weight-bold" v-if="eqMSPHasDocuments === 'N'">Make sure you have digital copies of the above documents before completing your Joint Health Application. You will not be able to apply for MSP enrolment without these documents.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="text-danger"
                      v-if="$v.applyMSP.$dirty && !$v.applyMSP.validateQuestionsAnswered"
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
  SET_IS_APPLYING_FOR_MSP,
  SET_EQ_MSP_LIVE_IN_BC,
  SET_EQ_MSP_AWAY_OVER_30,
  SET_EQ_MSP_STUDENT_MINOR_REFUGEE,
  SET_EQ_MSP_HAS_DOCUMENTS,
  SET_MSG_CODE_MSP,
} from '@/store/modules/enrolment-module';
import pageStepperMixin from '@/mixins/page-stepper-mixin';

const validateQuestionsAnswered = (_value, vm) => {
        if(!vm.applyMSP
          || (vm.applyMSP === 'Y' && !vm.eqMSPLiveInBC)
          || (vm.applyMSP === 'Y' && vm.eqMSPLiveInBC === 'Y' && !vm.eqMSPAwayOver30)
          || (vm.applyMSP === 'Y' && vm.eqMSPLiveInBC === 'Y' && vm.eqMSPAwayOver30 === 'N' && !vm.eqMSPStudentMinorRefugee)
          || (vm.applyMSP === 'Y' && vm.eqMSPLiveInBC === 'Y' && vm.eqMSPAwayOver30 === 'N' && vm.eqMSPStudentMinorRefugee === 'N' && !vm.eqMSPHasDocuments)) {
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
      applyMSP: null,
      eqMSPLiveInBC: null,
      eqMSPAwayOver30: null,
      eqMSPStudentMinorRefugee: null,
      eqMSPHasDocuments: null,
      radioOptionsYesNo: radioOptionsYesNo,
      radioOptionsApplyMSP: null,
    };
  },
  created() {
    logService.logNavigation(
      this.applicationUuid,
      enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path,
      enrolmentRoutes.MSP_ELIGIBILITY_PAGE.title
    );
    const isApplyingForMSP = this.$store.state.enrolmentModule.isApplyingForMSP;
    if (isApplyingForMSP !== null) {
      isApplyingForMSP ? this.applyMSP = "Y" : this.applyMSP = "N";
    }
    this.eqMSPLiveInBC = this.$store.state.enrolmentModule.eqMSPLiveInBC;
    this.eqMSPAwayOver30 = this.$store.state.enrolmentModule.eqMSPAwayOver30;
    this.eqMSPStudentMinorRefugee = this.$store.state.enrolmentModule.eqMSPStudentMinorRefugee;
    this.eqMSPHasDocuments = this.$store.state.enrolmentModule.eqMSPHasDocuments;

    this.radioOptionsApplyMSP = [
      {
        id: 'yes',
        label: 'Yes',
        value: 'Y',
      },
      {
        id: 'no',
        label: 'No: I am already enrolled (continue to Fair PharmaCare). (You will be required to provide your MSP Personal Health Number.)',
        value: 'N',
      },
    ];

    this.$nextTick(() => {
      this.isPageLoaded = true;
    })
  },
  validations() {
    const validations = {
      applyMSP: {
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

      // Short circuit to form selection if they are ineligible for MSP but still attempting to apply
      if (this.msgCode === 0 || this.msgCode === 5) {
        this.navigateToNextPage();
      } else {
        this.navigateToFormSelectionPage();
      }
    },
    saveData() {
      this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_MSP, this.applyMSP === "Y");
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_MSP_LIVE_IN_BC, this.eqMSPLiveInBC);
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_MSP_AWAY_OVER_30, this.eqMSPAwayOver30);
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_MSP_STUDENT_MINOR_REFUGEE, this.eqMSPStudentMinorRefugee);
      this.$store.dispatch(enrolmentModule + '/' + SET_EQ_MSP_HAS_DOCUMENTS, this.eqMSPHasDocuments);
      this.$store.dispatch(enrolmentModule + '/' + SET_MSG_CODE_MSP, this.msgCode);
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    navigateToFormSelectionPage() {
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
      if (this.applyMSP === 'N') {
        // Not applying for MSP
        return 0;
      } else if (this.eqMSPLiveInBC === 'N') {
        // Ineligible
        return 1;
      } else if (this.eqMSPAwayOver30 === 'Y') {
        // Ineligible
        return 2;
      } else if (this.eqMSPStudentMinorRefugee === 'Y') {
        // Ineligible
        return 3;
      } else if (this.eqMSPHasDocuments === 'N') {
        // Ineligible
        return 4;
      } else {
        // Eligible for MSP
        return 5;
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
        enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path
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