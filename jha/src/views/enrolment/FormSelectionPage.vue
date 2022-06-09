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
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Select the programs you want to enrol </h1>
        <hr class="mt-0"/>
        <Checkbox label="MSP Enrolment"
          id="msp"
          :disabled="true"
          v-model="isApplyingForMSP">
          <template v-slot:description>
            <p v-if="msgCodeMSP === eqMsgCodesMSP.NotApplying" class="mt-2">Eligibility questionnaire not answered.</p>
            <p v-else-if="msgCodeMSP === eqMsgCodesMSP.NotLivingInBC" class="mt-2 text-danger">You might not qualify for MSP or related income_based programs if you do not live in BC. Contact Health Insurance BC for more information.</p>
            <p v-else-if="msgCodeMSP === eqMsgCodesMSP.AwayOver30" class="mt-2 text-danger">You or your family member might not qualify for MSP or related income-based programs if you leave the province for more than 30 days in total during the first six months after you apply - doing this could mean you are no longer considered a B.C. resident. Find out more by contacting Health Insurance BC.</p>
            <div v-else-if="msgCodeMSP === eqMsgCodesMSP.StudentMinorRefugee" class="mt-2 text-danger">
              <p>You can submit an application with some assistance from one of our representatives - please contact Health Insurance BC:</p>
              <p class="mt-1">(604) 683-7151 (Lower Mainland)</p>
              <p class="mt-1">1-800-663-7100 (Elsewhere in BC)</p>
            </div>
            <p v-else-if="msgCodeMSP === eqMsgCodesMSP.NotHaveDocuments" class="mt-2 text-danger">Make sure you have digital copies of the above documents before completing your British Columbia Application for Health Drug Coverage. You will not be able to apply for MSP enrolment without these documents.</p>
            <p v-else-if="msgCodeMSP === eqMsgCodesMSP.EligibleAndApplying" class="mt-2">In Canada, public health insurance is available to eligible residents. Canadian citizens and permanent residents can apply for provincial health insurance. The Medical Service Plan (MSP) covers the most for eligible British Columbia residents for medically-necessary insured doctor services.</p>
          </template>
        </Checkbox>
        <Checkbox label="Fair PharmaCare"
          id="fpc"
          :disabled="!isEligibleForFPCare"
          v-model="isApplyingForFPCare">
          <template v-slot:description>
            <p v-if="msgCodeFPC === eqMsgCodesFPC.NotApplying" class="mt-2">Eligibility questionnaire not answered.</p>
            <p v-else-if="msgCodeFPC === eqMsgCodesFPC.NotMeetsCriteria" class="mt-2 text-danger">You are not eligible to register for Fair PharmaCare at this time. Register after you have completed the required wait period and registered with the Medical Services Plan. If you (or your spouse) did not submit a tax return for the taxation year two years before the current year: file an income tax return with the Canada Revenue Agency for the required taxation year as soon as possible. When you have submitted your tax return(s), register your family for Fair PharmaCare. If you cannot file an income tax return for the relevant year because you are a new resident of Canada, contact Health Insurance BC.</p>
            <ul v-else-if="msgCodeFPC === eqMsgCodesFPC.NotHasInfo" class="mt-2 text-danger">
              <li>If you (or your spouse) do not have a Social Insurance Number: Contact Service Canada before submitting an application. If you are a new resident to Canada and do not qualify for a Social Insurance Number, contact Health Insurance BC.</li>
              <li>If you (or your spouse) did not submit a tax return for the taxation year two years before the current year: file an income tax return with the Canada Revenue Agency for the required taxation year as soon as possible. When you have submitted your tax return(s), register your family for Fair PharmaCare. If you cannot file an income tax return for the relevant year because you are a new resident of Canada, contact Health Insurance BC.</li>
            </ul>
            <p v-else-if="msgCodeFPC === eqMsgCodesFPC.EligibleAndApplying" class="mt-2">Fair PharmaCare helps B.C. families pay for eligible prescription drugs, dispending fees and some medical supplies. Fair PharmaCare is based on income: the less a family earns, the more help they get.</p>
          </template>
        </Checkbox>
        <Checkbox label="MSP Supplementary Benefits"
          id="sb"
          :disabled="!isEligibleForSuppBen"
          v-model="isApplyingForSuppBen">
          <template v-slot:description>
            <p v-if="msgCodeSB === eqMsgCodesSB.NotApplying" class="mt-2">Eligibility questionnaire not answered.</p>
            <p v-else-if="msgCodeSB === eqMsgCodesSB.NotMeetsCriteria" class="mt-2 text-danger">You are not eligible to apply for MSP supplementary benefits at this time. Please submit an application when you meet the residency requirements. For assistance, please contact Health Insurance BC. For more information on eligibility requirements, see <a target="_blank" href="https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/benefits/services-covered-by-msp/supplementary-benefits#apply-for-benefits">Applying for Supplementary Benefits.</a></p>
            <ul v-else-if="msgCodeSB === eqMsgCodesSB.NotHasInfo" class="mt-2 text-danger">
              <li>If you (or your spouse) do not have a Social Insurance Number: Contact Service Canada before submitting an application. If you are a new resident to Canada and do not qualify for a Social Insurance Number, contact Health Insurance BC.</li>
              <li>If you (or your spouse) did not submit a tax return for a valid taxation year: file an income tax return with the Canada Revenue Agency for the required year as soon as possible. When you have received an NOA/NORA, apply for supplementary benefits. If you cannot file an income tax return for the relevant year because you are a new resident of Canada, contact Health Insurance BC.</li>
            </ul>
            <p v-else-if="msgCodeSB === eqMsgCodesSB.EligibleAndApplying" class="mt-2">Medical Services Plan (MSP) supplementary benefits provide partial payment for certain medical services obtained in British Columbia and may provide access to other income-based programs.</p>
          </template>
        </Checkbox>
        <div class="text-danger mt-3"
          v-if="v$.$dirty && v$.atLeastOne.$invalid"
          aria-live="assertive">You must select at least one program.</div>
      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
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
  MODULE_NAME as enrolmentModule,
  SET_IS_APPLYING_FOR_MSP,
  SET_IS_APPLYING_FOR_FPCARE,
  SET_IS_APPLYING_FOR_SUPP_BEN,
  SET_MSP_UUID,
  SET_FPC_UUID,
  SET_SB_UUID,
} from '@/store/modules/enrolment-module';
import {
  Checkbox,
  PageContent,
  ContinueBar,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import { mapGetters } from 'vuex';
import pageStepperMixin from '@/mixins/page-stepper-mixin';
import { v4 as uuidv4 } from 'uuid';
import { 
  eqMsgCodesMSP,
  eqMsgCodesFPC,
  eqMsgCodesSB,
} from '@/constants/eqMsgCodes';

const atLeastOne = (vm) => {
  return vm.isApplyingForMSP
      || vm.isApplyingForFPCare
      || vm.isApplyingForSuppBen;
};

export default {
  name: 'FormSelectionPage',
  mixins: [
    pageContentMixin,
    pageStepperMixin,
  ],
  components: {
    Checkbox,
    ContinueBar,
    PageContent,
  },
  setup () {
    return { v$: useVuelidate() }
  },
  data: () => {
    return {
      isPageLoaded: false,
      isApplyingForMSP: false,
      isApplyingForFPCare: false,
      isApplyingForSuppBen: false,
      eqMsgCodesMSP: eqMsgCodesMSP,
      eqMsgCodesFPC: eqMsgCodesFPC,
      eqMsgCodesSB: eqMsgCodesSB,
      msgCodeMSP: eqMsgCodesMSP.NotApplying,
      msgCodeFPC: eqMsgCodesFPC.NotApplying,
      msgCodeSB: eqMsgCodesSB.NotApplying,
      applicationUuid: null,
    };
  },
  computed: mapGetters({
    isEligibleForMSP: `${enrolmentModule}/isEligibleForMSP`,
    isEligibleForFPCare: `${enrolmentModule}/isEligibleForFPCare`,
    isEligibleForSuppBen: `${enrolmentModule}/isEligibleForSuppBen`,
  }),
  created() {
    this.applicationUuid = this.$store.state.enrolmentModule.applicationUuid;
    this.isApplyingForMSP = this.$store.state.enrolmentModule.isApplyingForMSP;
    this.isApplyingForFPCare = this.$store.state.enrolmentModule.isApplyingForFPCare;
    this.isApplyingForSuppBen = this.$store.state.enrolmentModule.isApplyingForSuppBen;
    this.msgCodeMSP = this.$store.state.enrolmentModule.msgCodeMSP;
    this.msgCodeFPC = this.$store.state.enrolmentModule.msgCodeFPC;
    this.msgCodeSB = this.$store.state.enrolmentModule.msgCodeSB;

    if (!this.isEligibleForMSP) {
      this.isApplyingForMSP = false;
      this.$store.dispatch(`${enrolmentModule}/${SET_IS_APPLYING_FOR_MSP}`, false);
    }
    
    if (!this.isEligibleForFPCare) {
      this.isApplyingForFPCare = false;
      this.$store.dispatch(`${enrolmentModule}/${SET_IS_APPLYING_FOR_FPCARE}`, false);
    }
    
    if (!this.isEligibleForSuppBen) {
      this.isApplyingForSuppBen = false;
      this.$store.dispatch(`${enrolmentModule}/${SET_IS_APPLYING_FOR_SUPP_BEN}`, false);
    }

    logService.logNavigation(
      this.applicationUuid,
      enrolmentRoutes.FORM_SELECTION_PAGE.path,
      enrolmentRoutes.FORM_SELECTION_PAGE.title
    );

    this.$nextTick(() => {
      this.isPageLoaded = true;
    })
  },
  validations() {
    const validations = {
      atLeastOne,
    };
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
      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(`${enrolmentModule}/${SET_IS_APPLYING_FOR_MSP}`, this.isApplyingForMSP);
      this.$store.dispatch(`${enrolmentModule}/${SET_IS_APPLYING_FOR_FPCARE}`, this.isApplyingForFPCare);
      this.$store.dispatch(`${enrolmentModule}/${SET_IS_APPLYING_FOR_SUPP_BEN}`, this.isApplyingForSuppBen);
      this.$store.dispatch(`${enrolmentModule}/${SET_MSP_UUID}`, uuidv4());
      this.$store.dispatch(`${enrolmentModule}/${SET_FPC_UUID}`, uuidv4());
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_UUID}`, uuidv4());
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.PERSONAL_INFO_PAGE.path
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
        this.$router.currentRoute.value.path,
        enrolmentRoutes.FORM_SELECTION_PAGE.path
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
