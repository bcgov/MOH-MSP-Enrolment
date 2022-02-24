<template>
  <div>
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-3">
        <div class="row align-items-end mt-3">
          <div class="col-9">
            <h1 class="mb-0">Confirmation of Submission</h1>
          </div>
          <div class="col-3 text-right">
            <a href="javascript:void(0)"
              class="print-btn"
              @click="printPage()">Print or Save as PDF
              <font-awesome-icon icon="print" />
            </a>
            <div class="tip-container">
              <font-awesome-icon class="ml-2" icon="info-circle" />
              <div class="tip">To save as a PDF, in the print window, select “Save as PDF”</div>
            </div>
          </div>
        </div>
        <hr/>

        <div v-if="mspApplicationResult"
          class="mb-4">
          <SuccessBox v-if="mspApplicationResult.returnCode === '0'">
            <p>Your Medical Services Plan application has been submitted.</p>
            <div class="row">
              <div class="col-md-4 col-lg-3">Date of Submission:</div>
              <div class="col-md-8 col-lg-9"><b>{{ submissionDate }}</b></div>
            </div>
            <div v-if="mspApplicationResult.referenceNumber"
              class="row">
              <div class="col-md-4 col-lg-3">Reference Number:</div>
              <div class="col-md-8 col-lg-9"><b>{{mspApplicationResult.referenceNumber}}</b></div>
            </div>
          </SuccessBox>
          <ErrorBox v-else>
            <p>There was an issue with your MSP submission. Your application was not submitted.</p>
            <p v-if="mspApplicationResult.message">{{mspApplicationResult.message}}</p>
          </ErrorBox>
        </div>

        <div v-if="fpcApplicationResult"
          class="mb-4">
          <SuccessBox v-if="fpcApplicationResult.returnCode === '0'">
            <p>Your Fair PharmaCare application has been submitted.</p>
            <div class="row">
              <div class="col-md-4 col-lg-3">Date of Submission:</div>
              <div class="col-md-8 col-lg-9"><b>{{ submissionDate }}</b></div>
            </div>
            <div v-if="fpcApplicationResult.referenceNumber"
              class="row">
              <div class="col-md-4 col-lg-3">Reference Number:</div>
              <div class="col-md-8 col-lg-9"><b>{{fpcApplicationResult.referenceNumber}}</b></div>
            </div>
          </SuccessBox>
          <ErrorBox v-else>
            <p>There was an issue with your Fair PharmaCare submission. Your application was not submitted.</p>
            <p v-if="fpcApplicationResult.message">{{fpcApplicationResult.message}}</p>
          </ErrorBox>
        </div>

        <div v-if="sbApplicationResult"
          class="mb-4">
          <SuccessBox v-if="sbApplicationResult.returnCode === '0'">
            <p>Your Supplementary Benefits application has been submitted.</p>
            <div class="row">
              <div class="col-md-4 col-lg-3">Date of Submission:</div>
              <div class="col-md-8 col-lg-9"><b>{{ submissionDate }}</b></div>
            </div>
            <div v-if="sbApplicationResult.referenceNumber"
              class="row">
              <div class="col-md-4 col-lg-3">Reference Number:</div>
              <div class="col-md-8 col-lg-9"><b>{{sbApplicationResult.referenceNumber}}</b></div>
            </div>
          </SuccessBox>
          <ErrorBox v-else>
            <p>There was an issue with your Supplementary Benefits submission. Your application was not submitted.</p>
            <p v-if="sbApplicationResult.message">{{sbApplicationResult.message}}</p>
          </ErrorBox>
        </div>

        <h3 class="mt-4">Next Steps</h3>
        <hr/>
        <ul>
          <li>Please <a href="javascript:void(0)" @click="printPage()" class="print-link">print</a> this page for your records.</li>
          <li>Health Insurance BC will send you a letter following cancellation of MSP coverage.</li>
          <li>Please contact <a href="https://www2.gov.bc.ca/gov/content/health/about-bc-s-health-care-system/partners/health-insurance-bc" target="_blank">Health Insurance BC</a> if you have any questions.</li>
        </ul>

        <ReviewTableList className='mt-5 mb-5' />
      </div>
    </PageContent>
  </div>
</template>

<script>
import SuccessBox from '@/components/SuccessBox.vue';
import ErrorBox from '@/components/ErrorBox.vue';
import ReviewTableList from '@/components/enrolment/ReviewTableList.vue';
import {
  PageContent,
  formatDate,
} from 'common-lib-vue';
import { getConvertedPath } from '@/helpers/url';
import pageStateService from '@/services/page-state-service';
import { enrolmentRoutes } from '@/router/routes';
import {
  MODULE_NAME as enrolmentModule,
  RESET_FORM
} from '@/store/modules/enrolment-module';
import { scrollTo } from '@/helpers/scroll';
import logService from '@/services/log-service';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'SubmissionPage',
  mixins: [
    pageContentMixin,
  ],
  components: {
    ErrorBox,
    PageContent,
    ReviewTableList,
    SuccessBox,
  },
  data: () => {
    return {
      submissionDate: '',
      referenceNumber: '',
      mspApplicationResult: null,
      fpcApplicationResult: null,
      sbApplicationResult: null,
    };
  },
  created() {
    this.submissionDate = formatDate(this.$store.state.enrolmentModule.submissionDate);
    this.referenceNumber = this.$store.state.enrolmentModule.referenceNumber || 'Unknown';
    this.mspApplicationResult = this.$store.state.enrolmentModule.submissionAPIResponse.msp;
    this.fpcApplicationResult = this.$store.state.enrolmentModule.submissionAPIResponse.fpc;
    this.sbApplicationResult = this.$store.state.enrolmentModule.submissionAPIResponse.sb;

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.SUBMISSION_PAGE.path,
      enrolmentRoutes.SUBMISSION_PAGE.title
    );
  },
  methods: {
    printPage() {
      window.print();
    }
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    this.$store.dispatch(enrolmentModule + '/' + RESET_FORM);
    if (to.path === enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path) {
      next();
    } else {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path
      );
      next({ path: toPath });
    }
    setTimeout(() => {
      scrollTo(0);
    }, 0);
  }
}
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
