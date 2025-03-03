<template>
  <div>
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-3">
        <div class="row align-items-end mt-3">
          <div class="col-9">
            <h1 class="mb-0">Confirmation of submission</h1>
          </div>
          <div class="col-3 text-right">
            <a href="javascript:void(0)" class="print-btn" @click="printPage()">
              Print or save as PDF
              <font-awesome-icon icon="print" />
            </a>
            <div class="tip-container">
              <font-awesome-icon class="ml-2" icon="info-circle" />
              <div class="tip">
                To save as a PDF, in the print window, select “Save as PDF”
              </div>
            </div>
          </div>
        </div>
        <hr />

        <p>
          <b>Date submitted: {{ submissionDate }}</b>
        </p>

        <!-- For all submissions with MSP -->
        <div v-if="mspApplicationResult" class="mb-4">
          <SuccessBox v-if="mspApplicationResult.returnCode === '0'">
            <p>
              <b>
                Your {{ formattedSuccessfulSubmissionPrograms }} form{{
                  successfulSubmissionPrograms.length > 1 ? "s" : ""
                }}
                {{ successfulSubmissionPrograms.length > 1 ? "have" : "has" }}
                been submitted.</b>
            </p>
            <p v-if="mspApplicationResult.referenceNumber">
              <b>Reference number is:
                {{ mspApplicationResult.referenceNumber }}
              </b>
            </p>
          </SuccessBox>
          <ErrorBox v-else>
            <p>
              <b>
                There was an issue with your Medical Services Plan submission.
                Your form was not submitted.</b>
            </p>
            <p v-if="mspApplicationResult.message">
              <b>{{ mspApplicationResult.message }}</b>
            </p>
          </ErrorBox>
          <ErrorBox
            v-if="
              fpcApplicationResult && fpcApplicationResult.returnCode !== '0'
            "
          >
            <p>
              <b>
                There was an issue with your Fair PharmaCare submission. Your
                form was not submitted.
              </b>
            </p>
            <p v-if="fpcApplicationResult.message">
              <b>{{ fpcApplicationResult.message }}</b>
            </p>
          </ErrorBox>
          <ErrorBox
            v-if="sbApplicationResult && sbApplicationResult.returnCode !== '0'"
          >
            <p>
              <b>
                There was an issue with your Supplementary Benefits submission.
                Your form was not submitted.
              </b>
            </p>
            <p v-if="sbApplicationResult.message">
              <b>{{ sbApplicationResult.message }}</b>
            </p>
          </ErrorBox>
        </div>

        <!-- For submissions without MSP -->
        <div v-else>
          <div v-if="fpcApplicationResult" class="mb-4">
            <div v-if="fpcApplicationResult.returnCode === '0'">
              <SuccessBox>
                <p><b>Your Fair PharmaCare form has been submitted.</b></p>
                <p v-if="fpcApplicationResult.familyNumber">
                  <b>
                    Reference number is:
                    {{ fpcApplicationResult.familyNumber }}
                  </b>
                </p>
              </SuccessBox>
            </div>
            <ErrorBox v-else>
              <p>
                <b>
                  There was an issue with your Fair PharmaCare submission. Your
                  form was not submitted.
                </b>
              </p>
              <p v-if="fpcApplicationResult.message">
                <b v-html="fpcApplicationResult.message" />
              </p>
            </ErrorBox>
          </div>

          <div v-if="sbApplicationResult" class="mb-4">
            <SuccessBox v-if="sbApplicationResult.returnCode === '0'">
              <p><b>Your Supplementary Benefits form has been submitted.</b></p>
              <p v-if="sbApplicationResult.referenceNumber">
                <b>
                  Reference number is:
                  {{ sbApplicationResult.referenceNumber }}
                </b>
              </p>
            </SuccessBox>
            <ErrorBox v-else>
              <p>
                <b>
                  There was an issue with your Supplementary Benefits
                  submission. Your form was not submitted.
                </b>
              </p>
              <p v-if="sbApplicationResult.message">
                <b>{{ sbApplicationResult.message }}</b>
              </p>
            </ErrorBox>
          </div>
        </div>

        <div v-if="hasAnySuccessfulForms">
          <h3 class="mt-4">Next steps</h3>
          <hr />
          <p>
            <a 
              href="javascript:void(0)" @click="printPage()" class="print-link"
            >
            Print or save
            </a>
            this page for your records.
          </p>

          <p class="m-0">Remember:</p>
          <ul>
            <li>
              B.C. residents must fulfill their MSP obligations under the
              <em>Medicare Protection Act.</em>
            </li>
            <li>
              Update your MSP account if your address or family structure
              changes.
            </li>
          </ul>

          <div
            v-if="
              mspApplicationResult && mspApplicationResult.returnCode === '0'
            "
            class="msp-success-message"
          >
            <p class="m-0">
              <strong>Medical Services Plan (MSP) enrolment:</strong>
            </p>
            <ul>
              <li>
                Your application will be processed within 21 business
                days.&nbsp;
              </li>
              <li>
                After your application is processed, HIBC will mail you a letter
                confirming your MSP enrolment status. You may have a
                <a
                  href="http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/eligibility-and-enrolment/how-to-enrol/coverage-wait-period"
                  target="_blank"
                  >
                wait period
                </a>
                .&nbsp;
              </li>
              <li>
                Living outside B.C. for more than six months could cause your
                MSP coverage to be cancelled.
                <a
                  href="http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/eligibility-and-enrolment/are-you-eligible"
                  target="_blank"
                  >
                Learn more about MSP eligibility
                </a>
                .&nbsp;
              </li>
            </ul>
          </div>

          <div
            v-if="
              fpcApplicationResult && fpcApplicationResult.returnCode === '0'
            "
            class="fpc-success-message"
          >
            <p class="m-0"><strong>Fair PharmaCare:</strong></p>
            <ul>
              <li v-if="!mspApplicationResult">
                You are now registered for Fair PharmaCare with temporary
                coverage.&nbsp;
              </li>
              <li
                v-if="
                  mspApplicationResult &&
                  mspApplicationResult.returnCode === '0'
                "
              >
                Your temporary Fair PharmaCare coverage will begin once you are
                enrolled in MSP. You will receive your registration number
                then.&nbsp;
              </li>
              <li>
                We will send you a consent form in the mail soon, which will
                allow us to verify your income with the Canada Revenue Agency.
                Please sign and return the form.&nbsp;
              </li>
              <li>
                If you don't return a signed consent form, your temporary Fair
                PharmaCare coverage will end and your family's coverage will not
                be based on income. Your family deductible will default to
                $10,000.&nbsp;
              </li>
              <li>
                After we receive your consent form and verify your income, we
                will send you a letter that tells you what your Fair PharmaCare
                deductible and family maximum are.
              </li>
              <li>
                To track your registration, go to
                <a
                  href="https://my.gov.bc.ca/fpcare/registration-status/request-status"
                  target="_blank"
                  >
                https://my.gov.bc.ca/fpcare/registration-status/request-status
                </a>
                .&nbsp;
              </li>
            </ul>
          </div>

          <div
            v-if="sbApplicationResult && sbApplicationResult.returnCode === '0'"
            class="sb-success-message"
          >
            <p class="m-0"><strong>Supplementary Benefits:</strong></p>
            <ul>
              <li>
                The Notice of Assessment or Reassessment you submitted will be
                used to assess your and your family's eligibility for
                Supplementary Benefits.&nbsp;
              </li>
              <li>
                After your application is processed, HIBC will mail you a letter
                confirming your eligibility for Supplementary Benefits.&nbsp;
              </li>
              <li>
                File your taxes every year so that you do not have to
                reapply.&nbsp;
              </li>
            </ul>
          </div>

          <p>
            If you have any questions,
            <a
              href="https://www2.gov.bc.ca/gov/content/health/about-bc-s-health-care-system/partners/health-insurance-bc"
              target="_blank"
              >
            contact HIBC
            </a>
            .
          </p>
        </div>

        <ReviewTableList className="mt-5 mb-5" />
      </main>
    </PageContent>
  </div>
