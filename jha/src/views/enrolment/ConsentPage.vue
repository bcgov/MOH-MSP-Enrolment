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

        <!-- MSP -->
        <div v-if="isApplyingForMSP"
          class="mb-5">
          <hr/>
          <h2>MSP Authorization: Must be signed by Applicant, and Spouse if applicable</h2>
          <ul>
            <li>I have received information about MSP and agree to abide by the terms and conditions of MSP. I understand that if a discrepancy exists between the information provided and the legislation, the legislation will govern.</li>
            <li>I authorize the Ministry of Health to collect my health information from practitioners who provide publicly funded health care service(s) to me under MSP and other publicly funded health care programs, and I provide consent for those practitioners to disclose such information to the Ministry of Health for the purposes of asessing eligibility for, and in regard to the administration of, MSP and other Ministry of Health publicly funded health care programs.</li>
            <li>I declare that all information provided is true and I understand that the Ministry of Health and/or Health Insurance BC may verify this information with immigration authorities, law enforcement authorities and other public authorities, agencies and persons as appropriate. I declare that all persons listed are residents of British Columbia.</li>
          </ul>
          <Checkbox label="Account holder"
            id="msp-ah"
            v-model="isAuthorizedMSPAH"
            @blur="handleBlurField($v.isAuthorizedMSPAH)" />
          <div class="text-danger mt-1"
            v-if="$v.isAuthorizedMSPAH.$dirty
              && !$v.isAuthorizedMSPAH.requiredTrue"
            aria-live="assertive">Field is required.</div>
          <Checkbox v-if="hasSpouse"
            label="Spouse or common law partner"
            id="msp-spouse"
            class="mt-3"
            v-model="isAuthorizedMSPSpouse"
            @blur="handleBlurField($v.isAuthorizedMSPSpouse)" />
          <div class="text-danger mt-1"
            v-if="hasSpouse
              && $v.isAuthorizedMSPSpouse.$dirty
              && !$v.isAuthorizedMSPSpouse.requiredTrue"
            aria-live="assertive">Field is required.</div>
        </div>

        <!-- FPC -->
        <div v-if="isApplyingForFPCare"
          class="mb-5">
          <hr/>
          <h2>Fair PharmaCare: Declaration and Consent - Must Be Signed</h2>
          <p><b>Please read and sign. If you are married or living and cohabiting in a marriage-like relationship, your spouse must also sign.</b></p>
          <ul>
            <li>I consent to allow the Canada Revenue Agency to release information from my income tax returns and other required taxpayer information to the B.C. Ministry of Health and Health Insurance BC.</li>
            <li>The information provided will be used solely to determine, verify and administer my and/or my family's Fair PharmaCare Plan coverage, but may be aggregated for planning and evaluation purposes.</li>
            <li>I understand my information will be collected, used and disclosed in accordance with the British Columbia Pharmaceutical Services Act and Freedom of Information and Protection of Privacy Act. It will not be disclosed to any persons without my consent.</li>
            <li>This consent is valid for the two taxation years before the year in which I sign this document, for the year in which I sign it and for each following taxation year in which I and/or my family am eligible for the Fair PharmaCare Plan.</li>
            <li>I understand that I can withdraw this consent at any time by writing to Health Insurance BC, PO Box 9655 Stn Prov Govt, Victoria BC V8W 9P2.</li>
          </ul>
          <Checkbox label="Account holder"
            id="fpc-ah"
            v-model="isAuthorizedFPCAH"
            @blur="handleBlurField($v.isAuthorizedFPCAH)" />
          <div class="text-danger mt-1"
            v-if="$v.isAuthorizedFPCAH.$dirty
              && !$v.isAuthorizedFPCAH.requiredTrue"
            aria-live="assertive">Field is required.</div>
          <Checkbox v-if="hasSpouse"
            label="Spouse or common law partner"
            id="fpc-spouse"
            class="mt-3"
            v-model="isAuthorizedFPCSpouse"
            @blur="handleBlurField($v.isAuthorizedFPCSpouse)" />
          <div class="text-danger mt-1"
            v-if="hasSpouse
              && $v.isAuthorizedFPCSpouse.$dirty
              && !$v.isAuthorizedFPCSpouse.requiredTrue"
            aria-live="assertive">Field is required.</div>
        </div>

        <!-- Supp Ben -->
        <div v-if="isApplyingForSuppBen"
          class="mb-5">
          <hr/>
          <h2>MSP Supplementary Benefits: Declaration and Consent - Must Be Signed</h2>
          <p><b>Please read and sign. If you are married or living in a marriage-like relationship, your spouse must also sign.</b></p>
          <ul>
            <li>I (applicant) am a resident of British Columbia as defined by the Medicare Protection Act.</li>
            <li>I (applicant) have resided in Canada as a Canadian citizen or holder of permanent resident state (landed immigrant) for at least the last 12 months immediately preceding this application. I am not exempt from liability to pay income tax by reason of any other Act.</li>
            <li>I (applicant and, if applicable, spouse) hereby consent to the release of information from my income tax returns, and other taxpayer information, by the Canada Revenue Agency to the Ministry of Health and/or Health Insurance BC. The information obtained will be relevant to and used for the purpose of determining and verifying my initial and ongoing entitlement to the Supplementary Benefits Program under the Medicare Protection Act, and will not be disclosed to any other party. This authorization is valid for the taxation year prior to the signature of this application, the year of the signature and for each subsequent consecutive taxation year for which supplementary benefits is requested. It may be revoked by sending a written notice to Health Insurance BC.</li>
          </ul>
          <Checkbox label="Account holder"
            id="sb-ah"
            v-model="isAuthorizedSBAH"
            @blur="handleBlurField($v.isAuthorizedSBAH)" />
          <div class="text-danger mt-1"
            v-if="$v.isAuthorizedSBAH.$dirty
              && !$v.isAuthorizedSBAH.requiredTrue"
            aria-live="assertive">Field is required.</div>
          <Checkbox v-if="hasSpouse"
            label="Spouse or common law partner"
            id="sb-spouse"
            class="mt-3"
            v-model="isAuthorizedSBSpouse"
            @blur="handleBlurField($v.isAuthorizedSBSpouse)" />
          <div class="text-danger mt-1"
            v-if="hasSpouse
              && $v.isAuthorizedSBSpouse.$dirty
              && !$v.isAuthorizedSBSpouse.requiredTrue"
            aria-live="assertive">Field is required.</div>
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
  Checkbox,
  ContinueBar,
  PageContent,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import pageStepperMixin from '@/mixins/page-stepper-mixin';

