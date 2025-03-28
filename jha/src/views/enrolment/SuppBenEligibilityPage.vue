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
        <h1>Supplementary Benefits eligibility</h1>
        <RadioComponent
          id="apply-sb"
          name="apply-sb"
          label="1. Will you use this form to apply for Supplementary Benefits?"
          cypressId="apply-sb-"
          v-model="eqSBIsApplying"
          :required="true"
          :items="radioOptionsYesNo"
        >
          <template v-slot:description>
            <span class="field-description">
              Note: If you or your spouse (who may not live in B.C. or Canada)
              earned income outside Canada during the most recent tax year, you
              must submit your application for Supplementary Benefits using the
              print form (HLTH 101) available
              <a target="_blank" href="https://gov.bc.ca/ahdc">here</a>.
            </span>
          </template>
        </RadioComponent>
        <div v-if="eqSBIsApplying === 'Y'">
          <p class="mb-0">2. To apply for Supplementary Benefits, you must:</p>
          <div class="ml-4">
            <p class="mb-0 ml-4 ms-5">
              a. be a resident of B.C. as defined by the
              <em>Medicare Protection Act</em>;
            </p>
            <p class="mb-0 ml-4 ms-5">
              b. have resided in Canada as a Canadian citizen or holder of
              permanent resident status (landed immigrant) for at least the last
              12 months immediately preceding this application;
            </p>
            <p class="ml-4 ms-5">
              c. not be exempt from liability to pay income tax by reason of any
              other Act.
            </p>
          </div>
          <p id="eqSBMeetsCriteria" class="ml-4 mb-0">
            Do you meet the above eligibility criteria?
          </p>
          <RadioComponent
            id="meets-sb-criteria"
            name="meets-sb-criteria"
            label=""
            cypressId="meets-sb-criteria-"
            aria-labelledby="eqSBMeetsCriteria"
            v-model="eqSBMeetsCriteria"
            :required="true"
            :items="radioOptionsYesNo"
          />
          <div class="text-danger ml-4" v-if="eqSBMeetsCriteria === 'N'">
            <p>
              You are not eligible to apply for Supplementary Benefits at this
              time. If you have not lived in Canada for at least the last 12
              months, apply after you have met the residency requirements. For
              more information about eligibility, see
              <a
                target="_blank"
                href="https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/benefits/services-covered-by-msp/supplementary-benefits#apply-for-benefits"
                >
                Applying for Supplementary Benefits.
              </a>
              For assistance, contact Health Insurance BC at:
            </p>
            <ContactInformation />
          </div>
          <div v-if="eqSBMeetsCriteria === 'Y'">
            <p class="mb-0">
              3. To apply for Supplementary Benefits, you must include the
              following with your application:
            </p>
            <div class="ml-4">
              <p class="mb-0 ml-4 ms-5">
                a. Social Insurance Number (SIN) for you and (if applicable)
                your spouse;
              </p>
              <p class="mb-0 ml-4 ms-5">
                b. a digital copy (pdf, jpg, png) of your and if applicable,
                your spouse's CRA Notice of Assessment (NOA) or Notice of
                Reassessment (NORA) for the most recent tax year; and
              </p>
              <p class="ml-4 ms-5">
                c. Net Income (Line 23600) and Registered Disability Savings
                Plan (RDSP) income (Line 12500) if applicable, from the above
                CRA NOA or NORA.
              </p>
            </div>
            <p id="eqSBHasInfo" class="ml-4 mb-0">
              Do you have these documents and information to include with your
              application?
            </p>
            <RadioComponent
              id="has-sb-info"
              name="has-sb-info"
              label=""
              cypressId="has-sb-info-"
              aria-labelledby="eqSBHasInfo"
              v-model="eqSBhasInfo"
              :required="true"
              :items="radioOptionsYesNo"
            />
            <div class="text-danger pl-4 ml-4" v-if="eqSBhasInfo === 'N'">
              <p>
                You must have the above documents and information to apply for
                Supplementary Benefits.
              </p>
              <ul>
                <li>
                  If you and/or your spouse, if applicable, do not have a SIN,
                  contact Service Canada before you apply. If you are a new
                  resident to Canada and do not qualify for a SIN, contact
                  Health Insurance BC at:
                  <ContactInformation />
                </li>
                <li>
                  If you and/or your spouse, if applicable, did not file taxes
                  with the CRA, do so as soon as possible. When you have
                  received your NOA(s), apply for Supplementary Benefits. If you
                  and/or your spouse, if applicable, were not able to file taxes
                  with the CRA (because you did not live in Canada, were a
                  minor, or were otherwise exempt from filing taxes), contact
                  Health Insurance BC at:
                  <ContactInformation />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          class="text-danger"
          v-if="
            v$.eqSBIsApplying.$dirty &&
            v$.eqSBIsApplying.validateQuestionsAnswered.$invalid
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
  SET_IS_APPLYING_FOR_SUPP_BEN,
  SET_EQ_SB_IS_APPLYING,
  SET_EQ_SB_MEETS_CRITERIA,
  SET_EQ_SB_HAS_INFO,
  SET_MSG_CODE_SB,
} from "@/store/modules/enrolment-module";
import pageStepperMixin from "@/mixins/page-stepper-mixin";
import { eqMsgCodesSB } from "@/constants/eqMsgCodes";
import ContactInformation from "@/components/ContactInformation.vue";

const validateQuestionsAnswered = (_value, vm) => {
  if (
    !vm.eqSBIsApplying ||
    (vm.eqSBIsApplying === "Y" && !vm.eqSBMeetsCriteria) ||
    (vm.eqSBIsApplying === "Y" &&
      vm.eqSBMeetsCriteria === "Y" &&
      !vm.eqSBhasInfo)
  ) {
    return false;
  }
  return true;
};

export default {
  name: "MSPEligibilityPage",
  mixins: [pageContentMixin, pageStepperMixin],
  components: {
    ContinueBar,
    PageContent,
    RadioComponent,
    ContactInformation,
  },
  setup() {
    return { v$: useVuelidate() };
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
      enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.title,
    );
    this.eqSBIsApplying = this.$store.state.enrolmentModule.eqSBIsApplying;
    this.eqSBMeetsCriteria =
      this.$store.state.enrolmentModule.eqSBMeetsCriteria;
    this.eqSBhasInfo = this.$store.state.enrolmentModule.eqSBhasInfo;

    this.$nextTick(() => {
      this.isPageLoaded = true;
    });
  },
  validations() {
    const validations = {
      eqSBIsApplying: {
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
      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(
        enrolmentModule + "/" + SET_IS_APPLYING_FOR_SUPP_BEN,
        this.eqSBIsApplying === "Y",
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_EQ_SB_IS_APPLYING,
        this.eqSBIsApplying,
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_EQ_SB_MEETS_CRITERIA,
        this.eqSBMeetsCriteria,
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_EQ_SB_HAS_INFO,
        this.eqSBhasInfo,
      );
      this.$store.dispatch(
        enrolmentModule + "/" + SET_MSG_CODE_SB,
        this.msgCode,
      );
    },
    navigateToNextPage() {
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
      if (this.eqSBIsApplying === "N") {
        // Not applying for SB
        return eqMsgCodesSB.NotApplying;
      } else if (this.eqSBMeetsCriteria === "N") {
        // Ineligible
        return eqMsgCodesSB.NotMeetsCriteria;
      } else if (this.eqSBhasInfo === "N") {
        // Ineligible
        return eqMsgCodesSB.NotHasInfo;
      } else {
        // Eligible for SB
        return eqMsgCodesSB.EligibleAndApplying;
      }
    },
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
        enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path,
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
