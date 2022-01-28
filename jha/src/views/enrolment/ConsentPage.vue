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
        <h1>Declaration and consent</h1>
        <div>
          <hr/>
          <h2>MSP Authorization: Must be signed by Applicant, and Spouse if applicable</h2>
          <ul>
            <li>I have received information about MSP and agree to abide by the terms and conditions of MSP. I understand that if a discrepancy exists between the information provided and the legislation, the legislation will govern.</li>
            <li>I authorize the Ministry of Health to collect my health information from practitioners who provide publicly funded health care service(s) to me under MSP and other publicly funded health care programs, and I provide consent for those practitioners to disclose such information to the Ministry of Health for the purposes of asessing eligibility for, and in regard to the administration of, MSP and other Ministry of Health publicly funded health care programs.</li>
            <li>I declare that all information provided is true and I understand that the Ministry of Health and/or Health Insurance BC may verify this information with immigration authorities, law enforcement authorities and other public authorities, agencies and persons as appropriate. I declare that all persons listed are residents of British Columbia.</li>
          </ul>
        </div>
        
        <div v-if="isSystemUnavailable"
            class="text-danger mt-3 mb-5"
            aria-live="assertive">Unable to continue, system unavailable. Please try again later.</div>
      </div>
    </PageContent>
    <ContinueBar @continue='continueHandler()'
                :hasLoader='isLoading'
                buttonLabel='Submit'/>
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import {
  enrolmentRoutes,
  isPastPath
} from '@/router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition
} from '@/helpers/scroll';
import { getConvertedPath } from '@/helpers/url';
import {
  MODULE_NAME as formModule,
  RESET_FORM,
  SET_REFERENCE_NUMBER,
  SET_SUBMISSION_DATE
} from '@/store/modules/enrolment-module';
import apiService from '@/services/api-service';
import logService from '@/services/log-service';
import {
  ContinueBar,
  PageContent,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import pageStepperMixin from '@/mixins/page-stepper-mixin';

export default {
  name: 'ReviewPage',
  mixins: [
    pageContentMixin,
    pageStepperMixin,
  ],
  components: {
    PageContent,
    ContinueBar,
  },
  data: () => {
    return {
      isLoading: false,
      isSystemUnavailable: false,
      isApplyingForMSP: null,
      isApplyingForFPCare: null,
      isApplyingForSuppBen: null,
      isMSPAHAuthorized: false,
      isMSPSpouseAuthorized: false,
      isFPCAHAuthorized: false,
      isFPCSpouseAuthorized: false,
      isSBAHAuthorized: false,
      isSBSpouseAuthorized: false,
    }
  },
  created() {
    this.isApplyingForMSP = this.$store.state.enrolmentModule.isApplyingForMSP;
    this.isApplyingForFPCare = this.$store.state.enrolmentModule.isApplyingForFPCare;
    this.isApplyingForSuppBen = this.$store.state.enrolmentModule.isApplyingForSuppBen;

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.REVIEW_PAGE.path,
      enrolmentRoutes.REVIEW_PAGE.title
    );
  },
  methods: {
    continueHandler() {
      this.submitForm();
    },
    submitForm() {
      this.isLoading = true;
      this.isSystemUnavailable = false;

      this.$store.dispatch(formModule + '/' + SET_SUBMISSION_DATE, new Date());

      const applicationUuid = this.$store.state.enrolmentModule.applicationUuid;
      const formState = this.$store.state.enrolmentModule;
      apiService.sendAttachments(formState)
        .then(() => {
          apiService.sendApplication(formState)
            .then((response) => {
              // Handle HTTP success.
              const returnCode = response.data.returnCode;
              const referenceNumber = response.data.referenceNumber;

              this.isLoading = false;

              switch (returnCode) {
                case '0': // Submission successful.
                  logService.logSubmission(applicationUuid, {
                    event: 'submission',
                    response: response.data,
                  }, referenceNumber);
                  this.$store.dispatch(formModule + '/' + SET_REFERENCE_NUMBER, referenceNumber);
                  this.navigateToSubmissionPage();
                  break;
                case '1': // Submission failed.
                  logService.logError(applicationUuid, {
                    event: 'submission failure',
                    response: response.data,
                  });
                  this.navigateToSubmissionErrorPage();
                  break;
                case '2': // Unknown case, but not '0', so failing the the submission.
                  logService.logError(applicationUuid, {
                    event: 'submission failure',
                    response: response.data,
                  });
                  this.navigateToSubmissionErrorPage();
                  break;
                case '3': // System unavailable.
                  this.isSystemUnavailable = true;
                  logService.logError(applicationUuid, {
                    event: 'submission failure',
                    response: response.data,
                  });
                  scrollToError();
                  break;
              }
            })
            .catch((error) => {
              // Handle HTTP error.
              const httpStatusCode = error && error.response ? error.response.status : null;
              this.isLoading = false;
              this.isSystemUnavailable = true;
              logService.logError(applicationUuid, {
                event: 'HTTP error while sending application',
                status: httpStatusCode
              });
              scrollToError();
            });
        })
        .catch((error) => {
          // Handle HTTP error.
          const httpStatusCode = error && error.response ? error.response.status : null;
          this.isLoading = false;
          logService.logError(applicationUuid, {
            event: 'Error sending attachment',
            status: httpStatusCode,
          });
          this.navigateToSubmissionErrorPage();
        });
      
      
      // Manually navigate to submission success page when middleware/RAPID is down.
      // this.navigateToSubmissionPage();
    },
    navigateToSubmissionPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SUBMISSION_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo();
    },
    navigateToSubmissionErrorPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SUBMISSION_ERROR_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo();
    }
  },
  computed: {},
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (to.path === enrolmentRoutes.HOME_PAGE.path) {
      this.$store.dispatch(formModule + '/' + RESET_FORM);
      next();
    } else if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.REVIEW_PAGE.path
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
