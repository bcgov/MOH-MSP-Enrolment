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
      <main class="container pt-3 pt-sm-5 mb-3">
        <h1>Declaration and consent</h1>
        <div class="alert alert-warning">
          <p class="m-0">After clicking Submit, do not navigate away from this page. Please wait for the submission process to complete.</p>
        </div>
        <hr />
        <h3>Note:</h3>
        <ul class="pl-4">
          <li>
            If someone with power of attorney or other legal representation
            agreement is signing on your behalf, check the box below and
            upload a copy of the agreement. Power of attorney or other legal
            representation will apply to all programs (MSP, Fair PharmaCare
            and/or Supplementary Benefits) you apply for. For Fair PharmaCare
            and/or for MSP, copies of the power of attorney agreement may be
            forwarded to the CRA if they request it.
          </li>
        </ul>
        <Checkbox
          label="I have power of attorney or another legal representation agreement"
          id="power-of-attorney-checkbox"
          class="mt-3"
          v-model="hasPowerOfAttorney"
        />

        <div v-if="hasPowerOfAttorney" class="row">
          <div class="col-8">
            <div class="flex flex-col">
              <strong>
                <label class="mt-2" for="power-of-attorney-upload">
                  Upload your power of attorney document or another legal
                  representation agreement
                </label>
              </strong>
              <FileUploader
                v-model="powerOfAttorneyDocuments"
                :isZoomPortalEnabled="true"
                modalElementTarget="#modal-target"
                documentType="PowerOfAttorney"
                description="Power Of Attorney Supporting Documents"
                id="power-of-attorney-upload"
              />
            </div>
            <div
              class="text-danger"
              v-if="
                $v.powerOfAttorneyDocuments.$dirty &&
                !$v.powerOfAttorneyDocuments.required
              "
              aria-live="assertive"
            >
              File upload required.
            </div>
          </div>
          <div class="col-4">
            <SampleImageTipBox />
          </div>
        </div>

        <!-- MSP -->
        <div v-if="isApplyingForMSP"
          class="mb-5">
          <hr/>
          <h2>MSP Authorization: Must be signed by applicant, and spouse if applicable</h2>
          <ul>
            <li>I have received information about MSP. I agree to abide by the terms and conditions of MSP. I understand that if a discrepancy exists between the information provided and the legislation, the legislation will govern.&nbsp;</li>
            <li>I authorize the Ministry of Health and the Medical Services Commission to collect my health information from practitioners who provide publicly funded health care service(s) to me under MSP and other publicly funded health care programs, and I provide consent for those practitioners to disclose such information to the Ministry of Health and the Medical Services Commission for the purposes of assessing eligibility for, and in regard to the administration of, MSP and other Ministry of Health and the Medical Services Commission publicly funded health care programs.&nbsp;</li>
            <li>I declare that all information provided is true and I understand that the Ministry of Health and the Medical Services Commission and/or Health Insurance BC may verify this information with immigration authorities, law enforcement authorities and other public authorities, agencies and persons, as appropriate. I declare that all persons listed are residents of British Columbia.&nbsp;</li>
          </ul>
          <Checkbox :label="ahConsentLabel"
            id="msp-ah"
            v-model="isAuthorizedMSPAH"
            @blur="handleBlurField($v.isAuthorizedMSPAH)" />
          <div class="text-danger mt-1"
            v-if="$v.isAuthorizedMSPAH.$dirty
              && !$v.isAuthorizedMSPAH.requiredTrue"
            aria-live="assertive">Field is required.</div>
          <Checkbox v-if="hasSpouse"
            :label="spouseConsentLabel"
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
          <h2>Fair PharmaCare: Declaration and consent - must be signed</h2>
          <p>Your online application is now complete. In order to make your Fair PharmaCare coverage permanent, we need to check your income information with the Canada Revenue Agency (CRA). The CRA requires that you provide written consent to share your income information. If you are married or living in a marriage-like relationship, your spouse must also provide written consent.</p>
          <p>You will receive a letter at the address you provided, asking you to agree to the following statement:</p>
          <ul>
            <li>I consent to allow the Canada Revenue Agency to release information from my income tax returns and other required taxpayer information to the B.C. Ministry of Health and Health Insurance BC as a provider of Fair PharmaCare enrolment services for the Ministry of Health.&nbsp;</li>
            <li>The information provided will be used to determine, verify and administer my and/or my family's initial and ongoing Fair PharmaCare Plan coverage.&nbsp;</li>
            <li>I understand my information will be collected, used and disclosed in accordance with the Pharmaceutical Services Act and the Freedom of Information and Protection of Privacy Act.&nbsp;</li>
            <li>This consent is valid for the two taxation years before the year in which I sign this document, for the year in which I sign it and for each following taxation year in which I and/or my family remain enrolled in the Fair PharmaCare Plan.&nbsp;</li>
            <li>I understand that I can withdraw this consent at any time by writing to Health Insurance BC, PO Box 9655 Stn Prov Govt, Victoria BC V8W 9P2. I also understand that if I withdraw my consent, my Fair PharmaCare deductible may be set to the highest amount.&nbsp;</li>
          </ul>
          <h2>Your information</h2>
          <p>Please confirm that you (and your spouse, if you have one):</p>
          <ul>
            <li>filed tax returns for the tax year two years prior to this application, and&nbsp;</li>
            <li>agree to allow the CRA to share your income information with PharmaCare.&nbsp;</li>
          </ul>
          <Checkbox :label="ahConsentLabel"
            id="fpc-ah"
            v-model="isAuthorizedFPCAH"
            @blur="handleBlurField($v.isAuthorizedFPCAH)" />
          <div class="text-danger mt-1"
            v-if="$v.isAuthorizedFPCAH.$dirty
              && !$v.isAuthorizedFPCAH.requiredTrue"
            aria-live="assertive">Field is required.</div>
          <Checkbox v-if="hasSpouse"
            :label="spouseConsentLabel"
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
          <h2>Supplementary Benefits: Declaration and consent - must be signed</h2>
          <p><b>Please read and sign. If you are married or living in a marriage-like relationship, your spouse must also sign.</b></p>
          <ul>
            <li>I am a resident of British Columbia as defined by the Medicare Protection Act. I have resided in Canada as a Canadian citizen or holder of permanent resident status (landed immigrant) for at least the last 12 months immediately preceding this application. I am not exempt from liability to pay income tax by reason of any other Act. I consent to the release of information from my income tax returns and other taxpayer information, by the CRA to the Ministry of Health and/or Health Insurance BC. The information obtained will be relevant to and used for the purpose of determining and verifying my initial and ongoing entitlement to the Supplementary Benefits Program under the Medicare Protection Act, and will not be disclosed to any other party. This authorization is valid for the taxation year prior to the signature of this application, the year of the signature, and for each subsequent consecutive taxation year for determining Supplementary Benefits. It may be revoked by sending a written notice to Health Insurance BC.&nbsp;</li>
          </ul>
          <Checkbox :label="ahConsentLabel"
            id="sb-ah"
            v-model="isAuthorizedSBAH"
            @blur="handleBlurField($v.isAuthorizedSBAH)" />
          <div class="text-danger mt-1"
            v-if="$v.isAuthorizedSBAH.$dirty
              && !$v.isAuthorizedSBAH.requiredTrue"
            aria-live="assertive">Field is required.</div>
          <Checkbox v-if="hasSpouse"
            :label="spouseConsentLabel"
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
      </main>
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
  isEQPath,
  isPastPath
} from '@/router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition
} from '@/helpers/scroll';
import { getConvertedPath } from '@/helpers/url';
import { copyPowerOfAttorneyDocuments } from "@/helpers/form-helpers";
import {
  MODULE_NAME as formModule,
  SET_MSP_REFERENCE_NUMBER,
  SET_FPC_REFERENCE_NUMBER,
  SET_SB_REFERENCE_NUMBER,
  SET_SUBMISSION_DATE,
  SET_SUBMISSION_API_RESPONSE,
  SET_POWER_OF_ATTORNEY,
  SET_FPC_POWER_OF_ATTORNEY_DOCUMENTS,
  SET_MSP_POWER_OF_ATTORNEY_DOCUMENTS,
  SET_SB_POWER_OF_ATTORNEY_DOCUMENTS,
} from '@/store/modules/enrolment-module';
import apiService from '@/services/api-service';
import logService from '@/services/log-service';
import {
  Checkbox,
  ContinueBar,
  PageContent,
  FileUploader,
} from 'common-lib-vue';
import SampleImageTipBox from "@/components/SampleImageTipBox";
import pageContentMixin from '@/mixins/page-content-mixin';
import pageStepperMixin from '@/mixins/page-stepper-mixin';
import { required } from "vuelidate/lib/validators";

