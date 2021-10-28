<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <!-- Spouse citizenship information  -->
        <h1>Add spouse information and upload documents</h1>
        <p>Do you have a spouse or common-law partner who also needs to enrol for MSP coverage? If so, you are required to provide spouse information and provide supporting documents.</p>
        <hr class="mt-0"/>
        <Radio
          id='has-spouse'
          name='has-spouse'
          label='Do you have a spouse or common-law partner?'
          v-model='hasSpouse'
          :items='radioOptionsNoYes' />
        <div class="text-danger"
          v-if="$v.hasSpouse.$dirty && !$v.hasSpouse.required"
          aria-live="assertive">Please indicate whether or not you have a spouse who needs to enrol.</div>
        <div v-if="hasSpouse === 'Y'" class="mt-3">
          <h2>Spouse or common-law partner</h2>
          <p>Please provide the spouse's personal information and immigration status in Canada. You will be required to upload supporting documents with your application.</p>
          <hr class="mt-0"/>
          <Select 
            id='spouse-status'
            name='spouse-status'
            label="Spouse's immigration status in Canada"
            class='mt-3'
            v-model='spouseStatus'
            :options='citizenshipStatusOptions' />
          <div class="text-danger"
            v-if="$v.spouseStatus.$dirty && !$v.spouseStatus.required"
            aria-live="assertive">Please select your spouse's immigration status.</div>
          <div v-if="spouseStatus === statusOptions.Citizen || spouseStatus === statusOptions.PermanentResident">
            <Radio
              id='spouse-status-reason'
              name='spouse-status-reason'
              label=''
              v-model='spouseStatusReason'
              :items='citizenshipStatusReasonOptions' />
            <div class="text-danger"
              v-if="$v.spouseStatusReason.$dirty && !$v.spouseStatusReason.required"
              aria-live="assertive">Please select one of the above.</div>
          </div>
          <div v-if="spouseStatus === statusOptions.TemporaryResident">
            <Radio
              id='spouse-status-reason'
              name='spouse-status-reason'
              label=''
              v-model='spouseStatusReason'
              :items='temporaryResidentStatusReasonOptions' />
            <div class="text-danger"
              v-if="$v.spouseStatusReason.$dirty && !$v.spouseStatusReason.required"
              aria-live="assertive">Please select one of the above.</div>
          </div>
          <div v-if="spouseStatusReason !== null && spouseStatusReason !== undefined" class="mt-3">
            <h2>Documents</h2>
            <p>Provide one of the following documents to support your status in Canada. If your name has changed since your ID was issued you are also required to upload document to support the name change.</p>
            <hr/>
            <Select 
              label="Document Type"
              name="citizen-support-document-type"
              id="citizen-support-document-type"
              class="mb-3"
              v-model="spouseCitizenshipSupportDocumentType"
              :options="citizenshipSupportDocumentOptions" />
            <div class="text-danger"
              v-if="$v.spouseCitizenshipSupportDocumentType.$dirty && !$v.spouseCitizenshipSupportDocumentType.required"
              aria-live="assertive">Please select one of the above.</div>
            <div v-if="spouseCitizenshipSupportDocumentType">
              <h2>{{spouseCitizenshipSupportDocumentType}}</h2>
              <hr/>
              <FileUploader v-model="spouseCitizenshipSupportDocuments" />
              <div class="text-danger"
                v-if="$v.spouseCitizenshipSupportDocuments.$dirty && !$v.spouseCitizenshipSupportDocuments.required"
                aria-live="assertive">File upload required.</div>
            </div>

            <Radio label="Has your spouse's name changed since your ID was issued due to marriage or legal name change?"
              id="name-change"
              name="name-change"
              class="mt-3 mb-3"
              v-model="spouseIsNameChanged"
              :items="radioOptionsNoYes" />
            <div class="text-danger"
              v-if="$v.spouseIsNameChanged.$dirty && !$v.spouseIsNameChanged.required"
              aria-live="assertive">Please indicate if your spouse's name changed.</div>
            <div v-if="spouseIsNameChanged === 'Y'"
              class="tabbed-section">
              <h2>Additional Documents</h2>
              <p>Provide one of the required documents to support the name change.</p>
              <ul>
                <li>Marriage Certificate</li>
                <li>Legal Name Change Certificate</li>
              </ul>
              <hr/>
              <Select 
                label="Document Type"
                name="name-change-doc-type"
                id="name-change-doc-type"
                class="mb-3"
                v-model="spouseNameChangeSupportDocumentType"
                :options="nameChangeSupportDocumentOptions"/>
              <div class="text-danger"
                v-if="$v.spouseNameChangeSupportDocumentType.$dirty && !$v.spouseNameChangeSupportDocumentType.required"
                aria-live="assertive">Please select one of the above.</div>
              <div v-if="spouseNameChangeSupportDocumentType">
                <h2>{{spouseNameChangeSupportDocumentType}}</h2>
                <hr/>
                <FileUploader class="mb-3"
                  v-model="spouseNameChangeSupportDocuments"/>
                <div class="text-danger"
                  v-if="$v.spouseNameChangeSupportDocuments.$dirty && !$v.spouseNameChangeSupportDocuments.required"
                  aria-live="assertive">File upload required.</div>
              </div>
            </div>
          </div>
          <!-- Spouse personal information -->
          <div v-if="spouseCitizenshipSupportDocuments.length > 0" class="mt-3">
            <h2>Spouse's information</h2>
            <p>Enter spouse's legal name, birthdate and gender.</p>
            <hr>
            <Input label='First name:'
              id='first-name'
              className='mt-3'
              maxlength="18"
              v-model='spouseFirstName' />
            <div class="text-danger"
              v-if="$v.spouseFirstName.$dirty && !$v.spouseFirstName.required"
              aria-live="assertive">First name is required.</div>
            <div class="text-danger"
              v-if="$v.spouseFirstName.$dirty && $v.spouseFirstName.required && !$v.spouseFirstName.nameValidator"
              aria-live="assertive">First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
            <Input label='Middle name (optional):'
              id='middle-name'
              className='mt-3'
              maxlength="18"
              v-model='spouseMiddleName' />
            <div class="text-danger"
              v-if="$v.spouseMiddleName.$dirty && !$v.spouseMiddleName.nameValidator"
              aria-live="assertive">Middle name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
            <Input label='Last name:'
              id='last-name'
              className='mt-3'
              maxlength="18"
              v-model='spouseLastName' />
            <div class="text-danger"
              v-if="$v.spouseLastName.$dirty && !$v.spouseLastName.required"
              aria-live="assertive">Last name is required.</div>
            <div class="text-danger"
              v-if="$v.spouseLastName.$dirty && $v.spouseLastName.required && !$v.spouseLastName.nameValidator"
              aria-live="assertive">Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
            <DateInput label='Birth date:'
              id='birth-date'
              className='mt-3'
              v-model='spouseBirthDate' />
            <div class="text-danger"
              v-if="$v.spouseBirthDate.$dirty && !$v.spouseBirthDate.required"
              aria-live="assertive">Birth date is required.</div>
            <div class="text-danger"
              v-if="$v.spouseBirthDate.$dirty && $v.spouseBirthDate.required && !$v.spouseBirthDate.birthDatePastValidator"
              aria-live="assertive">Birth date cannot be in the future.</div>
            <Radio
              label='Gender'
              id='spouse-gender'
              name='spouse-gender'
              v-model='spouseGender'
              className="mt-3"
              :items='radioGenderOptions'
              :horizontalAlign="true" />
            <div class="text-danger"
              v-if="$v.spouseGender.$dirty && !$v.spouseGender.required"
              aria-live="assertive">Please indicate your spouse's gender.</div>
            <!-- Spouse moving information -->
            <h2 class="mt-3">Moving information</h2>
            <hr>
            <Radio
              label='Has your spouse lived in B.C. since birth?'
              id='lived-in-bc'
              name='lived-in-bc'
              v-model='spouseLivedInBCSinceBirth'
              className="mt-3"
              :items='radioOptionsNoYes'
              :horizontalAlign="true" />
            <div class="text-danger"
              v-if="$v.spouseLivedInBCSinceBirth.$dirty && !$v.spouseLivedInBCSinceBirth.required"
              aria-live="assertive">Please indicate whether your spouse has lived in BC since birth.</div>
            <Radio
              label='Has your spouse moved to B.C. permanently?'
              id='permanent-move'
              name='permanent-move'
              v-model='spouseMadePermanentMove'
              className="mt-3"
              :items='radioOptionsNoYes'
              :horizontalAlign="true" />
            <div class="text-danger"
              v-if="$v.spouseMadePermanentMove.$dirty && !$v.spouseMadePermanentMove.required"
              aria-live="assertive">Please indicate whether your spouse has made a permanent move to BC.</div>
            <div class="text-danger"
              v-if="$v.spouseMadePermanentMove.$dirty && $v.spouseMadePermanentMove.required && !$v.spouseMadePermanentMove.permanentMoveValidator"
              aria-live="assertive">You have indicated that a recent move to B.C. is not permanent. As a result, your spouse is not eligible for enrolment in the Medical Services Plan. Please contact <a href="http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us">Health Insurance BC</a> for further information.</div>
            <div v-if="spouseMadePermanentMove !== 'N'">
              <div v-if="spouseLivedInBCSinceBirth === 'N'">
                <Input 
                  className="mt-3"
                  label="Which province or country is your spouse moving from?" 
                  v-model="spouseMovedFrom"/>
                <div class="text-danger"
                  v-if="$v.spouseMovedFrom.$dirty && !$v.spouseMovedFrom.required"
                  aria-live="assertive">Please indicate where your spouse moved from.</div>
                <DateInput label='Most recent move to B.C.'
                  id='move-date'
                  className='mt-3'
                  v-model='spouseRecentBCMoveDate' />
                <div class="text-danger"
                  v-if="$v.spouseRecentBCMoveDate.$dirty && !$v.spouseRecentBCMoveDate.required"
                  aria-live="assertive">Most recent BC move date is required.</div>
                <DateInput label='Arrival date in Canada (optional)'
                  id='canada-arrival-date'
                  className='mt-3'
                  v-model='spouseCanadaArrivalDate' />
              </div>
              <Radio
                label='Has your spouse been outside B.C. for more than 30 days in total in the past 12 months?'
                id='outside-bc-past-12'
                name='outside-bc-past-12'
                v-model='spouseOutsideBCLast12Months'
                className="mt-3"
                :items='radioOptionsNoYes'
                :horizontalAlign="true" />
              <div class="text-danger"
                v-if="$v.spouseOutsideBCLast12Months.$dirty && !$v.spouseOutsideBCLast12Months.required"
                aria-live="assertive">Please indicate whether your spouse has been outside BC in the past 12 months.</div>
              <div v-if="spouseOutsideBCLast12Months === 'Y'" class="tabbed-section">
                <Input 
                  className="mt-3"
                  label="Reason for departure" 
                  v-model="spouseOutsideBCLast12MonthsReason"/>
                <div class="text-danger"
                  v-if="$v.spouseOutsideBCLast12MonthsReason.$dirty && !$v.spouseOutsideBCLast12MonthsReason.required"
                  aria-live="assertive">Please indicate the reason your spouse left BC.</div>
                <Input 
                  className="mt-3"
                  label="Location" 
                  v-model="spouseOutsideBCLast12MonthsDestination"/>
                <div class="text-danger"
                  v-if="$v.spouseOutsideBCLast12MonthsDestination.$dirty && !$v.spouseOutsideBCLast12MonthsDestination.required"
                  aria-live="assertive">Please indicate the location your spouse left BC to.</div>
                <DateInput label='Departure date'
                  id='departure-date'
                  className='mt-3'
                  v-model='spouseOutsideBCLast12MonthsDepartureDate' />
                <div class="text-danger"
                  v-if="$v.spouseOutsideBCLast12MonthsDepartureDate.$dirty && !$v.spouseOutsideBCLast12MonthsDepartureDate.required"
                  aria-live="assertive">Departure date is required.</div>
                <DateInput label='Return date'
                  id='return-date'
                  className='mt-3'
                  v-model='spouseOutsideBCLast12MonthsReturnDate' />
                <div class="text-danger"
                  v-if="$v.spouseOutsideBCLast12MonthsReturnDate.$dirty && !$v.spouseOutsideBCLast12MonthsReturnDate.required"
                  aria-live="assertive">Return date is required.</div>
              </div>
              <Radio
                label='Does your spouse have a previous B.C. Personal Health Number?'
                id='has-previous-bc-health-number'
                name='has-previous-bc-health-number'
                v-model='spouseHasPreviousBCHealthNumber'
                className="mt-3"
                :items='radioOptionsNoYes'
                :horizontalAlign="true" />
              <div class="text-danger"
                v-if="$v.spouseHasPreviousBCHealthNumber.$dirty && !$v.spouseHasPreviousBCHealthNumber.required"
                aria-live="assertive">Please indicate whether your spouse has a previous BC Personal Health Number.</div>
              <div v-if="spouseHasPreviousBCHealthNumber === 'Y'" class="tabbed-section">
                <PhnInput 
                  className="mt-3"
                  label="Your spouse's previous B.C. Personal Health Number (optional)" 
                  v-model="spousePreviousBCHealthNumber"/>
                <div class="text-danger"
                  v-if="$v.spousePreviousBCHealthNumber.$dirty && !$v.spousePreviousBCHealthNumber.phnValidator"
                  aria-live="assertive">Invalid Personal Health Number</div>
              </div>
              <Radio
                label='Has your spouse been released from the Canadian Armed Forces or an institution?'
                id='been-released-from-institution'
                name='been-released-from-institution'
                v-model='spouseBeenReleasedFromInstitution'
                className="mt-3"
                :items='radioOptionsNoYes'
                :horizontalAlign="true" />
              <div class="text-danger"
                v-if="$v.spouseBeenReleasedFromInstitution.$dirty && !$v.spouseBeenReleasedFromInstitution.required"
                aria-live="assertive">Please indicate whether your spouse has been released from an institution.</div>
              <div v-if="spouseBeenReleasedFromInstitution === 'Y'" class="tabbed-section">
                <DateInput label='Discharge date'
                  id='discharge-date'
                  className='mt-3'
                  v-model='spouseDischargeDate' />
                <div class="text-danger"
                  v-if="$v.spouseDischargeDate.$dirty && !$v.spouseDischargeDate.required"
                  aria-live="assertive">Discharge date is required.</div>
              </div>
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
import logService from '@/services/log-service';
import {
  ContinueBar,
  PageContent,
  Select,
  Radio,
  Input,
  DateInput,
  PhnInput,
  FileUploader,
  optionalValidator,
  pastDateValidator,
  phnValidator,
} from 'common-lib-vue';
import {
  required
} from 'vuelidate/lib/validators';
import {
  isSameDay,
  startOfToday,
} from 'date-fns';
import pageContentMixin from '@/mixins/page-content-mixin';
import { 
  selectOptionsImmigrationStatus,
  selectOptionsCitizenshipSupportDocuments,
  selectOptionsPermanentResidentSupportDocuments,
  selectOptionWorkPermitSupportDocument,
  selectOptionStudyPermitSupportDocument,
  selectOptionReligiousWorkSupportDocument,
  selectOptionDiplomaticFoilSupportDocument,
  selectOptionVisitorVisaSupportDocument,
  selectOptionsNameChangeSupportDocuments,
} from '@/constants/select-options';
import { 
  radioOptionsNoYes,
  radioOptionsCitizenStatusReasons, 
  radioOptionsTemporaryResidentStatusReasons,
  radioOptionsGender,
} from '@/constants/radio-options';
import { 
  StatusInCanada,
  CanadianStatusReasons, 
} from '@/constants/immigration-status-types';
import {
  MODULE_NAME as enrolmentModule,
  RESET_FORM,
  SET_HAS_SPOUSE,
  SET_SPOUSE_STATUS,
  SET_SPOUSE_STATUS_REASON,
  SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE,
  SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS,
  SET_SPOUSE_IS_NAME_CHANGED,
  SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE,
  SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS,
  SET_SPOUSE_FIRST_NAME,
  SET_SPOUSE_MIDDLE_NAME,
  SET_SPOUSE_LAST_NAME,
  SET_SPOUSE_BIRTH_DATE,
  SET_SPOUSE_GENDER,
  SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH,
  SET_SPOUSE_MADE_PERMANENT_MOVE,
  SET_SPOUSE_MOVED_FROM,
  SET_SPOUSE_RECENT_BC_MOVE_DATE,
  SET_SPOUSE_CANADA_ARRIVAL_DATE,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE,
  SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER,
  SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER,
  SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION,
  SET_SPOUSE_DISCHARGE_DATE,
} from '@/store/modules/enrolment-module';