const requiredTrue = (value) => {
  return value === true;
};

export default {
  name: 'ReviewPage',
  mixins: [
    pageContentMixin,
    pageStepperMixin,
  ],
  components: {
    Checkbox,
    ContinueBar,
    PageContent,
  },
  data: () => {
    return {
      isLoading: false,
      isSystemUnavailable: false,
      isApplyingForMSP: null,
      isApplyingForFPCare: null,
      isApplyingForSuppBen: null,
      isAuthorizedMSPAH: null,
      isAuthorizedMSPSpouse: false,
      isAuthorizedFPCAH: false,
      isAuthorizedFPCSpouse: false,
      isAuthorizedSBAH: false,
      isAuthorizedSBSpouse: false,
    }
  },
  validations() {
    const validations = {
      isAuthorizedMSPAH: this.isApplyingForMSP ? { requiredTrue } : {},
      isAuthorizedMSPSpouse: this.isApplyingForMSP && this.hasSpouse ? { requiredTrue } : {},
      isAuthorizedFPCAH: this.isApplyingForFPCare ? { requiredTrue } : {},
      isAuthorizedFPCSpouse: this.isApplyingForFPCare && this.hasSpouse ? { requiredTrue } : {},
      isAuthorizedSBAH: this.isApplyingForSuppBen ? { requiredTrue } : {},
      isAuthorizedSBSpouse: this.isApplyingForSuppBen && this.hasSpouse ? { requiredTrue } : {},
    };
    return validations;
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
      this.$v.$touch();
      if (this.$v.$invalid) {
        scrollToError();
        return;
      }

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
    },
    handleBlurField(validationObject) {
      if (validationObject) {
        validationObject.$touch();
      }
    },
  },
  computed: {
    hasSpouse() {
      return this.$store.state.enrolmentModule.hasSpouse === 'Y';
    }
  },
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