const requiredTrue = (value) => {
  return value === true;
};

export default {
  name: 'ConsentPage',
  mixins: [
    pageContentMixin,
    pageStepperMixin,
  ],
  components: {
    Checkbox,
    ContinueBar,
    PageContent,
    FileUploader,
    SampleImageTipBox,
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
      hasPowerOfAttorney: true,
      powerOfAttorneyDocuments: [],
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
      powerOfAttorneyDocuments: this.hasPowerOfAttorney ? { required } : {},
    };
    return validations;
  },
  created() {
    this.isApplyingForMSP = this.$store.state.enrolmentModule.isApplyingForMSP;
    this.isApplyingForFPCare = this.$store.state.enrolmentModule.isApplyingForFPCare;
    this.isApplyingForSuppBen = this.$store.state.enrolmentModule.isApplyingForSuppBen;
    this.hasPowerOfAttorney = this.$store.state.enrolmentModule.hasPowerOfAttorney;
    
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.CONSENT_PAGE.path,
      enrolmentRoutes.CONSENT_PAGE.title
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
    saveData() {
      const {
        mspPowerOfAttorneyDocuments,
        fpcPowerOfAttorneyDocuments,
        sbPowerOfAttorneyDocuments,
      } = copyPowerOfAttorneyDocuments(
        this.$store.state.enrolmentModule,
        this.powerOfAttorneyDocuments
      );
      this.$store.dispatch(
        `${formModule}/${SET_POWER_OF_ATTORNEY}`,
        this.hasPowerOfAttorney
      );
      this.$store.dispatch(
        `${formModule}/${SET_FPC_POWER_OF_ATTORNEY_DOCUMENTS}`,
        fpcPowerOfAttorneyDocuments,
      );
      this.$store.dispatch(
        `${formModule}/${SET_MSP_POWER_OF_ATTORNEY_DOCUMENTS}`,
        mspPowerOfAttorneyDocuments,
      );
      this.$store.dispatch(
        `${formModule}/${SET_SB_POWER_OF_ATTORNEY_DOCUMENTS}`,
        sbPowerOfAttorneyDocuments,
      );
    },
    submitForm() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      this.saveData();

      this.$store.dispatch(formModule + '/' + SET_SUBMISSION_DATE, new Date());

      const applicationUuid = this.$store.state.enrolmentModule.applicationUuid;
      const formState = this.$store.state.enrolmentModule;
      apiService.sendAttachments(formState)
        .then(() => {
          apiService.sendApplication(formState)
            .then((response) => {
              // Handle HTTP success.
              let isSuccess = true;

              this.isLoading = false;
              this.$store.dispatch(`${formModule}/${SET_SUBMISSION_API_RESPONSE}`, response.data);

              if (response.data.exception === true) {
                isSuccess = false;
              }
              // MSP.
              if (response.data.msp) {
                if (response.data.msp.referenceNumber) {
                  this.$store.dispatch(`${formModule}/${SET_MSP_REFERENCE_NUMBER}`, response.data.msp.referenceNumber);
                }
              }
              // FPC.
              if (response.data.fpc) {
                if (response.data.fpc.referenceNumber) {
                  this.$store.dispatch(`${formModule}/${SET_FPC_REFERENCE_NUMBER}`, response.data.fpc.referenceNumber);
                }
              }
              // SB.
              if (response.data.sb) {
                if (response.data.sb.referenceNumber) {
                  this.$store.dispatch(`${formModule}/${SET_SB_REFERENCE_NUMBER}`, response.data.sb.referenceNumber);
                }
              }

              if (isSuccess) {
                logService.logSubmission(applicationUuid, {
                  event: 'submission success',
                  response: response.data,
                });
                this.navigateToSubmissionPage();
              } else {
                logService.logError(applicationUuid, {
                  event: 'submission failure',
                  response: response.data,
                });
                this.navigateToSubmissionErrorPage();
              }
            })
            .catch((error) => {
              // Handle HTTP error.
              const httpStatusCode = error && error.response ? error.response.status : null;
              this.isLoading = false;
              this.isSystemUnavailable = true;
              logService.logError(applicationUuid, {
                event: 'HTTP error while sending application',
                status: httpStatusCode,
                error,
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
            error,
          });
          this.navigateToSubmissionErrorPage();
        });
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
    },
    ahConsentLabel() {
      let label = `${this.$store.state.enrolmentModule.ahFirstName} ${this.$store.state.enrolmentModule.ahLastName}`;
      if (this.hasPowerOfAttorney) label += " or legal representative";
      return label;
    },
    spouseConsentLabel() {
      let label = `${this.$store.state.enrolmentModule.spouseFirstName} ${this.$store.state.enrolmentModule.spouseLastName}`;
      if (this.hasPowerOfAttorney) label += " or legal representative";
      return label;
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)
      && !isEQPath(to.path)) {
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
