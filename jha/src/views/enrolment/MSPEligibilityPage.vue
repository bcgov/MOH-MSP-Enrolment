<template>
  <div>
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
          label='Will you use the Joint Health Application to apply for MSP coverage?'
          v-model='applyMSP'
          :items='radioOptionsApplyMSP' />
        <div v-if="applyMSP === 'Y'">
          <Radio
            id='live-in-bc'
            name='live-in-bc'
            label='Do you currently live in British Columbia? (i.e. Do you have an address here?)'
            v-model='liveInBC'
            :items='radioOptionsNoYes' />
          <p class="font-weight-bold" v-if="liveInBC === 'N'">You might not qualify for MSP or related income-based programs if you do not live in B.C. Contact Health Insurance BC for more information.</p>
          <div v-if="liveInBC === 'Y'">
            <Radio
              id='away-over-30'
              name='away-over-30'
              label='Will you or anyone in your immediate family (included on this application) be away from B.C. for more than 30 days in total over the next six months?'
              v-model='awayOver30'
              :items='radioOptionsNoYes' />
            <p class="font-weight-bold" v-if="awayOver30 === 'Y'">You or your family member might not qualify for MSP or related income-based programs if you leave the province for more than 30 days in total during the first six months after you apply - doing this could mean you are no longer considered a B.C. resident.  Find out more by contacting Health Insurance BC.</p>
            <div v-if="awayOver30 === 'N'">
              <Radio
                id='student-minor-refugee'
                name='student-minor-refugee'
                label='Is anyone included in this application (yourself, spouse, or child): a student returning to a home province outside B.C. at the end of a course or program; a minor (under the age of 16); or a person seeking refugee status who has not yet been approved?'
                v-model='studentMinorRefugee'
                :items='radioOptionsNoYes' />
              <div class="font-weight-bold" v-if="studentMinorRefugee === 'Y'">
                <p class="mb-0">You can submit an application with some assistance from one of out representatives - please contact Health Insurance BC:</p>
                <p class="mb-0">(604)683-7151 (Lower Mainland)</p>
                <p class="mb-0">1-800-663-7100 (Elsewhere in B.C.)</p>
              </div>
              <div v-if="studentMinorRefugee === 'N'">
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
                  label='Do you have copies of the above documents to include with your application?'
                  v-model='hasDocuments'
                  :items='radioOptionsNoYes' />
                <p class="font-weight-bold" v-if="hasDocuments === 'N'">Make sure you have digital copies of the above documents before completing your Joint Health Application. You will not be able to apply for MSP enrolment without these documents.</p>
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
  radioOptionsNoYes,
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
  SET_LIVE_IN_BC,
  SET_AWAY_OVER_30,
  SET_STUDENT_MINOR_REFUGEE,
  SET_HAS_DOCUMENTS,
} from '@/store/modules/enrolment-module';

const validateQuestionsAnswered = (_value, vm) => {
        if(!vm.applyMSP
          || (vm.applyMSP === 'Y' && !vm.liveInBC)
          || (vm.applyMSP === 'Y' && vm.liveInBC === 'Y' && !vm.awayOver30)
          || (vm.applyMSP === 'Y' && vm.liveInBC === 'Y' && vm.awayOver30 === 'N' && !vm.studentMinorRefugee)
          || (vm.applyMSP === 'Y' && vm.liveInBC === 'Y' && vm.awayOver30 === 'N' && vm.studentMinorRefugee === 'N' && !vm.hasDocuments)) {
        return false;
      }
      return true;
}

export default {
  name: 'MSPEligibilityPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    PageContent,
    Radio,
  },
  data: () => {
    return {
      isPageLoaded: false,
      applyMSP: null,
      liveInBC: null,
      awayOver30: null,
      studentMinorRefugee: null,
      hasDocuments: null,
      radioOptionsNoYes: radioOptionsNoYes,
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
    this.liveInBC = this.$store.state.enrolmentModule.liveInBC;
    this.awayOver30 = this.$store.state.enrolmentModule.awayOver30;
    this.studentMinorRefugee = this.$store.state.enrolmentModule.studentMinorRefugee;
    this.hasDocuments = this.$store.state.enrolmentModule.hasDocuments;

    this.radioOptionsApplyMSP = [
      {
        id: 'no',
        label: 'No: I am already enrolled(continue to Fair PharmaCare). (you will be Required to provide your MSP Personal Health Number.)',
        value: 'N',
      },
      {
        id: 'yes',
        label: 'Yes',
        value: 'Y',
      }
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
      this.saveData();
      this.$v.$touch()
      if (this.$v.$invalid) {
        scrollToError();
        return;
      }
      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_MSP, this.applyMSP === "Y");
      this.$store.dispatch(enrolmentModule + '/' + SET_LIVE_IN_BC, this.liveInBC);
      this.$store.dispatch(enrolmentModule + '/' + SET_AWAY_OVER_30, this.awayOver30);
      this.$store.dispatch(enrolmentModule + '/' + SET_STUDENT_MINOR_REFUGEE, this.studentMinorRefugee);
      this.$store.dispatch(enrolmentModule + '/' + SET_HAS_DOCUMENTS, this.hasDocuments);
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
