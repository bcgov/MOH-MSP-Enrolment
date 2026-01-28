<template>
  <div>
    <div class="container stepper">
      <PageStepper
        :currentPath="$router.currentRoute.value.path"
        :routes="stepRoutes"
        @toggleShowMobileDetails="handleToggleShowMobileStepperDetails($event)"
        :isMobileStepperOpen="isMobileStepperOpen"
        @onClickLink="handleClickStepperLink($event)"
      />
    </div>
    <PageContent :deltaHeight="pageContentDeltaHeight">
      <main class="container pt-3 pt-sm-5 mb-3">
        <p>
          Answer the following questions to see which programs you are eligible
          for and make sure you have what you need to apply.
        </p>
        <h1>Medical Services Plan (MSP) Enrolment Eligibility</h1>
        <p>
          MSP pays for medically required services of physicians and surgeons,
          and dental or oral surgery performed in a hospital. If you are a B.C.
          resident, you must by law enrol in MSP, and enrol your spouse and
          child(ren) who are B.C. residents. You must physically be in B.C. to
          enrol in MSP. If you are already enrolled in MSP, you can update your
          account at
          <a
            href="https://www2.gov.bc.ca/managingyourmspaccount"
            target="_blank"
          >
            gov.bc.ca/managingyourmspaccount.
          </a>
        </p>
        <p>
          Note: Submit <b>only one application</b> for an Account Holder and, if
          needed, spouse and/or children. Do not submit multiple applications.
        </p>
        <RadioComponent
          id="apply-msp"
          name="apply-msp"
          label="1. Will you use this form to apply for MSP?"
          v-model="eqMSPIsApplying"
          cypressId="apply-msp-"
          :required="true"
          :items="radioOptionsApplyMSP"
        />
        <div v-if="eqMSPIsApplying === 'Y'">
          <RadioComponent
            id="live-in-bc"
            name="live-in-bc"
            label="2. Do you currently live in B.C. and have a B.C. address where you can receive mail?"
            v-model="eqMSPLiveInBC"
            cypressId="live-in-bc-"
            :required="true"
            :items="radioOptionsYesNo"
          />
          <div class="text-danger ml-4" v-if="eqMSPLiveInBC === 'N'">
            <p>
              If you do not live in B.C., you may not be eligible for MSP or
              related income-based programs. For more information, contact
              Health Insurance BC at:
            </p>
            <ContactInformation />
          </div>
          <div v-if="eqMSPLiveInBC === 'Y'">
            <RadioComponent
              id="away-over-30"
              name="away-over-30"
              label="3. Will anyone included in this application be away from B.C. for more than 30 days in total during the next six months?"
              v-model="eqMSPAwayOver30"
              cypressId="away-over-30-"
              :required="true"
              :items="radioOptionsYesNo"
            />
            <div class="text-danger ml-4" v-if="eqMSPAwayOver30 === 'Y'">
              <p>
                If you leave B.C. for more than 30 days in total during the
                first six months after applying for MSP, you may not be
                considered a B.C. resident. You or a family member may not be
                eligible for MSP coverage or related income-based programs. For
                more information, contact Health Insurance BC at:
              </p>
              <ContactInformation />
            </div>
            <div v-if="eqMSPAwayOver30 === 'N'">
              <RadioComponent
                id="student-minor-refugee"
                name="student-minor-refugee"
                label="4. Is anyone included in this application: a student returning to a province outside B.C. at the end of a course or program; an unaccompanied minor; or a person seeking refugee status?"
                v-model="eqMSPStudentMinorRefugee"
                cypressId="student-minor-refugee-"
                :required="true"
                :items="radioOptionsYesNo"
              />
              <div
                class="text-danger ml-4"
                v-if="eqMSPStudentMinorRefugee === 'Y'"
              >
                <p>
                  You can apply for MSP with some assistance from Health
                  Insurance BC. Contact Health Insurance BC at:
                </p>
                <ContactInformation />
              </div>
              <div v-if="eqMSPStudentMinorRefugee === 'N'">
                <p>
                  5. To apply for MSP, you must upload a digital copy of one the
                  documents below for each person included in this application.
                  The document must show full legal name and legal status in
                  Canada.
                </p>
                <IdTable />
                <RadioComponent
                  id="has-documents"
                  name="has-documents"
                  label="Do you have digital copies of the documents for each person included in this application?"
                  v-model="eqMSPHasDocuments"
                  cypressId="has-documents-"
                  :required="true"
                  :items="radioOptionsYesNo"
                />
                <p class="text-danger ml-4" v-if="eqMSPHasDocuments === 'N'">
                  You must have digital copies of the documents to apply for MSP
                  using this form. If you are not able to make digital copies,
                  you can apply with print copies using the printable form (HLTH
                  101) available at
                  <a target="_blank" href="https://gov.bc.ca/AHDC">
                    gov.bc.ca/AHDC
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-danger"
          v-if="
            v$.eqMSPIsApplying.$dirty &&
            v$.eqMSPIsApplying.validateQuestionsAnswered.$invalid
          "
          aria-live="assertive"
        >
          Please complete the questionnaire to continue.
        </div>
      </main>
    </PageContent>
    <ContinueBar @continue="validateFields()" cypressId="continue" />
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import pageStateService from "@/services/page-state-service";
import logService from "@/services/log-service";
import { enrolmentRoutes, isPastPath } from "@/router/routes";
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition,
} from "@/helpers/scroll";
import { getConvertedPath } from "@/helpers/url";
import { radioOptionsYesNo } from "@/constants/radio-options";
import { PageContent, ContinueBar, RadioComponent } from "common-lib-vue";
import pageContentMixin from "@/mixins/page-content-mixin";
import {
  MODULE_NAME as enrolmentModule,
  SET_IS_APPLYING_FOR_MSP,
  SET_EQ_MSP_IS_APPLYING,
  SET_EQ_MSP_LIVE_IN_BC,
  SET_EQ_MSP_AWAY_OVER_30,
  SET_EQ_MSP_STUDENT_MINOR_REFUGEE,
  SET_EQ_MSP_HAS_DOCUMENTS,
  SET_MSG_CODE_MSP,
} from "@/store/modules/enrolment-module";
import IdTable from "@/components/IdTable.vue";
import pageStepperMixin from "@/mixins/page-stepper-mixin";
import { eqMsgCodesMSP } from "@/constants/eqMsgCodes";
import ContactInformation from "@/components/ContactInformation.vue";

