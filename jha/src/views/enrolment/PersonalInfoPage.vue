<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Add personal information and upload documents</h1>
        <h2>Account Holder basic information</h2>
        <p>After enrolment, the main applicant will be the Medical Services Plan Account Holder, and will be responsible for maintaining the Medical Services Plan account and requesting any changes.</p>
        <hr class="mt-0"/>
        <Input label="First name"
          id="first-name"
          class="mb-3"
          v-model="firstName" />
        <Input label="Middle name (optional)"
          id="middle-name"
          class="mb-3"
          v-model="middleName" />
        <Input label="Last name"
          id="last-name"
          class="mb-3"
          v-model="lastName" />
        <DateInput label="Birthdate"
          id="birthdate"
          class="mb-3"
          v-model="birthdate" />
        <DigitInput label="Social Insurance Number (SIN)"
          id="social-insurance-number"
          class="mb-3"
          v-model="socialInsuranceNumber"/>
        <Radio label="Gender"
          id="gender"
          name="gender"
          class="mb-3"
          v-model="gender"
          :items="genderOptions" />
        
        <h2>Your status in Canada</h2>
        <p>Please provide you immigration status information. You will be required to upload documents to support your status in Canada.</p>
        <hr/>
        <Select label="Immigration status in Canada"
          id="immigration-status"
          class="mb-3"
          v-model="immigrationStatus"
          :options="immigrationStatusOptions"/>
        <Radio name="citizen-status-reason"
          class="mb-3"
          v-model="citizenStatusReason"
          :items="citizenStatusReasonOptions" />
        
        <h2>Documents</h2>
        <p>Provide one of the following documents to support your status in Canada. If your name has changed since your ID was issued you are also required to upload document to support the name change.</p>
        <hr/>
        <Select label="Document Type"
          id="citizen-support-document-type"
          class="mb-3"
          v-model="citizenshipSupportDocumentType"
          :options="citizenshipSupportDocumentsOptions" />
        <div v-if="citizenshipSupportDocumentType">
          <h2>{{citizenshipSupportDocumentType}}</h2>
          <hr/>
          <FileUploader v-model="citizenshipSupportDocuments" />
        </div>

        <Radio label="Has your name changed since your ID was issued due to marriage or legal name change?"
          id="name-change"
          name="name-change"
          class="mb-3"
          v-model="isNameChanged"
          :items="radioOptionsNoYes" />
        <div v-if="isNameChanged === 'Y'"
          class="tabbed-section">
          <h2>Additional Documents</h2>
          <p>Provide one of the required documents to support your name change.</p>
          <ul>
            <li>Marriage Certificate</li>
            <li>Legal Name Change Certificate</li>
          </ul>
          <hr/>
          <Select label="Document Type"
            id="name-change-doc-type"
            class="mb-3"
            v-model="nameChangeSupportDocumentType"
            :options="nameChangeSupportDocumentOptions"/>
          <div v-if="nameChangeSupportDocumentType">
            <h2>{{nameChangeSupportDocumentType}}</h2>
            <hr/>
            <FileUploader class="mb-3"
              v-model="nameChangeSupportDocuments"/>
          </div>
        </div>

        <h2>Moving Information</h2>
        <hr/>
        <Radio label="Have you moved to B.C. permanently?"
          class="mb-3"
          id="is-moved-to-bc-permanently"
          name="is-moved-to-bc-permanently"
          v-model="isMovedToBCPermanently"
          :items="radioOptionsNoYes"/>
        <div v-if="isMovedToBCPermanently === 'Y'"
          class="tabbed-section">
          <Select label="Which country are you moving from?"
            id="country-of-origin"
            class="mb-3"
            defaultOptionLabel="Please select a country"
            v-model="countryOfOrigin"/>
          <DateInput label="Arrival date in B.C."
            id="arrival-date-in-bc"
            class="mb-3"
            v-model="arrivalDateInBC" />
          <DateInput label="Arrival date in Canada"
            id="arrival-date-in-canada"
            class="mb-3"
            v-model="arrivalDateInCanada" />
        </div>
        <Radio label="Have you been outside B.C. for more than 30 days in total in the past 12 months?"
          class="mb-3"
          id="outside-bc-12-months"
          name="outside-bc-12-months"
          v-model="isOutsideBCInLast12Months"
          :items="radioOptionsNoYes">
          <template v-slot:description>
            <span class="field-description">If you have been living in B.C. for less than 12 months, please indicate any absences since arrival.</span>
          </template>
        </Radio>
        <div v-if="isOutsideBCInLast12Months === 'Y'"
          class="tabbed-section">
          <Input label="Reason for departure"
            id="departure-reason"
            class="mb-3"
            v-model="departureReason" />
          <Input label="Location"
            id="departure-location"
            class="mb-3"
            v-model="departureLocation" />
          <DateInput label="Departure date"
            id="departure-begin-date"
            class="mb-3"
            v-model="departureBeginDate" />
          <DateInput label="Return date"
            id="departure-return-date"
            class="mb-3"
            v-model="departureReturnDate" />
        </div>
        <Radio label="Do you have a previous B.C. Personal Health Number?"
          class="mb-3"
          id="has-previous-phn"
          name="has-previous-phn"
          v-model="hasPreviousPHN"
          :items="radioOptionsNoYes"/>
        <div v-if="hasPreviousPHN === 'Y'"
          class="tabbed-section">
          <PhnInput label="Your previous B.C. Personal Health Number (optional)"
            id="previous-phn"
            class="mb-3"
            v-model="previousPHN"/>
        </div>
        <Radio label="Have you been released from the Canadian Armed Forces or an institution?"
          class="mb-3"
          id="is-released-from-armed-forces"
          name="is-released-from-armed-forces"
          v-model="isReleasedFromArmedForces"
          :items="radioOptionsNoYes"/>
        <div v-if="isReleasedFromArmedForces === 'Y'"
          class="tabbed-section">
          <DateInput label="Discharge date"
            id="armed-forces-discharge-date"
            class="mb-3"
            v-model="armedForcesDischargeDate"/>
        </div>
        <Radio label="Are you a full-time student in B.C.?"
          class="mb-3"
          id="is-student"
          name="is-student"
          v-model="isStudent"
          :items="radioOptionsNoYes"/>
        <div v-if="isStudent === 'Y'"
          class="tabbed-section">
          <Radio label="Will you reside in B.C. upon completion of your studies?"
            id="will-student-reside-in-bc"
            name="will-student-reside-in-bc"
            class="mb-3"
            v-model="willStudentResideInBC"
            :items="radioOptionsNoYes"/>
        </div>
      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
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
  MODULE_NAME as formModule,
  RESET_FORM,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import {
  ContinueBar,
  DateInput,
  DigitInput,
  FileUploader,
  Input,
  PageContent,
  PhnInput,
  Radio,
  Select,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import {
  radioOptionsGender,
  radioOptionsCitizenStatusReasons,
  radioOptionsNoYes,
} from '@/constants/radio-options';
import {
  selectOptionsImmigrationStatus,
  selectOptionsCitizenshipSupportDocuments,
  selectOptionsNameChangeSupportDocuments,
} from '@/constants/select-options';

export default {
  name: 'PersonalInfoPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    DateInput,
    DigitInput,
    FileUploader,
    Input,
    PageContent,
    PhnInput,
    Radio,
    Select,
  },
  data: () => {
    return {
      // Radio and Select options.
      genderOptions: radioOptionsGender,
      immigrationStatusOptions: selectOptionsImmigrationStatus,
      citizenStatusReasonOptions: radioOptionsCitizenStatusReasons,
      citizenshipSupportDocumentsOptions: selectOptionsCitizenshipSupportDocuments,
      radioOptionsNoYes: radioOptionsNoYes,
      nameChangeSupportDocumentOptions: selectOptionsNameChangeSupportDocuments,
      // Data to be saved.
      firstName: null,
      middleName: null,
      lastName: null,
      birthdate: null,
      socialInsuranceNumber: null,
      gender: null,
      immigrationStatus: null,
      citizenStatusReason: null,
      citizenshipSupportDocumentType: null,
      citizenshipSupportDocuments: [],
      isNameChanged: null,
      nameChangeSupportDocumentType: null,
      nameChangeSupportDocuments: [],
      isMovedToBCPermanently: null,
      countryOfOrigin: null,
      arrivalDateInBC: null,
      arrivalDateInCanada: null,
      isOutsideBCInLast12Months: null,
      departureReason: null,
      departureLocation: null,
      departureBeginDate: null,
      departureReturnDate: null,
      hasPreviousPHN: null,
      previousPHN: null,
      isReleasedFromArmedForces: null,
      armedForcesDischargeDate: null,
      isStudent: null,
      willStudentResideInBC: null,
    };
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.PERSONAL_INFO_PAGE.path,
      enrolmentRoutes.PERSONAL_INFO_PAGE.title
    );
  },
  validations() {
    const validations = {};
    return validations;
  },
  methods: {
    validateFields() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        scrollToError();
        return;
      }

      this.navigateToNextPage();
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SPOUSE_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
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
        enrolmentRoutes.PERSONAL_INFO_PAGE.path
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
