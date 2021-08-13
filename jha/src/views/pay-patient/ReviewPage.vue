<template>
  <div>
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Review request</h1>
        <p>Review your request before submission</p>
        <hr/>
        <CorrespondenceAttachedMessage v-if="!isFormAbleToSubmit" />
        <ReviewTableList :showEditButtons='true' 
                        tableBackgroundColor='#EEE'/>
        <CorrespondenceAttachedMessage v-if="!isFormAbleToSubmit" />
        <div v-if="isSystemUnavailable"
            class="text-danger mt-3 mb-5"
            aria-live="assertive">Unable to continue, system unavailable. Please try again later.</div>
      </div>
    </PageContent>
    <ContinueBar @continue='continueHandler()'
                :hasLoader='isLoading'
                :buttonLabel='continueButtonLabel'/>
  </div>
</template>

<script>
import PageContent from '@/components/PageContent.vue';
import ContinueBar from '@/components/ContinueBar.vue';
import CorrespondenceAttachedMessage from '@/components/CorrespondenceAttachedMessage.vue';
import ReviewTableList from '@/components/pay-patient/ReviewTableList.vue';
import pageStateService from '@/services/page-state-service';
import {
  payPatientRoutes,
  isPastPath
} from '../../router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition
} from '../../helpers/scroll';
import { getConvertedPath } from '@/helpers/url';
import { isCorrespondenceAttachedAbleToSubmit } from '@/helpers/form-helpers';
import {
  MODULE_NAME as formModule,
  RESET_FORM,
  SET_REFERENCE_NUMBER,
  SET_SUBMISSION_DATE,
} from '../../store/modules/pay-patient-form';
import apiService from '../../services/api-service';
import logService from '../../services/log-service';

export default {
  name: 'ReviewPage',
  components: {
    CorrespondenceAttachedMessage,
    PageContent,
    ContinueBar,
    ReviewTableList,
  },
  data: () => {
    return {
      isLoading: false,
      isSystemUnavailable: false,
    }
  },
  created() {
    logService.logNavigation(
      this.$store.state.payPatientForm.applicationUuid,
      payPatientRoutes.REVIEW_PAGE.path,
      payPatientRoutes.REVIEW_PAGE.title
    );
  },
  methods: {
    continueHandler() {
      if (this.isFormAbleToSubmit) {
        this.submitForm();
      } else {
        window.print();
      }
    },
    submitForm() {
      this.isLoading = true;
      this.isSystemUnavailable = false;

      this.$store.dispatch(formModule + '/' + SET_SUBMISSION_DATE, new Date());

      const token = this.$store.state.payPatientForm.captchaToken;
      const applicationUuid = this.$store.state.payPatientForm.applicationUuid;
      const formState = this.$store.state.payPatientForm;

      apiService.submitPayPatientApplication(token, formState)
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
      
      // Manually navigate to submission success page when middleware is down.
      // this.navigateToSubmissionPage();
    },
    navigateToSubmissionPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPatientRoutes.SUBMISSION_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo();
    },
    navigateToSubmissionErrorPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPatientRoutes.SUBMISSION_ERROR_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo();
    }
  },
  computed: {
    isFormAbleToSubmit() {
      const correspondenceAttached = this.$store.state.payPatientForm.medicalServiceClaims.map(x => x.correspondenceAttached);
      return correspondenceAttached.every(isCorrespondenceAttachedAbleToSubmit);
    },
    continueButtonLabel() {
      if (this.isFormAbleToSubmit) {
        return 'Continue';
      }
      return 'Print';
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (to.path === payPatientRoutes.HOME_PAGE.path) {
      this.$store.dispatch(formModule + '/' + RESET_FORM);
      next();
    } else if (pageStateService.isPageComplete(to.path) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPatientRoutes.REVIEW_PAGE.path
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