const validateQuestionsAnswered = (_value, vm) => {
  if (
    !vm.eqMSPIsApplying ||
    (vm.eqMSPIsApplying === "Y" && !vm.eqMSPLiveInBC) ||
    (vm.eqMSPIsApplying === "Y" &&
      vm.eqMSPLiveInBC === "Y" &&
      !vm.eqMSPAwayOver30) ||
    (vm.eqMSPIsApplying === "Y" &&
      vm.eqMSPLiveInBC === "Y" &&
      vm.eqMSPAwayOver30 === "N" &&
      !vm.eqMSPStudentMinorRefugee) ||
    (vm.eqMSPIsApplying === "Y" &&
      vm.eqMSPLiveInBC === "Y" &&
      vm.eqMSPAwayOver30 === "N" &&
      vm.eqMSPStudentMinorRefugee === "N" &&
      !vm.eqMSPHasDocuments)
  ) {
    return false;
  }
  return true;
};

export default {
  name: "MSPEligibilityPage",
  setup() {
    return { v$: useVuelidate() };
  },
  mixins: [pageContentMixin, pageStepperMixin],
  components: {
    ContinueBar,
    PageContent,
    RadioComponent,
    IdTable,
    ContactInformation,
  },
  data: () => {
    return {
      isPageLoaded: false,
      eqMSPIsApplying: null,
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
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path,
      enrolmentRoutes.MSP_ELIGIBILITY_PAGE.title,
    );
    this.eqMSPIsApplying = this.$store.state.enrolmentModule.eqMSPIsApplying;
    this.eqMSPLiveInBC = this.$store.state.enrolmentModule.eqMSPLiveInBC;
    this.eqMSPAwayOver30 = this.$store.state.enrolmentModule.eqMSPAwayOver30;
    this.eqMSPStudentMinorRefugee =
      this.$store.state.enrolmentModule.eqMSPStudentMinorRefugee;
    this.eqMSPHasDocuments =
      this.$store.state.enrolmentModule.eqMSPHasDocuments;

    this.radioOptionsApplyMSP = [
      {
        id: "yes",
        label: "Yes",
        value: "Y",
      },
      {
        id: "no",
        label:
          "No, I am already enrolled. Continue to Fair PharmaCare. You will need to provide your Personal Health Number.",
        value: "N",
      },
    ];

    this.$nextTick(() => {
      this.isPageLoaded = true;
    });
  },
  validations() {
    const validations = {
      eqMSPIsApplying: {
        validateQuestionsAnswered,
      },
    };
    return validations;
  },
  methods: {
    validateFields() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        scrollToError();
        return;
      }
      this.saveData();

      // Short circuit to form selection if they are ineligible for MSP but still attempting to apply
      if (
        this.msgCode === eqMsgCodesMSP.NotApplying ||
        this.msgCode === eqMsgCodesMSP.EligibleAndApplying
      ) {
        this.navigateToNextPage();
      } else {
        this.navigateToFormSelectionPage();
      }
    },
    saveData() {
      this.$store.dispatch(
        enrolmentModule + "/" + SET_IS_APPLYING_FOR_MSP,
        this.eqMSPIsApplying === "Y",
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_EQ_MSP_IS_APPLYING,
        this.eqMSPIsApplying,
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_EQ_MSP_LIVE_IN_BC,
        this.eqMSPLiveInBC,
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_EQ_MSP_AWAY_OVER_30,
        this.eqMSPAwayOver30,
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_EQ_MSP_STUDENT_MINOR_REFUGEE,
        this.eqMSPStudentMinorRefugee,
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_EQ_MSP_HAS_DOCUMENTS,
        this.eqMSPHasDocuments,
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_MSG_CODE_MSP,
        this.msgCode,
      );
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.path,
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    navigateToFormSelectionPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.FORM_SELECTION_PAGE.path,
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
  },
  computed: {
    msgCode() {
      if (this.eqMSPIsApplying === "N") {
        // Not applying for MSP
        return eqMsgCodesMSP.NotApplying;
      } else if (this.eqMSPLiveInBC === "N") {
        // Ineligible
        return eqMsgCodesMSP.NotLivingInBC;
      } else if (this.eqMSPAwayOver30 === "Y") {
        // Ineligible
        return eqMsgCodesMSP.AwayOver30;
      } else if (this.eqMSPStudentMinorRefugee === "Y") {
        // Ineligible
        return eqMsgCodesMSP.StudentMinorRefugee;
      } else if (this.eqMSPHasDocuments === "N") {
        // Ineligible
        return eqMsgCodesMSP.NotHaveDocuments;
      } else {
        // Eligible for MSP
        return eqMsgCodesMSP.EligibleAndApplying;
      }
    },
  },
  watch: {
    eqMSPIsApplying() {
      if (this.isPageLoaded) {
        this.eqMSPLiveInBC = null;
      }
    },
    eqMSPLiveInBC() {
      if (this.isPageLoaded) {
        this.eqMSPAwayOver30 = null;
      }
    },
    eqMSPAwayOver30() {
      if (this.isPageLoaded) {
        this.eqMSPStudentMinorRefugee = null;
      }
    },
    eqMSPStudentMinorRefugee() {
      if (this.isPageLoaded) {
        this.eqMSPHasDocuments = null;
      }
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (
      pageStateService.isPageComplete(to.path) ||
      isPastPath(to.path, from.path)
    ) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path,
      );
      next({
        path: toPath,
        replace: true,
      });
      setTimeout(() => {
        scrollTo(topScrollPosition);
      }, 0);
    }
  },
};
</script>

<style>
.md-radio {
  margin-left: 24px !important;
}
</style>
