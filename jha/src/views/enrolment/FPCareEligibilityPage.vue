<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Eligibility Questionnaire</h1>
        <p class="mb-0">You can use the Joint Health Application to apply for Medical Services Plan (MSP) enrolmnent, Fair PharmaCare, and/or MSP Supplementary Benefits.</p>
        <p class="mt-0">Answering the following questions will help you determine which programs you are eligible for, and ensure you have the required documents and information to complete your application(s).</p>
        <hr class="mt-0"/>
        <h2>Fair PharmaCare Enrolment</h2>
        <Radio
          id='apply-fpc'
          name='apply-fpc'
          label='1. Will you use the Joint Health Application to register for Fair PharmaCare?'
          v-model='applyFPC'
          :items='radioOptionsApplyFPC' />
        <div v-if="applyFPC === 'Y'">
          <p class="mb-0">2. To register for Fair PharmaCare, you must:</p>
          <div class="ml-5">
            <p class="mb-0">1. have been a resident of British Columbia for at least three months;</p>
            <p class="mb-0">2. be registered with the Medical Services Plan(MSP); and</p>
            <p>3. have filed an income tax return with the Canada Revenue Agency(CRA) for the relevant taxation year(two years before the current year).</p>
          </div>
          <Radio
            id='meets-fpc-criteria'
            name='meets-fpc-criteria'
            label='Do you meet the above eligibility criteria?'
            v-model='meetsFPCCriteria'
            :items='radioOptionsNoYes' />
          <p class="font-weight-bold" v-if="meetsFPCCriteria === 'N'">You are not eligible to register for Fair PharmaCare at this time. Register after you have completed the required wait period and registered with the Medical Services Plan.  If you (or your spouse) did not submit a tax return for the taxation year two years before the current year: file an income tax return with the Canada Revenue Agency for the required taxation yar as soon as possible.  When you have submitted your tax return(s), register your family for Fair PharmaCare.  If you cannot file an income tax return for the relevant year because you are a new resident of canada, contact Health Insurance BC.</p>
          <div v-if="meetsFPCCriteria === 'Y'">
            <p class="mb-0">3. To register for Fair PharmaCare, you must include the following with your application:</p>
            <div class="ml-5">
              <p class="mb-0">1. Social Insurance Number(SIN) for you and (if applicable) your spouse;</p>
              <p class="mb-0">2. Net Income shown on Line 23600 of your and if applicable, your spouse's CRA Notice of Assessment or federal income tax return for the relevant taxation year (two years before the current year); and</p>
              <p>3. if you recieved income form a Registered Disability Savings Plan(RDSP), income shown on Line 12500 of your and if applicable, your spouse's CRA Notice of Assessment or federal income tax return for the relevant taxation year (two years before the current year). If you did not recieve RDSP income, you will enter $0.</p>
            </div>
            <Radio
              id='has-fpc-info'
              name='has-fpc-info'
              label='Do you have the above information to include with your application?'
              v-model='hasFPCInfo'
              :items='radioOptionsNoYes' />
            <ul class="font-weight-bold pl-4" v-if="hasFPCInfo === 'N'">
              <li>If you (or your spouse) do not have a Social Insurance Number: Contact Service Canada before submitting an application. If you are a new Resident to Canada and do not qualify for a Social Insurance Number, contact Health Insurance BC.</li>
              <li>If you (or your spouse) did not submit a tax return for the taxation year two years before the current year: file an income tax return with the Canada Revenue Agency for the required taxation year as soon as possible. When you have submitted your tax return(s), register your family for Fari PharmaCare.  If you cannot file an income tax return for the relevant year because you are a new resident of Canada, contact Health Insurance BC.</li>
            </ul>
          </div>
        </div>
        <div class="text-danger"
                      v-if="$v.applyFPC.$dirty && !$v.applyFPC.validateQuestionsAnswered"
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
  SET_IS_APPLYING_FOR_FPCARE,
  SET_MEETS_FPC_CRITERIA,
  SET_HAS_FPC_INFO,
} from '@/store/modules/enrolment-module';

const validateQuestionsAnswered = (_value, vm) => {
        if(!vm.applyFPC
          || (vm.applyFPC === 'Y' && !vm.meetsFPCCriteria)
          || (vm.applyFPC === 'Y' && vm.meetsFPCCriteria === 'Y' && !vm.hasFPCInfo)) {
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
      applyFPC: null,
      meetsFPCCriteria: null,
      hasFPCInfo: null,
      radioOptionsNoYes: radioOptionsNoYes,
      radioOptionsApplyFPC: null,
    };
  },
  created() {
    logService.logNavigation(
      this.applicationUuid,
      enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.path,
      enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.title
    );
    const isApplyingForFPCare = this.$store.state.enrolmentModule.isApplyingForFPCare;
    if (isApplyingForFPCare !== null) {
      isApplyingForFPCare ? this.applyFPC = "Y" : this.applyFPC = "N";
    }
    this.meetsFPCCriteria = this.$store.state.enrolmentModule.meetsFPCCriteria;
    this.hasFPCInfo = this.$store.state.enrolmentModule.hasFPCInfo;
    this.studentMinorRefugee = this.$store.state.enrolmentModule.studentMinorRefugee;
    this.hasDocuments = this.$store.state.enrolmentModule.hasDocuments;

    this.radioOptionsApplyFPC = [
      {
        id: 'no',
        label: 'No: (continue to MSP Supplementary Benefits).',
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
      this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_FPCARE, this.applyFPC === "Y");
      this.$store.dispatch(enrolmentModule + '/' + SET_MEETS_FPC_CRITERIA, this.meetsFPCCriteria);
      this.$store.dispatch(enrolmentModule + '/' + SET_HAS_FPC_INFO, this.hasFPCInfo);
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