const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.']*$/;
  return criteria.test(value);
};

const birthDatePastValidator = (value) => {
  return pastDateValidator(value) || isSameDay(value, startOfToday());
};

const permanentMoveValidator = (value) => {
  return value === 'Y';
}

export default {
  name: 'SpouseInfoPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    PageContent,
    Select,
    Radio,
    Input,
    DateInput,
    PhnInput,
    FileUploader,
  },
  data: () => {
    return {
      pageLoaded: false,
      // Radio and select options
      radioGenderOptions: radioOptionsGender,
      radioOptionsNoYes: radioOptionsNoYes,
      statusOptions: StatusInCanada,
      citizenshipStatusOptions: selectOptionsImmigrationStatus,
      citizenshipStatusReasonOptions: radioOptionsCitizenStatusReasons,
      nameChangeSupportDocumentOptions: selectOptionsNameChangeSupportDocuments,
      temporaryResidentStatusReasonOptions: radioOptionsTemporaryResidentStatusReasons,
      // Data to be saved
      hasSpouse: null,
      spouseStatus: null,
      spouseStatusReason: null,
      spouseCitizenshipSupportDocumentType: null,
      spouseCitizenshipSupportDocuments: [],
      spouseIsNameChanged: null,
      spouseNameChangeSupportDocumentType: null,
      spouseNameChangeSupportDocuments: [],
      spouseFirstName: null,
      spouseMiddleName: null,
      spouseLastName: null,
      spouseBirthDate: null,
      spouseGender: null,
      spouseLivedInBCSinceBirth: null,
      spouseMadePermanentMove: null,
      spouseMovedFrom: null,
      spouseRecentBCMoveDate: null,
      spouseCanadaArrivalDate: null,
      spouseOutsideBCLast12Months: null,
      spouseOutsideBCLast12MonthsReason: null,
      spouseOutsideBCLast12MonthsDestination: null,
      spouseOutsideBCLast12MonthsDepartureDate: null,
      spouseOutsideBCLast12MonthsReturnDate: null,
      spouseHasPreviousBCHealthNumber: null,
      spousePreviousBCHealthNumber: null,
      spouseBeenReleasedFromInstitution: null,
      spouseDischargeDate: null,
    };
  },
  created() {
    this.hasSpouse = this.$store.state.enrolmentModule.hasSpouse;
    this.spouseStatus = this.$store.state.enrolmentModule.spouseStatus;
    this.spouseStatusReason = this.$store.state.enrolmentModule.spouseStatusReason;
    this.spouseCitizenshipSupportDocumentType = this.$store.state.enrolmentModule.spouseCitizenshipSupportDocumentType;
    this.spouseCitizenshipSupportDocuments = this.$store.state.enrolmentModule.spouseCitizenshipSupportDocuments;
    this.spouseIsNameChanged = this.$store.state.enrolmentModule.spouseIsNameChanged;
    this.spouseNameChangeSupportDocumentType = this.$store.state.enrolmentModule.spouseNameChangeSupportDocumentType;
    this.spouseNameChangeSupportDocuments = this.$store.state.enrolmentModule.spouseNameChangeSupportDocuments;
    this.spouseFirstName = this.$store.state.enrolmentModule.spouseFirstName;
    this.spouseMiddleName = this.$store.state.enrolmentModule.spouseMiddleName;
    this.spouseLastName = this.$store.state.enrolmentModule.spouseLastName;
    this.spouseBirthDate = this.$store.state.enrolmentModule.spouseBirthDate;
    this.spouseGender = this.$store.state.enrolmentModule.spouseGender;
    this.spouseLivedInBCSinceBirth = this.$store.state.enrolmentModule.spouseLivedInBCSinceBirth;
    this.spouseMadePermanentMove = this.$store.state.enrolmentModule.spouseMadePermanentMove;
    this.spouseMovedFrom = this.$store.state.enrolmentModule.spouseMovedFrom;
    this.spouseRecentBCMoveDate = this.$store.state.enrolmentModule.spouseRecentBCMoveDate;
    this.spouseCanadaArrivalDate = this.$store.state.enrolmentModule.spouseCanadaArrivalDate;
    this.spouseOutsideBCLast12Months = this.$store.state.enrolmentModule.spouseOutsideBCLast12Months;
    this.spouseOutsideBCLast12MonthsReason = this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsReason;
    this.spouseOutsideBCLast12MonthsDestination = this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsDestination;
    this.spouseOutsideBCLast12MonthsDepartureDate = this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsDepartureDate;
    this.spouseOutsideBCLast12MonthsReturnDate = this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsReturnDate;
    this.spouseHasPreviousBCHealthNumber = this.$store.state.enrolmentModule.spouseHasPreviousBCHealthNumber;
    this.spousePreviousBCHealthNumber = this.$store.state.enrolmentModule.spousePreviousBCHealthNumber;
    this.spouseBeenReleasedFromInstitution = this.$store.state.enrolmentModule.spouseBeenReleasedFromInstitution;
    this.spouseDischargeDate = this.$store.state.enrolmentModule.spouseDischargeDate;
    
    setTimeout(() => {
      this.pageLoaded = true;
    }, 0);

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.SPOUSE_INFO_PAGE.path,
      enrolmentRoutes.SPOUSE_INFO_PAGE.title
    );
  },
  validations() {
    const validations = {
      hasSpouse: {
        required,
      },
      spouseStatus: {
        required,
      },
      spouseStatusReason: {
        required,
      },
      spouseCitizenshipSupportDocumentType: {
        required,
      },
      spouseCitizenshipSupportDocuments: {
        required,
      },
      spouseIsNameChanged: {
        required,
      },
      spouseFirstName: {
        required,
        nameValidator,
      },
      spouseMiddleName: {
        nameValidator: optionalValidator(nameValidator),
      },
      spouseLastName: {
        required,
        nameValidator,
      },
      spouseBirthDate: {
        required,
        birthDatePastValidator,
      },
      spouseGender: {
        required,
      },
      spouseLivedInBCSinceBirth: {
        required,
      },
      spouseMadePermanentMove: {
        required,
        permanentMoveValidator: optionalValidator(permanentMoveValidator),
      },
      spouseOutsideBCLast12Months: {
        required,
      },
      spouseHasPreviousBCHealthNumber: {
        required,
      },
      spouseBeenReleasedFromInstitution: {
        required,
      },
    };

    if (this.spouseIsNameChanged === 'Y') {
      validations.spouseNameChangeSupportDocumentType = { required };
      validations.spouseNameChangeSupportDocuments = { required };
    }

    if (this.spouseLivedInBCSinceBirth === 'N') {
      validations.spouseMovedFrom = { required };
      validations.spouseRecentBCMoveDate = { required };
      validations.spouseCanadaArrivalDate = { required };
    }

    if (this.spouseOutsideBCLast12Months === 'Y') {
      validations.spouseOutsideBCLast12MonthsReason = { required };
      validations.spouseOutsideBCLast12MonthsDestination = { required };
      validations.spouseOutsideBCLast12MonthsDepartureDate = { required };
      validations.spouseOutsideBCLast12MonthsReturnDate = { required };
    }

    if (this.spouseHasPreviousBCHealthNumber === 'Y') {
      validations.spousePreviousBCHealthNumber = {
        phnValidator: optionalValidator(phnValidator)
      };
    }

    if (this.spouseBeenReleasedFromInstitution === 'Y') {
      validations.spouseDischargeDate = { required };
    }
    
    return validations;
  },
  watch: {
    // When the status is changed, clear the reason
    spouseStatus() {
      if (this.pageLoaded) {
        this.spouseStatusReason = null;
        this.spouseCitizenshipSupportDocumentType = null;
        this.spouseCitizenshipSupportDocuments = [];
      }
    },
    spouseStatusReason() {
      if (this.pageLoaded) {
        this.spouseCitizenshipSupportDocumentType = null;
        this.spouseCitizenshipSupportDocuments = [];
      }
    }
  },
  methods: {
    validateFields() {
      this.saveData();

      if (this.hasSpouse === 'N') {
        this.navigateToNextPage();
        return;
      }

      this.$v.$touch()
      if (this.$v.$invalid) {
        scrollToError();
        return;
      }

      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(enrolmentModule + '/' + SET_HAS_SPOUSE, this.hasSpouse);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_STATUS, this.spouseStatus);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_STATUS_REASON, this.spouseStatusReason);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, this.spouseCitizenshipSupportDocumentType);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS, this.spouseCitizenshipSupportDocuments);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_IS_NAME_CHANGED, this.spouseIsNameChanged);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, this.spouseNameChangeSupportDocumentType);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS, this.spouseNameChangeSupportDocuments);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_FIRST_NAME, this.spouseFirstName);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_MIDDLE_NAME, this.spouseMiddleName);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_LAST_NAME, this.spouseLastName);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_BIRTH_DATE, this.spouseBirthDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_GENDER, this.spouseGender);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH, this.spouseLivedInBCSinceBirth);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_MADE_PERMANENT_MOVE, this.spouseMadePermanentMove);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_MOVED_FROM, this.spouseMovedFrom);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_RECENT_BC_MOVE_DATE, this.spouseRecentBCMoveDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_CANADA_ARRIVAL_DATE, this.spouseCanadaArrivalDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS, this.spouseOutsideBCLast12Months);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON, this.spouseOutsideBCLast12MonthsReason);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION, this.spouseOutsideBCLast12MonthsDestination);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, this.spouseOutsideBCLast12MonthsDepartureDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, this.spouseOutsideBCLast12MonthsReturnDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER, this.spouseHasPreviousBCHealthNumber);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER, this.spousePreviousBCHealthNumber);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION, this.spouseBeenReleasedFromInstitution);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_DISCHARGE_DATE, this.spouseDischargeDate);
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.CHILD_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
  },
  computed: {
    citizenshipSupportDocumentOptions() {
      let options;

      if (this.spouseStatus === StatusInCanada.PermanentResident) {
        options = selectOptionsPermanentResidentSupportDocuments;
      } else if (this.spouseStatus === StatusInCanada.TemporaryResident){
        if (this.spouseStatusReason === CanadianStatusReasons.WorkingInBC) {
          options = selectOptionWorkPermitSupportDocument;
        } else if (this.spouseStatusReason === CanadianStatusReasons.StudyingInBC) {
          options = selectOptionStudyPermitSupportDocument;
        } else if (this.spouseStatusReason === CanadianStatusReasons.ReligiousWorker) {
          options = selectOptionReligiousWorkSupportDocument;
        } else if (this.spouseStatusReason === CanadianStatusReasons.Diplomat) {
          options = selectOptionDiplomaticFoilSupportDocument;
        } else if (this.spouseStatusReason === CanadianStatusReasons.Visiting) {
          options = selectOptionVisitorVisaSupportDocument;
        }
      } else {
        options = selectOptionsCitizenshipSupportDocuments;
      }

      return options;
    }
  },
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
        enrolmentRoutes.SPOUSE_INFO_PAGE.path
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

