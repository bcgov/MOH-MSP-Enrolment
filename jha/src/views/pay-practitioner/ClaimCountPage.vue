<template>
  <div>
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Pay Practitioner Claim</h1>
        <hr/>

        <h2>Service(s)</h2>
        <NumberSelect label="How many medical service claims for the patient are you including in this submission?"
                id='services-claim-count'
                v-model='medicalServiceClaimsCount'
                :min='0'
                :max='4'
                :inputStyle='inputStyle'/>
        <div class="text-danger"
            v-if="$v.medicalServiceClaimsCount.$dirty && !$v.medicalServiceClaimsCount.required"
            aria-live="assertive">Medical service claim count is required.</div>
        
        <h2 class="mt-3">Hospital Visits</h2>
        <NumberSelect label="How many hospital visit claims for the patient are you including in this submission?"
                id='hospital-claim-count'
                v-model='hospitalVisitClaimsCount'
                :min='0'
                :max='2'
                :inputStyle='inputStyle'/>
        <div class="text-danger"
            v-if="$v.hospitalVisitClaimsCount.$dirty && !$v.hospitalVisitClaimsCount.required"
            aria-live="assertive">Hospital visit claim count is required.</div>
      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import {
  payPractitionerRoutes,
  isPastPath,
} from '@/router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition
} from '@/helpers/scroll';
import ContinueBar from '@/components/ContinueBar.vue';
import PageContent from '@/components/PageContent.vue';
import {
  NumberSelect,
  cloneDeep,
} from 'common-lib-vue';
import {
  MODULE_NAME as formModule,
  RESET_FORM,
  SET_HOSPITAL_VISIT_CLAIMS,
} from '@/store/modules/pay-practitioner-form';
import logService from '@/services/log-service';
import { required } from 'vuelidate/lib/validators';
import { 
  SET_MEDICAL_SERVICE_CLAIMS_COUNT, 
  SET_HOSPITAL_VISIT_CLAIMS_COUNT 
} from '@/store/modules/pay-practitioner-form';
import { SET_MEDICAL_SERVICE_CLAIMS } from '@/store/modules/pay-patient-form';
import { getConvertedPath } from '@/helpers/url';

export default {
  name: 'ClaimCountPage',
  components: {
    ContinueBar,
    PageContent,
    NumberSelect
  },
  data: () => {
    return {
      isPageLoaded: false,
      medicalServiceClaimsCount: null,
      hospitalVisitClaimsCount: null,
      inputStyle: {
        width: '160px',
        maxWidth: '100%',
      },
    };
  },
  created() {
    this.medicalServiceClaimsCount = this.$store.state.payPractitionerForm.medicalServiceClaimsCount;
    this.hospitalVisitClaimsCount = this.$store.state.payPractitionerForm.hospitalVisitClaimsCount;

    setTimeout(() => {
      this.isPageLoaded = true;
    }, 0);

    logService.logNavigation(
      this.$store.state.payPractitionerForm.applicationUuid,
      payPractitionerRoutes.CLAIM_COUNT_PAGE.path,
      payPractitionerRoutes.CLAIM_COUNT_PAGE.title
    );
  },
  validations() {
    const validations = {
      medicalServiceClaimsCount: {
        required,
      },
      hospitalVisitClaimsCount: {
        required,
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

      const medicalServiceClaims = [];
      const medicalServiceClaimsCount = parseInt(this.medicalServiceClaimsCount);
      const existingMedicalServiceClaims = this.$store.state.payPractitionerForm.medicalServiceClaims ? cloneDeep(this.$store.state.payPractitionerForm.medicalServiceClaims) : [];

      for (let i = 0; i < medicalServiceClaimsCount; i++) {
        medicalServiceClaims.push({
          serviceDate: null,
          numberOfServices: null,
          serviceClarificationCode: null,
          feeItem: null,
          amountBilled: null,
          calledStartTime: null,
          renderedFinishTime: null,
          diagnosticCode: null,
          locationOfService: null,
          correspondenceAttached: null,
          submissionCode: null,
          notes: null,
        });
      }
      
      if (existingMedicalServiceClaims && existingMedicalServiceClaims.length > 0) {
        const maxClaims = Math.min(medicalServiceClaims.length, existingMedicalServiceClaims.length);
        for (let i = 0; i < maxClaims; i++) {
          Object.assign(medicalServiceClaims[i], existingMedicalServiceClaims[i]);
        }
      }
      
      const hospitalVisitClaims = [];
      const hospitalVisitClaimsCount = parseInt(this.hospitalVisitClaimsCount);
      const existingHospitalVisitClaims = this.$store.state.payPractitionerForm.hospitalVisitClaims ? cloneDeep(this.$store.state.payPractitionerForm.hospitalVisitClaims) : [];

      for (let i = 0; i < hospitalVisitClaimsCount; i++) {
        hospitalVisitClaims.push({
          month: null,
          dayFrom: null,
          dayTo: null,
          year: null,
          numberOfServices: null,
          serviceClarificationCode: null,
          feeItem: null,
          amountBilled: null,
          diagnosticCode: null,
          locationOfService: null,
          correspondenceAttached: null,
          submissionCode: null,
          notes: null,
        });
      }

      if (existingHospitalVisitClaims && existingHospitalVisitClaims.length > 0) {
        const maxClaims = Math.min(hospitalVisitClaims.length, existingHospitalVisitClaims.length);
        for (let i = 0; i < maxClaims; i++) {
          Object.assign(hospitalVisitClaims[i], existingHospitalVisitClaims[i]);
        }
      }

      this.$store.dispatch(formModule + '/' + SET_MEDICAL_SERVICE_CLAIMS_COUNT, this.medicalServiceClaimsCount);
      this.$store.dispatch(formModule + '/' + SET_HOSPITAL_VISIT_CLAIMS_COUNT, this.hospitalVisitClaimsCount);
      this.$store.dispatch(formModule + '/' + SET_MEDICAL_SERVICE_CLAIMS, medicalServiceClaims);
      this.$store.dispatch(formModule + '/' + SET_HOSPITAL_VISIT_CLAIMS, hospitalVisitClaims);
      
      // Navigate to next path
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPractitionerRoutes.MAIN_FORM_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (to.path === payPractitionerRoutes.HOME_PAGE.path) {
      this.$store.dispatch(formModule + '/' + RESET_FORM);
      next();
    } else if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPractitionerRoutes.CLAIM_COUNT_PAGE.path
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

<style scoped>

</style>