</template>

<script>
import SuccessBox from "@/components/SuccessBox.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import ReviewTableList from "@/components/enrolment/ReviewTableList.vue";
import { PageContent, formatArray, formatDate } from "common-lib-vue";
import { getConvertedPath } from "@/helpers/url";
import pageStateService from "@/services/page-state-service";
import { enrolmentRoutes } from "@/router/routes";
import {
  MODULE_NAME as enrolmentModule,
  RESET_FORM,
} from "@/store/modules/enrolment-module";
import { scrollTo } from "@/helpers/scroll";
import logService from "@/services/log-service";
import pageContentMixin from "@/mixins/page-content-mixin";

export default {
  name: "SubmissionPage",
  mixins: [pageContentMixin],
  components: {
    ErrorBox,
    PageContent,
    ReviewTableList,
    SuccessBox,
  },
  data: () => {
    return {
      submissionDate: "",
      referenceNumber: "",
      mspApplicationResult: null,
      fpcApplicationResult: null,
      sbApplicationResult: null,
    };
  },
  created() {
    this.submissionDate = formatDate(
      this.$store.state.enrolmentModule.submissionDate,
    );
    this.referenceNumber =
      this.$store.state.enrolmentModule.referenceNumber || "Unknown";
    this.mspApplicationResult =
      this.$store.state.enrolmentModule.submissionAPIResponse.msp;
    this.fpcApplicationResult =
      this.$store.state.enrolmentModule.submissionAPIResponse.fpc;
    this.sbApplicationResult =
      this.$store.state.enrolmentModule.submissionAPIResponse.sb;

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.SUBMISSION_PAGE.path,
      enrolmentRoutes.SUBMISSION_PAGE.title,
    );
  },
  methods: {
    printPage() {
      window.print();
    },
  },
  computed: {
    formattedSuccessfulSubmissionPrograms() {
      return formatArray(this.successfulSubmissionPrograms);
    },
    successfulSubmissionPrograms() {
      const programs = [];
      if (
        this.mspApplicationResult &&
        this.mspApplicationResult.returnCode === "0"
      ) {
        programs.push("Medical Services Plan");
      }
      if (
        this.fpcApplicationResult &&
        this.fpcApplicationResult.returnCode === "0"
      ) {
        programs.push("Fair PharmaCare");
      }
      if (
        this.sbApplicationResult &&
        this.sbApplicationResult.returnCode === "0"
      ) {
        programs.push("Supplementary Benefits");
      }
      return programs;
    },
    hasAnySuccessfulForms() {
      return this.successfulSubmissionPrograms.length > 0;
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    this.$store.dispatch(enrolmentModule + "/" + RESET_FORM);
    if (to.path === enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path) {
      next();
    } else {
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path,
      );
      next({ path: toPath });
    }
    setTimeout(() => {
      scrollTo(0);
    }, 0);
  },
};
</script>

<style scoped>
.fa-check-circle {
  color: rgba(46, 133, 64, 1);
}

.tip-container {
  position: relative;
  display: inline-block;
  color: black;
}

/* Tooltip text */
.tip-container .tip {
  visibility: hidden;
  width: 220px;
  background-color: #f2f2f2;
  color: #606060;
  text-align: center;
  padding: 2px 4px;
  border: 2px solid #606060;
  font-weight: normal;
  font-size: 13.33px;
  right: 25px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tip-container:hover .tip {
  visibility: visible;
}

.print-btn {
  text-decoration: none;
}
.print-link {
  text-decoration: none;
  font-weight: bold;
}
</style>
