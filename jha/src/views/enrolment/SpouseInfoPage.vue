<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Add spouse information and upload documents</h1>
        <p>Do you have a spouse or common-law partner who also needs to enrol for MSP coverage? If so, you are required to provide spouse information and provide supporting documents.</p>
        <hr class="mt-0"/>
        <Radio
          label='Do you have a spouse or common-law partner?'
          v-model='hasSpouse'
          :items='hasSpouseOptions' />
        <div class="text-danger"
          v-if="$v.hasSpouse.$dirty && !$v.hasSpouse.required"
          aria-live="assertive">Please indicate whether or not you have a spouse who needs to enrol.</div>
        <div v-if="hasSpouse === 'Y'" class="mt-3">
          <h2>Spouse or common-law partner</h2>
          <p>Please provide the spouse's personal information and immigration status in Canada. You will be required to upload supporting documents with your application.</p>
          <hr class="mt-0"/>
          <Select label="Spouse's immigration status in Canada"
            class='mt-3'
            v-model='spouseStatus'
            :options='optionsImmigrationStatus' />
          <div class="text-danger"
            v-if="$v.spouseStatus.$dirty && !$v.spouseStatus.required"
            aria-live="assertive">Please select your spouse's immigration status.</div>
          <div v-if="spouseStatus === statusOptions.Citizen || spouseStatus === statusOptions.PermanentResident">
            <Radio
              label=''
              v-model='spouseStatusReason'
              :items='isCitizenOrPermResidentStatusReasons' />
            <div class="text-danger"
              v-if="$v.spouseStatusReason.$dirty && !$v.spouseStatusReason.required"
              aria-live="assertive">Please select one of the above.</div>
          </div>
          <div v-if="spouseStatus === statusOptions.TemporaryResident">
            <Radio
              label=''
              v-model='spouseStatusReason'
              :items='isTemporaryResidentStatusReasons' />
            <div class="text-danger"
              v-if="$v.spouseStatusReason.$dirty && !$v.spouseStatusReason.required"
              aria-live="assertive">Please select one of the above.</div>
          </div>
          <div v-if="spouseStatusReason !== null && spouseStatusReason !== undefined" class="mt-3">
            <!-- INSERT SUPPORT DOCUMENTS COMPONENT HERE -->
          </div>
          <!-- below will be v-if="hasDocumentsUploaded" or something of the sort -->
          <div v-if="spouseStatusReason !== null && spouseStatusReason !== undefined" class="mt-3">
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
              v-model='spouseGender'
              className="mt-3"
              :items='genderOptions'
              :horizontalAlign="true" />
            <div class="text-danger"
              v-if="$v.spouseGender.$dirty && !$v.spouseGender.required"
              aria-live="assertive">Please indicate your spouse's gender.</div>
            <h2 class="mt-3">Moving information</h2>
            <hr>
            <Radio
              label='Has your spouse lived in B.C. since birth?'
              v-model='spouseLivedInBCSinceBirth'
              className="mt-3"
              :items='livedInBCOptions'
              :horizontalAlign="true" />
            <div class="text-danger"
              v-if="$v.spouseLivedInBCSinceBirth.$dirty && !$v.spouseLivedInBCSinceBirth.required"
              aria-live="assertive">Please indicate whether your spouse has lived in BC since birth.</div>
            <Radio
              label='Has your spouse moved to B.C. permanently?'
              v-model='spouseMadePermanentMove'
              className="mt-3"
              :items='permanentMoveOptions'
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
                v-model='spouseOutsideBCLast12Months'
                className="mt-3"
                :items='outsideBCLast12MonthsOptions'
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
                v-model='spouseHasPreviousBCHealthNumber'
                className="mt-3"
                :items='hasPreviousHealthNumberOptions'
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
                v-model='spouseBeenReleasedFromInstitution'
                className="mt-3"
                :items='beenReleasedFromInstitutionOptions'
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
import {
  MODULE_NAME as formModule,
  RESET_FORM,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import {
  ContinueBar,
  PageContent,
  Select,
  Radio,
  Input,
  DateInput,
  PhnInput,
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
import { selectOptionsImmigrationStatus } from '@/constants/select-options';
import { 
  radioOptionsHasSpouse, 
  radioOptionsCitizenStatusReasons, 
  radioOptionsTemporaryResidentStatusReasons,
  radioOptionsGender,
  radioOptionsLivedInBCSinceBirth,
  radioOptionsPermanentMove,
  radioOptionsOutsideBCLast12Months,
  radioOptionsHasPreviousBCHealthNumber,
  radioOptionsReleasedFromInstitution,
} from '@/constants/radio-options';
import { StatusInCanada } from '@/constants/immigration-status-types';

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
  },
  data: () => {
    return {
      // Radio and select options
      hasSpouseOptions: radioOptionsHasSpouse,
      optionsImmigrationStatus: selectOptionsImmigrationStatus,
      statusOptions: StatusInCanada,
      isCitizenOrPermResidentStatusReasons: radioOptionsCitizenStatusReasons,
      isTemporaryResidentStatusReasons: radioOptionsTemporaryResidentStatusReasons,
      genderOptions: radioOptionsGender,
      livedInBCOptions: radioOptionsLivedInBCSinceBirth,
      permanentMoveOptions: radioOptionsPermanentMove,
      outsideBCLast12MonthsOptions: radioOptionsOutsideBCLast12Months,
      hasPreviousHealthNumberOptions: radioOptionsHasPreviousBCHealthNumber,
      beenReleasedFromInstitutionOptions: radioOptionsReleasedFromInstitution,
      // Data to be saved
      hasSpouse: null,
      spouseStatus: null,
      spouseStatusReason: null,
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
    console.log(this.optionsImmigrationStatus);
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
  methods: {
    validateFields() {
      if (!this.hasSpouse) {
        this.navigateToNextPage();
      }

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
        enrolmentRoutes.CHILD_INFO_PAGE.path
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
/* Should be moved into a global stylesheet */
.tabbed-section {
  margin-left: 20px;
  border-left: 1px solid grey;
  padding-left: 12px;
}
</style>

