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
          v-model="citizenshipStatus"
          :options="citizenshipStatusOptions"/>
        <Radio name="citizen-status-reason"
          class="mb-3"
          v-model="citizenshipStatusReason"
          :items="citizenshipStatusReasonOptions" />
        
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
            v-model="moveFromOrigin"/>
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
  MODULE_NAME as enrolmentModule,
  RESET_FORM,
  SET_AH_FIRST_NAME,
  SET_AH_MIDDLE_NAME,
  SET_AH_LAST_NAME,
  SET_AH_BIRTHDATE,
  SET_AH_SIN,
  SET_AH_GENDER,
  SET_AH_CITIZENSHIP_STATUS,
  SET_AH_CITIZENSHIP_STATUS_REASON,
  SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE,
  SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS,
  SET_AH_IS_NAME_CHANGED,
  SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE,
  SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS,
  SET_AH_IS_MOVED_TO_BC_PERMANENTLY,
  SET_AH_MOVE_FROM_ORIGIN,
  SET_AH_ARRIVAL_DATE_IN_BC,
  SET_AH_ARRIVAL_DATE_IN_CANADA,
  SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS,
  SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON,
  SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION,
  SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE,
  SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE,
  SET_AH_HAS_PREVIOUS_PHN,
  SET_AH_PREVIOUS_PHN,
  SET_AH_IS_RELEASED_FROM_ARMED_FORCES,
  SET_AH_ARMED_FORCES_DISCHARGE_DATE,
  SET_AH_IS_STUDENT,
  SET_AH_WILL_STUDENT_RESIDE_IN_BC,
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
      citizenshipStatusOptions: selectOptionsImmigrationStatus,
      citizenshipStatusReasonOptions: radioOptionsCitizenStatusReasons,
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
      citizenshipStatus: null,
      citizenshipStatusReason: null,
      citizenshipSupportDocumentType: null,
      citizenshipSupportDocuments: [],
      isNameChanged: null,
      nameChangeSupportDocumentType: null,
      nameChangeSupportDocuments: [],
      isMovedToBCPermanently: null,
      moveFromOrigin: null,
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
    this.firstName = this.$store.state.enrolmentModule.ahFirstName;
    this.middleName = this.$store.state.enrolmentModule.ahMiddleName;
    this.lastName = this.$store.state.enrolmentModule.ahLastName;
    this.birthdate = this.$store.state.enrolmentModule.ahBirthdate;
    this.socialInsuranceNumber = this.$store.state.enrolmentModule.ahSIN;
    this.gender = this.$store.state.enrolmentModule.ahGender;
    this.citizenshipStatus = this.$store.state.enrolmentModule.ahCitizenshipStatus;
    this.citizenshipStatusReason = this.$store.state.enrolmentModule.ahCitizenshipStatusReason;
    this.citizenshipSupportDocumentType = this.$store.state.enrolmentModule.ahCitizenshipSupportDocumentType;
    this.citizenshipSupportDocuments = this.$store.state.enrolmentModule.ahCitizenshipSupportDocuments;
    this.isNameChanged = this.$store.state.enrolmentModule.ahIsNameChanged;
    this.nameChangeSupportDocumentType = this.$store.state.enrolmentModule.ahNameChangeSupportDocumentType;
    this.nameChangeSupportDocuments = this.$store.state.enrolmentModule.ahNameChangeSupportDocuments;
    this.isMovedToBCPermanently = this.$store.state.enrolmentModule.ahIsMovedToBCPermanently;
    this.moveFromOrigin = this.$store.state.enrolmentModule.ahMoveFromOrigin;
    this.arrivalDateInBC = this.$store.state.enrolmentModule.ahArrivalDateInBC;
    this.arrivalDateInCanada = this.$store.state.enrolmentModule.ahArrivalDateInCanada;
    this.isOutsideBCInLast12Months = this.$store.state.enrolmentModule.ahIsOutsideBCLast12Months;
    this.departureReason = this.$store.state.enrolmentModule.ahOutsideBCLast12MonthsReason;
    this.departureLocation = this.$store.state.enrolmentModule.ahOutsideBCLast12MonthsLocation;
    this.departureBeginDate = this.$store.state.enrolmentModule.ahOutsideBCLast12MonthsDepartureDate;
    this.departureReturnDate = this.$store.state.enrolmentModule.ahOutsideBCLast12MonthsReturnDate;
    this.hasPreviousPHN = this.$store.state.enrolmentModule.ahHasPreviousPHN;
    this.previousPHN = this.$store.state.enrolmentModule.ahPreviousPHN;
    this.isReleasedFromArmedForces = this.$store.state.enrolmentModule.ahIsReleasedFromArmedForces;
    this.armedForcesDischargeDate = this.$store.state.enrolmentModule.ahArmedForcesDischargeDate;
    this.isStudent = this.$store.state.enrolmentModule.ahIsStudent;
    this.willStudentResideInBC = this.$store.state.enrolmentModule.ahWillStudentResideInBC;
    
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

      this.saveData();
      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_FIRST_NAME}`, this.firstName);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_MIDDLE_NAME}`, this.middleName);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_LAST_NAME}`, this.lastName);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_BIRTHDATE}`, this.birthdate);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_SIN}`, this.socialInsuranceNumber);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_GENDER}`, this.gender);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_CITIZENSHIP_STATUS}`, this.citizenshipStatus);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_CITIZENSHIP_STATUS_REASON}`, this.citizenshipStatusReason);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE}`, this.citizenshipSupportDocumentType);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS}`, this.citizenshipSupportDocuments);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_IS_NAME_CHANGED}`, this.isNameChanged);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE}`, this.nameChangeSupportDocumentType);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS}`, this.nameChangeSupportDocuments);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_IS_MOVED_TO_BC_PERMANENTLY}`, this.isMovedToBCPermanently);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_MOVE_FROM_ORIGIN}`, this.moveFromOrigin);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_ARRIVAL_DATE_IN_BC}`, this.arrivalDateInBC);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_ARRIVAL_DATE_IN_CANADA}`, this.arrivalDateInCanada);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS}`, this.isOutsideBCInLast12Months);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON}`, this.departureReason);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION}`, this.departureLocation);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE}`, this.departureBeginDate);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE}`, this.departureReturnDate);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_HAS_PREVIOUS_PHN}`, this.hasPreviousPHN);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_PREVIOUS_PHN}`, this.previousPHN);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_IS_RELEASED_FROM_ARMED_FORCES}`, this.isReleasedFromArmedForces);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_ARMED_FORCES_DISCHARGE_DATE}`, this.armedForcesDischargeDate);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_IS_STUDENT}`, this.isStudent);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_WILL_STUDENT_RESIDE_IN_BC}`, this.willStudentResideInBC);
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
      this.$store.dispatch(enrolmentModule + '/' + RESET_FORM);
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
