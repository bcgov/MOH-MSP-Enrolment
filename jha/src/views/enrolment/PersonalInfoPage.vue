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
          v-model="firstName"
          maxlength="30"
          @blur="handleBlurField($v.firstName)" />
        <div class="text-danger"
          v-if="$v.firstName.$dirty
            && !$v.firstName.required"
          aria-live="assertive">First name is required.</div>
        <div class="text-danger"
          v-if="$v.firstName.$dirty
            && !$v.firstName.nameValidator"
          aria-live="assertive">First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.<br/>First name must be a letter.</div>
        <Input label="Middle name (optional)"
          id="middle-name"
          class="mt-3"
          v-model="middleName"
          maxlength="30"
          @blur="handleBlurField($v.middleName)" />
        <div class="text-danger"
          v-if="$v.middleName.$dirty
            && !$v.middleName.nameValidator"
          aria-live="assertive">Middle name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.<br/>Middle name must be a letter.</div>
        <Input label="Last name"
          id="last-name"
          class="mt-3"
          v-model="lastName"
          maxlength="30"
          @blur="handleBlurField($v.lastName)" />
        <div class="text-danger"
          v-if="$v.lastName.$dirty
            && !$v.lastName.required"
          aria-live="assertive">Last name is required.</div>
        <div class="text-danger"
          v-if="$v.lastName.$dirty
            && !$v.lastName.nameValidator"
          aria-live="assertive">Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.<br/>Last name must be a letter.</div>
        <DateInput label="Birthdate"
          id="birthdate"
          class="mt-3"
          v-model="birthdate"
          @blur="handleBlurField($v.birthdate)"
          @processDate="handleProcessBirthdate($event)" />
        <div class="text-danger"
          v-if="$v.birthdate.$dirty
            && !$v.birthdate.required"
          aria-live="assertive">Birthdate is required.</div>
        <div class="text-danger"
          v-if="$v.birthdate.$dirty
            && !$v.birthdate.dateDataValidator"
          aria-live="assertive">Birthdate is invalid.</div>
        <div class="text-danger"
          v-if="$v.birthdate.$dirty
            && !$v.birthdate.distantPastValidator"
          aria-live="assertive">Birthdate is invalid.</div>
        <div class="text-danger"
          v-if="$v.birthdate.$dirty
            && !$v.birthdate.birthdate16YearsValidator"
          aria-live="assertive">An applicant must be 16 years or older.</div>
        <div v-if="requestSocialInsuranceNumber">
          <DigitInput label="Social Insurance Number (SIN)"
            id="social-insurance-number"
            class="mt-3"
            v-model="socialInsuranceNumber"
            @blur="handleBlurField($v.socialInsuranceNumber)" />
          <div class="text-danger"
            v-if="$v.socialInsuranceNumber.$dirty
              && !$v.socialInsuranceNumber.required"
            aria-live="assertive">Social insurance number is required.</div>
        </div>
        <Radio label="Gender"
          id="gender"
          name="gender"
          class="mt-3"
          v-model="gender"
          :items="genderOptions"
          @blur="handleBlurField($v.gender)" />
        <div class="text-danger"
          v-if="$v.gender.$dirty
            && !$v.gender.required"
          aria-live="assertive">Gender is required.</div>
        
        <h2 class="mt-4">Your status in Canada</h2>
        <p>Please provide you immigration status information. You will be required to upload documents to support your status in Canada.</p>
        <hr/>
        <Select label="Immigration status in Canada"
          id="immigration-status"
          v-model="citizenshipStatus"
          :options="citizenshipStatusOptions"
          @blur="handleBlurField($v.citizenshipStatus)"/>
        <div class="text-danger"
          v-if="$v.citizenshipStatus.$dirty
            && !$v.citizenshipStatus.required"
          aria-live="assertive">Immigration status in Canada is required.</div>
        <div v-if="citizenshipStatus === StatusInCanada.Citizen
            || citizenshipStatus === StatusInCanada.PermanentResident">
          <Radio name="citizen-status-reason"
            class="mt-3"
            v-model="citizenshipStatusReason"
            :items="citizenshipStatusReasonOptions"
            @blur="handleBlurField($v.citizenshipStatusReason)" />
          <div class="text-danger"
            v-if="$v.citizenshipStatusReason.$dirty
              && !$v.citizenshipStatusReason.required"
            aria-live="assertive">This field is required.</div>
        </div>
        <div v-if="citizenshipStatus === StatusInCanada.TemporaryResident">
          <Radio name="citizen-status-reason"
            class="mt-3"
            v-model="citizenshipStatusReason"
            :items="temporaryResidentStatusReasonOptions"
            @blur="handleBlurField($v.citizenshipStatusReason)" />
          <div class="text-danger"
            v-if="$v.citizenshipStatusReason.$dirty
              && !$v.citizenshipStatusReason.required"
            aria-live="assertive">This field is required.</div>
        </div>
        
        <div v-if="isCitizenshipDocsShown">
          <h2 class="mt-4">Documents</h2>
          <p>Provide one of the following documents to support your status in Canada. If your name has changed since your ID was issued you are also required to upload document to support the name change.</p>
          <hr/>
          <Select label="Document Type"
            id="citizen-support-document-type"
            v-model="citizenshipSupportDocumentType"
            :options="citizenshipSupportDocumentsOptions"
            @blur="handleBlurField($v.citizenshipSupportDocumentType)" />
          <div class="text-danger"
            v-if="$v.citizenshipSupportDocumentType.$dirty
              && !$v.citizenshipSupportDocumentType.required"
            aria-live="assertive">Document Type is required.</div>
          <div v-if="citizenshipSupportDocumentType"
            class="mt-3">
            <h2 class="mt-4">{{citizenshipSupportDocumentType}}</h2>
            <hr/>
            <div class="row">
              <div class="col-md-7">
                <FileUploader v-model="citizenshipSupportDocuments" />
                <div class="text-danger mt-3"
                  v-if="$v.citizenshipSupportDocuments.$dirty
                    && !$v.citizenshipSupportDocuments.required"
                  aria-live="assertive">You must include documentation for your application.</div>
              </div>
              <div class="col-md-5">
                <TipBox title="Tip">
                  <p>Scan the document, or take a photo of it.</p>
                  <p>Make sure that it's:</p>
                  <ul>
                    <li>The entire document, from corner to corner</li>
                    <li>Rotated correctly (not upside down or sideways</li>
                    <li>In focus and easy to read</li>
                    <li>A JPG, PNG, GIF, BMP or PDF file</li>
                  </ul>
                </TipBox>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isCitizenshipDocsShown">
          <Radio label="Has your name changed since your ID was issued due to marriage or legal name change?"
            id="name-change"
            name="name-change"
            class="mt-3"
            v-model="isNameChanged"
            :items="radioOptionsNoYes"
            @blur="handleBlurField($v.isNameChanged)" />
          <div class="text-danger"
            v-if="$v.isNameChanged.$dirty
              && !$v.isNameChanged.required"
            aria-live="assertive">This field is required.</div>
        </div>
        <div v-if="isNameChanged === 'Y'"
          class="tabbed-section mt-3">
          <h2 class="mt-4">Additional Documents</h2>
          <p>Provide one of the required documents to support your name change.</p>
          <ul>
            <li>Marriage Certificate</li>
            <li>Legal Name Change Certificate</li>
          </ul>
          <hr/>
          <Select label="Document Type"
            id="name-change-doc-type"
            class="mt-3"
            v-model="nameChangeSupportDocumentType"
            :options="nameChangeSupportDocumentOptions"
            @blur="handleBlurField($v.nameChangeSupportDocumentType)"/>
          <div class="text-danger"
            v-if="$v.nameChangeSupportDocumentType.$dirty
              && !$v.nameChangeSupportDocumentType.required"
            aria-live="assertive">Document Type is required.</div>
          <div v-if="nameChangeSupportDocumentType">
            <h2 class="mt-4">{{nameChangeSupportDocumentType}}</h2>
            <hr/>
            <div class="row">
              <div class="col-md-7">
                <FileUploader v-model="nameChangeSupportDocuments"/>
                <div class="text-danger"
                  v-if="$v.nameChangeSupportDocuments.$dirty
                    && !$v.nameChangeSupportDocuments.required"
                  aria-live="assertive">You must include documentation for your application.</div>
              </div>
              <div class="col-md-5">
                <TipBox title="Tip">
                  <p>Scan the document, or take a photo of it.</p>
                  <p>Make sure that it's:</p>
                  <ul>
                    <li>The entire document, from corner to corner</li>
                    <li>Rotated correctly (not upside down or sideways</li>
                    <li>In focus and easy to read</li>
                    <li>A JPG, PNG, GIF, BMP or PDF file</li>
                  </ul>
                </TipBox>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isMovingInformationShown">
          <h2 class="mt-4">Moving Information</h2>
          <hr class="mb-0"/>
          <div class="row">
            <div class="col-md-7">
              <div v-if="requestLivedInBCSinceBirth">
                <Radio label="Have you lived in B.C. since birth?"
                  id="has-live-in-bc-since-birth"
                  name="has-live-in-bc-since-birth"
                  class="mt-3"
                  v-model="hasLivedInBCSinceBirth"
                  :items="radioOptionsNoYes"
                  @blur="handleBlurField($v.hasLivedInBCSinceBirth)"/>
                <div class="text-danger"
                  v-if="$v.hasLivedInBCSinceBirth.$dirty
                    && !$v.hasLivedInBCSinceBirth.required"
                  aria-live="assertive">This field is required.</div>
              </div>
              <div v-if="requestPermanentMoveInfo">
                <Radio label="Have you moved to B.C. permanently?"
                  id="is-moved-to-bc-permanently"
                  name="is-moved-to-bc-permanently"
                  class="mt-3"
                  v-model="isMovedToBCPermanently"
                  :items="radioOptionsNoYes"
                  @blur="handleBlurField($v.isMovedToBCPermanently)"/>
                <div class="text-danger"
                  v-if="$v.isMovedToBCPermanently.$dirty
                    && !$v.isMovedToBCPermanently.required"
                  aria-live="assertive">This field is required.</div>
                <div class="text-danger"
                  v-if="isMovedToBCPermanently === 'N'"
                  aria-live="assertive">You have indicated that a recent move to B.C. is not permanent. As a result, you are not eligible for enrolment in the Medical Services Plan. Please contact <a href="https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us" target="_blank">Health Insurance BC</a> for further information.</div>
              </div>
              <div v-if="canContinueProcess">
                <div v-if="requestProvinceMoveInfo">
                  <RegionSelect label="Which province are you moving from?"
                    id="province-of-origin"
                    class="mt-3"
                    country="Canada"
                    defaultOptionLabel="Please select a province"
                    v-model="moveFromOrigin"
                    @blur="handleBlurField($v.moveFromOrigin)"/>
                  <div class="text-danger"
                    v-if="$v.moveFromOrigin.$dirty
                      && !$v.moveFromOrigin.required"
                    aria-live="assertive">Province of origin is required.</div>
                  <div class="text-danger"
                    v-if="$v.moveFromOrigin.$dirty
                      && !$v.moveFromOrigin.nonBCValidator"
                    aria-live="assertive">Province of origin cannot be British Columbia.</div>
                </div>
                <div v-else-if="requestCountryMoveInfo">
                  <CountrySelect label="Which country are you moving from?"
                    id="country-of-origin"
                    class="mt-3"
                    defaultOptionLabel="Please select a country"
                    v-model="moveFromOrigin"
                    @blur="handleBlurField($v.moveFromOrigin)"/>
                  <div class="text-danger"
                    v-if="$v.moveFromOrigin.$dirty
                      && !$v.moveFromOrigin.required"
                    aria-live="assertive">Country of origin is required.</div>
                </div>
                <div v-if="requestArrivalInBCInfo">
                  <DateInput label="Arrival date in B.C."
                    id="arrival-date-in-bc"
                    class="mt-3"
                    v-model="arrivalDateInBC"
                    @blur="handleBlurField($v.arrivalDateInBC)" />
                  <div class="text-danger"
                    v-if="$v.arrivalDateInBC.$dirty
                      && !$v.arrivalDateInBC.required"
                    aria-live="assertive">Arrival date in B.C. is required.</div>
                </div>
                <div v-if="requestArrivalInCanadaInfo">
                  <DateInput :label="`Arrival date in Canada${citizenshipStatusReason === CanadianStatusReasons.MovingFromCountry ? '' : ' (optional)'}`"
                    id="arrival-date-in-canada"
                    class="mt-3"
                    v-model="arrivalDateInCanada"
                    @blur="handleBlurField($v.arrivalDateInCanada)" />
                  <div class="text-danger"
                    v-if="$v.arrivalDateInCanada.$dirty
                      && !$v.arrivalDateInCanada.required"
                    aria-live="assertive">Arrival date in Canada is required.</div>
                </div>
                <div v-if="requestProvHealthNumber">
                  <Input label="Health Number from that province (optional)"
                    id="previous-health-number"
                    class="mt-3"
                    v-model="previousHealthNumber"
                    @blur="handleBlurField($v.previousHealthNumber)" />
                </div>
                <div>
                  <Radio label="Have you been outside B.C. for more than 30 days in total in the past 12 months?"
                    class="mt-3"
                    id="outside-bc-12-months"
                    name="outside-bc-12-months"
                    v-model="isOutsideBCInLast12Months"
                    :items="radioOptionsNoYes"
                    @blur="handleBlurField($v.isOutsideBCInLast12Months)">
                    <template v-slot:description>
                      <span class="field-description">If you have been living in B.C. for less than 12 months, please indicate any absences since arrival.</span>
                    </template>
                  </Radio>
                  <div class="text-danger"
                    v-if="$v.isOutsideBCInLast12Months.$dirty
                      && !$v.isOutsideBCInLast12Months.required"
                    aria-live="assertive">This field is required.</div>
                </div>
                <div v-if="isOutsideBCInLast12Months === 'Y'"
                  class="tabbed-section">
                  <Input label="Reason for departure"
                    id="departure-reason"
                    class="mt-3"
                    v-model="departureReason"
                    maxlength="20"
                    @blur="handleBlurField($v.departureReason)" />
                  <div class="text-danger"
                    v-if="$v.departureReason.$dirty
                      && !$v.departureReason.required"
                    aria-live="assertive">Reason for departure is required.</div>
                  <Input label="Location"
                    id="departure-location"
                    class="mt-3"
                    v-model="departureLocation"
                    maxlength="20"
                    @blur="handleBlurField($v.departureLocation)" />
                  <div class="text-danger"
                    v-if="$v.departureLocation.$dirty
                      && !$v.departureLocation.required"
                    aria-live="assertive">Location is required.</div>
                  <DateInput label="Departure date"
                    id="departure-begin-date"
                    class="mt-3"
                    v-model="departureBeginDate"
                    @blur="handleBlurField($v.departureBeginDate)" />
                  <div class="text-danger"
                    v-if="$v.departureBeginDate.$dirty
                      && !$v.departureBeginDate.required"
                    aria-live="assertive">Departure date is required.</div>
                  <DateInput label="Return date"
                    id="departure-return-date"
                    class="mt-3"
                    v-model="departureReturnDate"
                    @blur="handleBlurField($v.departureReturnDate)" />
                  <div class="text-danger"
                    v-if="$v.departureReturnDate.$dirty
                      && !$v.departureReturnDate.required"
                    aria-live="assertive">Return date is required.</div>
                </div>
                <div>
                  <Radio label="Do you have a previous B.C. Personal Health Number?"
                    class="mt-3"
                    id="has-previous-phn"
                    name="has-previous-phn"
                    v-model="hasPreviousPHN"
                    :items="radioOptionsNoYes"
                    @blur="handleBlurField($v.hasPreviousPHN)"/>
                  <div class="text-danger"
                    v-if="$v.hasPreviousPHN.$dirty
                      && !$v.hasPreviousPHN.required"
                    aria-live="assertive">This field is required.</div>
                </div>
                <div v-if="hasPreviousPHN === 'Y'"
                  class="tabbed-section">
                  <PhnInput label="Your previous B.C. Personal Health Number (optional)"
                    id="previous-phn"
                    class="mt-3"
                    v-model="previousPHN"
                    @blur="handleBlurField($v.previousPHN)"/>
                  <div class="text-danger"
                    v-if="$v.previousPHN.$dirty
                      && !$v.previousPHN.phnValidator"
                    aria-live="assertive">Personal Health Number is not valid.</div>
                </div>
                <div v-if="requestArmedForceInfo">
                  <Radio label="Have you been released from the Canadian Armed Forces or an institution?"
                    class="mt-3"
                    id="is-released-from-armed-forces"
                    name="is-released-from-armed-forces"
                    v-model="isReleasedFromArmedForces"
                    :items="radioOptionsNoYes"
                    @blur="handleBlurField($v.isReleasedFromArmedForces)"/>
                  <div class="text-danger"
                    v-if="$v.isReleasedFromArmedForces.$dirty
                      && !$v.isReleasedFromArmedForces.required"
                    aria-live="assertive">This field is required.</div>
                </div>
                <div v-if="isReleasedFromArmedForces === 'Y'"
                  class="tabbed-section">
                  <DateInput label="Discharge date"
                    id="armed-forces-discharge-date"
                    class="mt-3"
                    v-model="armedForcesDischargeDate"
                    @blur="handleBlurField($v.armedForcesDischargeDate)"/>
                  <div class="text-danger"
                    v-if="$v.armedForcesDischargeDate.$dirty
                      && !$v.armedForcesDischargeDate.required"
                    aria-live="assertive">Discharge date is required.</div>
                </div>
                <div>
                  <Radio label="Are you a full-time student in B.C.?"
                    class="mt-3"
                    id="is-student"
                    name="is-student"
                    v-model="isStudent"
                    :items="radioOptionsNoYes"
                    @blur="handleBlurField($v.isStudent)"/>
                  <div class="text-danger"
                    v-if="$v.isStudent.$dirty
                      && !$v.isStudent.required"
                    aria-live="assertive">This field is required.</div>
                </div>
                <div v-if="isStudent === 'Y'"
                  class="tabbed-section">
                  <Radio label="Will you reside in B.C. upon completion of your studies?"
                    id="will-student-reside-in-bc"
                    name="will-student-reside-in-bc"
                    class="mt-3"
                    v-model="willStudentResideInBC"
                    :items="radioOptionsNoYes"
                    @blur="handleBlurField($v.willStudentResideInBC)"/>
                  <div class="text-danger"
                  v-if="$v.willStudentResideInBC.$dirty
                    && !$v.willStudentResideInBC.required"
                  aria-live="assertive">This field is required.</div>
                </div>
              </div>
            </div>

            <div class="col-md-5 mt-3">
              <TipBox>
                <p>A permanent move means that you intend to make B.C. your primary residence for 6 months or longer.</p>
              </TipBox>
            </div>
          </div>
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
  SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH,
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
  CountrySelect,
  DateInput,
  DigitInput,
  FileUploader,
  Input,
  PageContent,
  PhnInput,
  Radio,
  RegionSelect,
  Select,
  distantPastValidator,
  optionalValidator,
  phnValidator,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import {
  radioOptionsGender,
  radioOptionsCitizenStatusReasons,
  radioOptionsAHTemporaryResidentStatusReasons,
  radioOptionsNoYes,
} from '@/constants/radio-options';
import {
  selectOptionsImmigrationStatus,
  selectOptionsCitizenshipSupportDocuments,
  selectOptionsPermanentResidentSupportDocuments,
  selectOptionsNameChangeSupportDocuments,
  selectOptionWorkPermitSupportDocument,
  selectOptionStudyPermitSupportDocument,
  selectOptionReligiousWorkSupportDocument,
  selectOptionDiplomaticFoilSupportDocument,
  selectOptionVisitorVisaSupportDocument,
} from '@/constants/select-options';
import {
  required,
  requiredIf,
} from 'vuelidate/lib/validators';
import {
  dateDataRequiredValidator,
  dateDataValidator,
  nameValidator,
  nonBCValidator,
  yesValidator,
} from '@/helpers/validators';
import {
  CanadianStatusReasons,
  StatusInCanada,
} from '@/constants/immigration-status-types';
import TipBox from '@/components/TipBox.vue';
import {
  isBefore,
  isSameDay,
  startOfToday,
  subYears,
} from 'date-fns';

const birthdate16YearsValidator = (value) => {
  const sixteenYearsAgo = subYears(startOfToday(), 16);
  return isSameDay(sixteenYearsAgo, value) || isBefore(value, sixteenYearsAgo);
};

export default {
  name: 'PersonalInfoPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    CountrySelect,
    DateInput,
    DigitInput,
    FileUploader,
    Input,
    PageContent,
    PhnInput,
    Radio,
    RegionSelect,
    Select,
    TipBox,
  },
  data: () => {
    return {
      isPageLoaded: false,
      // Constants.
      StatusInCanada,
      CanadianStatusReasons,
      // Radio and Select options.
      genderOptions: radioOptionsGender,
      citizenshipStatusOptions: selectOptionsImmigrationStatus,
      citizenshipStatusReasonOptions: radioOptionsCitizenStatusReasons,
      temporaryResidentStatusReasonOptions: radioOptionsAHTemporaryResidentStatusReasons,
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
      hasLivedInBCSinceBirth: null,
      isMovedToBCPermanently: null,
      moveFromOrigin: null,
      arrivalDateInBC: null,
      arrivalDateInCanada: null,
      previousHealthNumber: null,
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

      // Date data which is processed by date validators:
      birthdateData: null,
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
    this.hasLivedInBCSinceBirth = this.$store.state.enrolmentModule.ahHasLivedInBCSinceBirth;
    this.isMovedToBCPermanently = this.$store.state.enrolmentModule.ahIsMovedToBCPermanently;
    this.moveFromOrigin = this.$store.state.enrolmentModule.ahMoveFromOrigin;
    this.arrivalDateInBC = this.$store.state.enrolmentModule.ahArrivalDateInBC;
    this.arrivalDateInCanada = this.$store.state.enrolmentModule.ahArrivalDateInCanada;
    this.previousHealthNumber = this.$store.state.enrolmentModule.previousHealthNumber;
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

    this.$nextTick(() => {
      this.isPageLoaded = true;
    })
  },
  validations() {
    const validations = {
      firstName: {
        required,
        nameValidator: optionalValidator(nameValidator),
      },
      middleName: {
        nameValidator: optionalValidator(nameValidator),
      },
      lastName: {
        required,
        nameValidator: optionalValidator(nameValidator),
      },
      birthdate: {
        required: dateDataRequiredValidator(this.birthdateData),
        dateDataValidator: dateDataValidator(this.birthdateData),
        distantPastValidator: optionalValidator(distantPastValidator),
        birthdate16YearsValidator: optionalValidator(birthdate16YearsValidator),
      },
      socialInsuranceNumber: {},
      gender: {
        required,
      },
      citizenshipStatus: {
        required,
      },
      citizenshipStatusReason: {
        required,
      },
      citizenshipSupportDocumentType: {
        required,
      },
      citizenshipSupportDocuments: {
        required,
      },
      isNameChanged: {
        required,
      },
      nameChangeSupportDocumentType: {},
      nameChangeSupportDocuments: {},
      hasLivedInBCSinceBirth: {},
      isMovedToBCPermanently: {},
      moveFromOrigin: {},
      arrivalDateInBC: {},
      arrivalDateInCanada: {},
      previousHealthNumber: {},
      isOutsideBCInLast12Months: {
        required,
      },
      departureReason: {},
      departureLocation: {},
      departureBeginDate: {},
      departureReturnDate: {},
      hasPreviousPHN: {
        required,
      },
      previousPHN: {
        phnValidator: optionalValidator(phnValidator),
      },
      isReleasedFromArmedForces: {},
      armedForcesDischargeDate: {},
      isStudent: {
        required,
      },
      willStudentResideInBC: {},
    };
    if (this.requestSocialInsuranceNumber) {
      validations.socialInsuranceNumber.required = required;
    }
    if (this.isNameChanged === 'Y') {
      validations.nameChangeSupportDocumentType.required = required;
      validations.nameChangeSupportDocuments.required = required;
    }
    if (this.requestLivedInBCSinceBirth) {
      validations.hasLivedInBCSinceBirth.required = required;
    }
    if (this.requestPermanentMoveInfo) {
      validations.isMovedToBCPermanently.required = required;
      validations.isMovedToBCPermanently.yesValidator = yesValidator;
    }
    if (this.requestCountryMoveInfo || this.requestProvinceMoveInfo) {
      validations.moveFromOrigin.required = required;
      if (this.requestProvinceMoveInfo) {
        validations.moveFromOrigin.nonBCValidator = nonBCValidator;
      }
    }
    if (this.requestArrivalInBCInfo) {
      validations.arrivalDateInBC.required = required;
    }
    if (this.requestArrivalInCanadaInfo) {
      validations.arrivalDateInCanada.required = requiredIf(() => {
        return this.citizenshipStatusReason === CanadianStatusReasons.MovingFromCountry;
      });
    }
    if (this.isOutsideBCInLast12Months === 'Y') {
      validations.departureReason.required = required;
      validations.departureLocation.required = required;
      validations.departureBeginDate.required = required;
      validations.departureReturnDate.required = required;
    }
    if (this.requestArmedForceInfo) {
      validations.isReleasedFromArmedForces.required = required;
    }
    if (this.isReleasedFromArmedForces === 'Y') {
      validations.armedForcesDischargeDate.required = required;
    }
    if (this.isStudent === 'Y') {
      validations.willStudentResideInBC.required = required;
    }
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
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH}`, this.hasLivedInBCSinceBirth);
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
    handleBlurField(validationObject) {
      if (validationObject) {
        validationObject.$touch();
      }
    },
    handleProcessBirthdate(data) {
      this.birthdateData = data;
    },
  },
  computed: {
    requestSocialInsuranceNumber() {
      return this.$store.state.enrolmentModule.isApplyingForFPCare
          || this.$store.state.enrolmentModule.isApplyingForSuppBen;
    },
    requestLivedInBCSinceBirth() {
      return this.citizenshipStatus === StatusInCanada.Citizen
          && this.citizenshipStatusReason === CanadianStatusReasons.LivingInBCWithoutMSP;
    },
    requestPermanentMoveInfo() {
      if (this.requestLivedInBCSinceBirth) {
        // Convert to boolean
        return !!this.hasLivedInBCSinceBirth;
      }
      return this.citizenshipStatus === StatusInCanada.Citizen
          || this.citizenshipStatus === StatusInCanada.PermanentResident
          || this.citizenshipStatus === StatusInCanada.TemporaryResident;
    },
    requestProvinceMoveInfo() {
      return (this.citizenshipStatus === StatusInCanada.Citizen
          && (this.citizenshipStatusReason === CanadianStatusReasons.MovingFromProvince
            || ( this.citizenshipStatusReason === CanadianStatusReasons.LivingInBCWithoutMSP
              && this.hasLivedInBCSinceBirth === 'N')
            )
          )
          || ( this.citizenshipStatus === StatusInCanada.PermanentResident
            && this.citizenshipStatusReason === CanadianStatusReasons.MovingFromProvince);
    },
    requestCountryMoveInfo() {
      return ( this.citizenshipStatus === StatusInCanada.Citizen
            || this.citizenshipStatus === StatusInCanada.PermanentResident)
          && this.citizenshipStatusReason === CanadianStatusReasons.MovingFromCountry;
    },
    requestArrivalInBCInfo() {
      return ((this.citizenshipStatus === StatusInCanada.Citizen
            || this.citizenshipStatus === StatusInCanada.PermanentResident
          ) && (this.citizenshipStatusReason === CanadianStatusReasons.MovingFromProvince
            || this.citizenshipStatusReason === CanadianStatusReasons.MovingFromCountry)
          )
          || this.citizenshipStatus === StatusInCanada.TemporaryResident;
    },
    requestArrivalInCanadaInfo() {
      if (this.requestLivedInBCSinceBirth) {
        return this.hasLivedInBCSinceBirth === 'N';
      }
      return true;
    },
    requestProvHealthNumber() {
      return this.citizenshipStatusReason === CanadianStatusReasons.MovingFromProvince
          && (this.citizenshipStatus === StatusInCanada.Citizen
            || this.citizenshipStatus === StatusInCanada.PermanentResident);
    },
    requestArmedForceInfo() {
      return this.citizenshipStatus === StatusInCanada.Citizen;
    },
    isMovingInformationShown() {
      return !!this.citizenshipStatus
          && !!this.citizenshipStatusReason
          && !!this.citizenshipSupportDocuments.length > 0
          && !!this.isNameChanged;
    },
    isCitizenshipDocsShown() {
      return !!this.citizenshipStatusReason;
    },
    citizenshipSupportDocumentsOptions() {
      if (this.citizenshipStatus === StatusInCanada.PermanentResident) {
        return selectOptionsPermanentResidentSupportDocuments;
      } else if (this.citizenshipStatus === StatusInCanada.TemporaryResident){
        if (this.citizenshipStatusReason === CanadianStatusReasons.WorkingInBC) {
          return selectOptionWorkPermitSupportDocument;
        } else if (this.citizenshipStatusReason === CanadianStatusReasons.StudyingInBC) {
          return selectOptionStudyPermitSupportDocument;
        } else if (this.citizenshipStatusReason === CanadianStatusReasons.ReligiousWorker) {
          return selectOptionReligiousWorkSupportDocument;
        } else if (this.citizenshipStatusReason === CanadianStatusReasons.Diplomat) {
          return selectOptionDiplomaticFoilSupportDocument;
        } else if (this.citizenshipStatusReason === CanadianStatusReasons.Visiting) {
          return selectOptionVisitorVisaSupportDocument;
        }
      } else {
        return selectOptionsCitizenshipSupportDocuments;
      }
      return [];
    },
    canContinueProcess() {
      if (this.isMovedToBCPermanently) {
        if (this.requestLivedInBCSinceBirth) {
          return this.hasLivedInBCSinceBirth
              && this.isMovedToBCPermanently === 'Y';
        }
        return this.isMovedToBCPermanently === 'Y'
            || this.citizenshipStatus === StatusInCanada.TemporaryResident;
      }
      return true;
    }
  },
  watch: {
    citizenshipStatus() {
      if (this.isPageLoaded) {
        this.citizenshipStatusReason = null;
        this.hasLivedInBCSinceBirth = null;
        this.previousHealthNumber = null;
        this.$v.citizenshipStatusReason.$reset();
        this.$v.hasLivedInBCSinceBirth.$reset();
        this.$v.previousHealthNumber.$reset();
      }
    },
    citizenshipStatusReason() {
      if (this.isPageLoaded) {
        this.citizenshipSupportDocumentType = null;
        this.isNameChanged = null;
        this.moveFromOrigin = null;
        this.arrivalDateInBC = null;
        this.arrivalDateInCanada = null;
        this.previousHealthNumber = null;
        this.$v.citizenshipSupportDocumentType.$reset();
        this.$v.isNameChanged.$reset();
        this.$v.moveFromOrigin.$reset();
        this.$v.arrivalDateInBC.$reset();
        this.$v.arrivalDateInCanada.$reset();
        this.$v.previousHealthNumber.$reset();
      }
    },
    citizenshipSupportDocumentType() {
      if (this.isPageLoaded) {
        this.citizenshipSupportDocuments = [];
        this.$v.citizenshipSupportDocuments.$reset();
      }
    },
    isNameChanged() {
      if (this.isPageLoaded) {
        this.nameChangeSupportDocumentType = null;
        this.$v.nameChangeSupportDocumentType.$reset();
      }
    },
    nameChangeSupportDocumentType() {
      if (this.isPageLoaded) {
        this.nameChangeSupportDocuments = [];
        this.$v.nameChangeSupportDocuments.$reset();
      }
    },
    hasLivedInBCSinceBirth() {
      if (this.isPageLoaded) {
        this.moveFromOrigin = null;
        this.arrivalDateInCanada = null;
        this.$v.moveFromOrigin.$reset();
        this.$v.arrivalDateInCanada.$reset();
      }
    },
    isMovedToBCPermanently() {
      if (this.isPageLoaded) {
        this.moveFromOrigin = null;
        this.arrivalDateInBC = null;
        this.arrivalDateInCanada = null;
        this.previousHealthNumber = null;
        this.isOutsideBCInLast12Months = null;
        this.hasPreviousPHN = null;
        this.isReleasedFromArmedForces = null;
        this.isStudent = null;
        this.$v.moveFromOrigin.$reset();
        this.$v.arrivalDateInBC.$reset();
        this.$v.arrivalDateInCanada.$reset();
        this.$v.previousHealthNumber.$reset();
        this.$v.isOutsideBCInLast12Months.$reset();
        this.$v.hasPreviousPHN.$reset();
        this.$v.isReleasedFromArmedForces.$reset();
        this.$v.isStudent.$reset();
      }
    },
    isOutsideBCInLast12Months() {
      if (this.isPageLoaded) {
        this.departureReason = null;
        this.departureLocation = null;
        this.departureBeginDate = null;
        this.departureReturnDate = null;
        this.$v.departureReason.$reset();
        this.$v.departureLocation.$reset();
        this.$v.departureBeginDate.$reset();
        this.$v.departureReturnDate.$reset();
      }
    },
    hasPreviousPHN() {
      if (this.isPageLoaded) {
        this.previousPHN = null;
        this.$v.previousPHN.$reset();
      }
    },
    isReleasedFromArmedForces() {
      if (this.isPageLoaded) {
        this.armedForcesDischargeDate = null;
        this.$v.armedForcesDischargeDate.$reset();
      }
    },
    isStudent() {
      if (this.isPageLoaded) {
        this.willStudentResideInBC = null;
        this.$v.willStudentResideInBC.$reset();
      }
    }
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
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
