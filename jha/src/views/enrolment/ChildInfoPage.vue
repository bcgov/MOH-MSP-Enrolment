<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Add child information and upload documents</h1>
        <p>Do you have a child who also needs to enrol for MSP coverage? If so, you are required to provide child information and provide supporting documents.</p>
        <hr class="mt-0"/>
        <Button 
          label="Add Child"
          @click="addChild()"
          :disabled="maximumChildrenReached"
        />
        <div v-for="(child, index) in children"
            :key="'child-' + index"
            :set="v = $v.children.$each[index]">
          <div class="heading mt-3">
            <div v-if="!child.collapsed" @click="collapseChild(index)" class="icon-header">
              <font-awesome-icon icon="angle-down" size="3x" />
              <h2 class="m-0 ml-2">{{getChildTitle(index)}}</h2>
            </div>
            <div v-if="child.collapsed" @click="expandChild(index)" class="icon-header">
              <font-awesome-icon icon="angle-right" size="3x" />
              <h2 class="m-0 ml-2">{{getChildTitle(index)}}</h2>
            </div>
            <div class="text-danger remove-icon" @click="removeChild(index)">
                <font-awesome-icon icon="times-circle" size="2x"/>
            </div>
          </div>
          <hr/>
          <div :class="{'collapsed': child.collapsed}">
            <Radio
              label='How old is the child?'
              :id="'child-age-range-' + index"
              :name="'child-age-range-' + index"
              v-model='child.ageRange'
              className="mt-3"
              :items='radioChildAgeOptions'
            />
            <div class="text-danger"
              v-if="v.ageRange.$dirty && !v.ageRange.required"
              aria-live="assertive">Please indicate the child's age range.</div>
            <Input label='First name'
              :id="'child-first-name-' + index"
              className='mt-3'
              maxlength="18"
              v-model='child.firstName' />
            <div class="text-danger"
              v-if="v.firstName.$dirty && !v.firstName.required"
              aria-live="assertive">First name is required.</div>
            <div class="text-danger"
              v-if="v.firstName.$dirty && v.firstName.required && !v.firstName.nameValidator"
              aria-live="assertive">First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
            <Input label='Middle name (optional)'
              :id="'child-middle-name-' + index"
              className='mt-3'
              maxlength="18"
              v-model='child.middleName' />
            <div class="text-danger"
              v-if="v.middleName.$dirty && !v.middleName.nameValidator"
              aria-live="assertive">Middle name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
            <Input label='Last name'
              :id="'child-last-name-' + index"
              className='mt-3'
              maxlength="18"
              v-model='child.lastName' />
            <div class="text-danger"
              v-if="v.lastName.$dirty && !v.lastName.required"
              aria-live="assertive">Last name is required.</div>
            <div class="text-danger"
              v-if="v.lastName.$dirty && v.lastName.required && !v.lastName.nameValidator"
              aria-live="assertive">Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
            <DateInput label='Birth date'
              :id="'child-birth-date-' + index"
              className='mt-3'
              v-model='child.birthDate' />
            <div class="text-danger"
              v-if="v.birthDate.$dirty && !v.birthDate.required"
              aria-live="assertive">Birth date is required.</div>
            <div class="text-danger"
              v-if="v.birthDate.$dirty && v.birthDate.required && !v.birthDate.birthDatePastValidator"
              aria-live="assertive">Birth date cannot be in the future.</div>
            <Radio
              label='Gender'
              :id="'child-gender-' + index"
              :name="'child-gender-' + index"
              v-model='child.gender'
              className="mt-3"
              :items='radioGenderOptions'
              :horizontalAlign="true" />
            <div class="text-danger"
              v-if="v.gender.$dirty && !v.gender.required"
              aria-live="assertive">Please indicate the child's gender.</div>
            <h2 class="mt-3">Child's status in Canada</h2>
            <p>Please provide child immigration status information. You will be required to upload documents to support your status in Canada.</p>
            <hr />
            <Select 
              :id="'child-status-' + index"
              :name="'child-status-' + index"
              label="Immigration status in Canada"
              class='mt-3'
              v-model='child.status'
              :options='citizenshipStatusOptions' />
            <div class="text-danger"
              v-if="v.status.$dirty && !v.status.required"
              aria-live="assertive">Please select your child's immigration status.</div>
            <div v-if="child.status === statusOptions.Citizen || child.status === statusOptions.PermanentResident">
              <Radio
                :id="'child-status-reason-' + index"
                :name="'child-status-reason-' + index"
                label=''
                v-model='child.statusReason'
                :items='citizenshipStatusReasonOptions' />
              <div class="text-danger"
                v-if="v.statusReason.$dirty && !v.statusReason.required"
                aria-live="assertive">Please select one of the above.</div>
            </div>
            <div v-if="child.status === statusOptions.TemporaryResident">
              <Radio
                :id="'child-status-reason' + index"
                :name="'child-status-reason' + index"
                label=''
                v-model='child.statusReason'
                :items='temporaryResidentStatusReasonOptions' />
              <div class="text-danger"
                v-if="v.statusReason.$dirty && !v.statusReason.required"
                aria-live="assertive">Please select one of the above.</div>
            </div>
            <div v-if="child.statusReason !== null && child.statusReason !== undefined" class="mt-3">
              <h2>Documents</h2>
              <p>Provide one of the following documents to support your status in Canada. If your child's name has changed since your ID was issued you are also required to upload document to support the name change.</p>
              <hr/>
              <Select 
                label="Document Type"
                :name="'citizen-support-document-type-' + index"
                :id="'citizen-support-document-type-' + index"
                class="mb-3"
                v-model="child.citizenshipSupportDocumentType"
                :options="citizenshipSupportDocumentOptions(child)" />
              <div class="text-danger"
                v-if="v.citizenshipSupportDocumentType.$dirty && !v.citizenshipSupportDocumentType.required"
                aria-live="assertive">Please select one of the above.</div>
              <div v-if="child.citizenshipSupportDocumentType">
                <h2>{{child.citizenshipSupportDocumentType}}</h2>
                <hr/>
                <FileUploader v-model="child.citizenshipSupportDocuments" />
                <div class="text-danger"
                  v-if="v.citizenshipSupportDocuments.$dirty && !v.citizenshipSupportDocuments.required"
                  aria-live="assertive">File upload required.</div>
              </div>

              <Radio label="Has your child's name changed since their ID was issued due to marriage or legal name change?"
                :id="'name-change-' + index"
                :name="'name-change-' + index"
                class="mt-3 mb-3"
                v-model="child.isNameChanged"
                :items="radioOptionsNoYes" />
              <div class="text-danger"
                v-if="v.isNameChanged.$dirty && !v.isNameChanged.required"
                aria-live="assertive">Please indicate if your child's name changed.</div>
              <div v-if="child.isNameChanged === 'Y'"
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
                  :name="'name-change-doc-type-' + index"
                  :id="'name-change-doc-type-' + index"
                  class="mb-3"
                  v-model="child.nameChangeSupportDocumentType"
                  :options="nameChangeSupportDocumentOptions"/>
                <div class="text-danger"
                  v-if="v.nameChangeSupportDocumentType.$dirty && !v.nameChangeSupportDocumentType.required"
                  aria-live="assertive">Please select one of the above.</div>
                <div v-if="child.nameChangeSupportDocumentType">
                  <h2>{{child.nameChangeSupportDocumentType}}</h2>
                  <hr/>
                  <FileUploader class="mb-3"
                    v-model="child.nameChangeSupportDocuments"/>
                  <div class="text-danger"
                    v-if="v.nameChangeSupportDocuments.$dirty && !v.nameChangeSupportDocuments.required"
                    aria-live="assertive">File upload required.</div>
                </div>
              </div>

              <h2 class="mt-4">Moving Information</h2>
              <hr/>
              <Radio label="Has your child moved to B.C. permanently?"
                :id="'is-moved-to-bc-permanently-' + index"
                :name="'is-moved-to-bc-permanently-' + index"
                v-model="child.madePermanentMove"
                :items="radioOptionsNoYes"
                @blur="handleBlurField(v.madePermanentMove)"/>
              <div class="text-danger"
                v-if="v.madePermanentMove.$dirty
                  && !v.madePermanentMove.required"
                aria-live="assertive">This field is required.</div>
              <div class="text-danger"
                v-if="v.madePermanentMove.$dirty
                  && v.madePermanentMove.required && !v.madePermanentMove.permanentMoveValidator"
                aria-live="assertive">You have indicated that a recent move to B.C. is not permanent. As a result, your child is not eligible for enrolment in the Medical Services Plan. Please contact <a href="http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us">Health Insurance BC</a> for further information.</div>
              <div v-if="child.madePermanentMove === 'Y'"
                class="tabbed-section">
                <Input 
                  :id="'moved-from-' + index"
                  className="mt-3"
                  label="From which province or country?" 
                  v-model="child.movedFrom"/>
                <div class="text-danger"
                  v-if="v.movedFrom.$dirty && !v.movedFrom.required"
                  aria-live="assertive">Please indicate where your child moved from.</div>
                <DateInput label="Arrival date in B.C."
                  :id="'arrival-date-in-bc-' + index"
                  class="mt-3"
                  v-model="child.arrivalToBCDate"
                  @blur="handleBlurField(v.arrivalToBCDate)" />
                <div class="text-danger"
                  v-if="v.arrivalToBCDate.$dirty
                    && !v.arrivalToBCDate.required"
                  aria-live="assertive">Arrival date in B.C. is required.</div>
                <DateInput label="Arrival date in Canada"
                  id="arrival-date-in-canada"
                  class="mt-3"
                  v-model="child.arrivalToCanadaDate"
                  @blur="handleBlurField(v.arrivalToCanadaDate)" />
                <div class="text-danger"
                  v-if="v.arrivalToCanadaDate.$dirty
                    && !v.arrivalToCanadaDate.required"
                  aria-live="assertive">Arrival date in Canada is required.</div>
              </div>
              <Radio label="Has your child been outside B.C. for more than 30 days in total in the past 12 months?"
                class="mt-3"
                :id="'outside-bc-12-months-' + index"
                :name="'outside-bc-12-months-' + index"
                v-model="child.outsideBCLast12Months"
                :items="radioOptionsNoYes"
                @blur="handleBlurField(v.outsideBCLast12Months)">
                <template v-slot:description>
                  <span class="field-description">If the child has been living in B.C. for less than 12 months, please indicate any absences since arrival.</span>
                </template>
              </Radio>
              <div class="text-danger"
                v-if="v.outsideBCLast12Months.$dirty
                  && !v.outsideBCLast12Months.required"
                aria-live="assertive">This field is required.</div>
              <div v-if="child.outsideBCLast12Months === 'Y'"
                class="tabbed-section">
                <Input label="Reason for departure"
                  :id="'outside-bc-reason-' + index"
                  class="mt-3"
                  v-model="child.outsideBCLast12MonthsReason"
                  @blur="handleBlurField(v.outsideBCLast12MonthsReason)" />
                <div class="text-danger"
                  v-if="v.outsideBCLast12MonthsReason.$dirty
                    && !v.outsideBCLast12MonthsReason.required"
                  aria-live="assertive">Reason for departure is required.</div>
                <Input label="Location"
                  :id="'outside-bc-location-' + index"
                  class="mt-3"
                  v-model="child.outsideBCLast12MonthsLocation"
                  @blur="handleBlurField(v.outsideBCLast12MonthsLocation)" />
                <div class="text-danger"
                  v-if="v.outsideBCLast12MonthsLocation.$dirty
                    && !v.outsideBCLast12MonthsLocation.required"
                  aria-live="assertive">Location is required.</div>
                <DateInput label="Departure date"
                  :id="'departure-date-' + index"
                  class="mt-3"
                  v-model="child.outsideBCLast12MonthsDepartureDate"
                  @blur="handleBlurField(v.outsideBCLast12MonthsDepartureDate)" />
                <div class="text-danger"
                  v-if="v.outsideBCLast12MonthsDepartureDate.$dirty
                    && !v.outsideBCLast12MonthsDepartureDate.required"
                  aria-live="assertive">Departure date is required.</div>
                <DateInput label="Return date"
                  :id="'return-date-' + index"
                  class="mt-3"
                  v-model="child.outsideBCLast12MonthsReturnDate"
                  @blur="handleBlurField(v.outsideBCLast12MonthsReturnDate)" />
                <div class="text-danger"
                  v-if="v.outsideBCLast12MonthsReturnDate.$dirty
                    && !v.outsideBCLast12MonthsReturnDate.required"
                  aria-live="assertive">Return date is required.</div>
              </div>
              <Radio label="Do you have a previous B.C. Personal Health Number?"
                class="mt-3"
                :id="'has-previous-phn-' + index"
                :name="'has-previous-phn-' + index"
                v-model="child.hasPreviousPHN"
                :items="radioOptionsNoYes"
                @blur="handleBlurField(v.hasPreviousPHN)"/>
              <div class="text-danger"
                v-if="v.hasPreviousPHN.$dirty
                  && !v.hasPreviousPHN.required"
                aria-live="assertive">This field is required.</div>
              <div v-if="child.hasPreviousPHN === 'Y'"
                class="tabbed-section">
                <PhnInput label="Your previous B.C. Personal Health Number (optional)"
                  :id="'previous-phn-' + index"
                  class="mt-3"
                  v-model="child.previousPHN"
                  @blur="handleBlurField(v.previousPHN)"/>
                <div class="text-danger"
                  v-if="v.previousPHN.$dirty
                    && !v.previousPHN.phnValidator"
                  aria-live="assertive">Personal Health Number is not valid.</div>
              </div>
              <div v-if="child.ageRange === childAgeTypes.Child19To24">
                <h2 class="mt-3">School Information</h2>
                <p class="m-0">Enter information of the school that this child is attending (must be in full time attendance)</p>
                <hr/>
                <Input label='School name'
                  :id="'school-name-' + index"
                  className='mt-3'
                  maxlength="18"
                  v-model='child.schoolName' />
                <div class="text-danger"
                  v-if="v.schoolName.$dirty && !v.schoolName.required"
                  aria-live="assertive">School name is required.</div>
                <Input label="Full street address, rural route, PO box or general delivery"
                  :id="'school-address-line1-' + index"
                  v-model="child.schoolAddressLine1"
                  maxlength="25"
                  @blur="handleBlurField(v.schoolAddressLine1)" />
                <div class="text-danger" v-if="v.schoolAddressLine1.$dirty && !v.schoolAddressLine1.required" aria-live="assertive">Street address is required.</div>
                <div class="text-danger"
                    v-if="v.schoolAddressLine1.$dirty && !v.schoolAddressLine1.specialCharacterValidator"
                    aria-live="assertive">Street address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
                <Input label="Address Line 2 (optional)"
                  :id="'school-address-line2-' + index"
                  v-model="child.schoolAddressLine2"
                  maxlength="25"
                  @blur="handleBlurField(v.schoolAddressLine2)" />
                <div class="text-danger"
                    v-if="v.schoolAddressLine2.$dirty && !v.schoolAddressLine2.specialCharacterValidator"
                    aria-live="assertive">Street address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
                <Input label="Address Line 3 (optional)"
                  :id="'school-address-line3-' + index"
                  v-model="child.schoolAddressLine3"
                  maxlength="25"
                  @blur="handleBlurField(v.schoolAddressLine3)" />
                <div class="text-danger"
                    v-if="v.schoolAddressLine3.$dirty && !v.schoolAddressLine3.specialCharacterValidator"
                    aria-live="assertive">Street address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
                <Input label="City"
                  :id="'school-city-' + index"
                  v-model="child.schoolCity"
                  maxlength="25"
                  @blur="handleBlurField(v.schoolCity)" />
                <div class="text-danger" v-if="v.schoolCity.$dirty && !v.schoolCity.required" aria-live="assertive">City is required.</div>
                <div class="text-danger"
                    v-if="v.schoolCity.$dirty && !v.schoolCity.specialCharacterValidator"
                    aria-live="assertive">City cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
                <Input label="Province"
                  :id="'school-province-' + index"
                  v-model="child.schoolProvinceOrState"
                  @blur="handleBlurField(v.schoolProvinceOrState)"/>
                <div class="text-danger" v-if="v.schoolProvinceOrState.$dirty && !v.schoolProvinceOrState.required" aria-live="assertive">Province/state is required.</div>
                <Input label="Country"
                  :id="'school-country-' + index"
                  v-model="child.schoolCountry"
                  @blur="handleBlurField(v.schoolCountry)"/>
                <div class="text-danger" v-if="v.schoolCountry.$dirty && !v.schoolCountry.required" aria-live="assertive">Country is required.</div>
                <PostalCodeInput label="Postal Code"
                  :id="'school-postal-code-' + index"
                  v-model="child.schoolPostalCode"
                  @blur="handleBlurField(v.schoolPostalCode)" />
                <div class="text-danger" v-if="v.schoolPostalCode.$dirty && !v.schoolPostalCode.required" aria-live="assertive">Postal code is required.</div>
                <DateInput label="Original departure date from B.C. (if school is outside B.C.)"
                  :id="'school-departure-date-' + index"
                  class="mt-3"
                  v-model="child.schoolDepartureDate"
                  @blur="handleBlurField(v.schoolDepartureDate)" />
                <DateInput label="Expected school completion date"
                  :id="'school-completion-date-' + index"
                  class="mt-3"
                  v-model="child.schoolCompletionDate"
                  @blur="handleBlurField(v.schoolCompletionDate)" />
                <div class="text-danger"
                  v-if="v.schoolCompletionDate.$dirty
                    && !v.schoolCompletionDate.required"
                  aria-live="assertive">Expected school completion date is required.</div>
                <Radio label="Will your child reside in BC after completing their studies?"
                  class="mt-3"
                  :id="'will-reside-in-bc-after-studies-' + index"
                  :name="'will-reside-in-bc-after-studies-' + index"
                  v-model="child.willResideInBCAfterStudies"
                  :items="radioOptionsNoYes"
                  @blur="handleBlurField(v.willResideInBCAfterStudies)"/>
                <div class="text-danger"
                  v-if="v.willResideInBCAfterStudies.$dirty
                    && !v.willResideInBCAfterStudies.required"
                  aria-live="assertive">This field is required.</div>
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
  Button,
  Select,
  Radio,
  Input,
  DateInput,
  PhnInput,
  PostalCodeInput,
  FileUploader,
  optionalValidator,
  cloneDeep,
  pastDateValidator,
  phnValidator,
  specialCharacterValidator,
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
  radioOptionsChildAge,
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
  SET_HAS_CHILDREN,
  SET_NUM_CHILDREN,
  SET_CHILDREN,
} from '@/store/modules/enrolment-module';
import { ChildAgeTypes } from '../../constants/child-age-types';

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

const doesRequireNameChangeDocuments = (val, vm) => {
  if (vm && vm.isNameChanged === 'Y') {
    if (Array.isArray(val)) {
      return val.length > 0;
    } else {
      return !!val;
    }
  } else {
    return true;
  }
}

const doesRequireOutsideBCInfo = (val, vm) => {
  if (vm && vm.outsideBCLast12Months === 'Y') {
    return !!val;
  } else {
    return true;
  }
}

const doesRequireSchoolInfo = (val, vm) => {
  if (vm && vm.ageRange === ChildAgeTypes.Child19To24) {
    return !!val;
  } else {
    return true;
  }
}

export default {
  name: 'ChildInfoPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    PageContent,
    Button,
    Select,
    Radio,
    Input,
    DateInput,
    PhnInput,
    FileUploader,
    PostalCodeInput,
  },
  data: () => {
    return {
      pageLoaded: false,
      // Radio and select options
      radioChildAgeOptions: radioOptionsChildAge,
      radioGenderOptions: radioOptionsGender,
      radioOptionsNoYes: radioOptionsNoYes,
      statusOptions: StatusInCanada,
      childAgeTypes: ChildAgeTypes,
      citizenshipStatusOptions: selectOptionsImmigrationStatus,
      citizenshipStatusReasonOptions: radioOptionsCitizenStatusReasons,
      nameChangeSupportDocumentOptions: selectOptionsNameChangeSupportDocuments,
      temporaryResidentStatusReasonOptions: radioOptionsTemporaryResidentStatusReasons,
      // Data to be saved
      hasChildren: false,
      children: [],
    };
  },
  created() {
    this.hasChildren = this.$store.state.enrolmentModule.hasChildren;
    this.children = this.$store.state.enrolmentModule.children ? cloneDeep(this.$store.state.enrolmentModule.children) : [];
    
    setTimeout(() => {
      this.pageLoaded = true;
    }, 0);

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.CHILD_INFO_PAGE.path,
      enrolmentRoutes.CHILD_INFO_PAGE.title
    );
  },
  validations() {
    const validations = {
      children: {
        $each: {
          ageRange: {
            required,
          },
          status: {
            required,
          },
          statusReason: {
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
          nameChangeSupportDocumentType: {
            required: doesRequireNameChangeDocuments,
          },
          nameChangeSupportDocuments: {
            required: doesRequireNameChangeDocuments,
          },
          firstName: {
            required,
            nameValidator,
          },
          middleName: {
            nameValidator: optionalValidator(nameValidator),
          },
          lastName: {
            required,
            nameValidator,
          },
          birthDate: {
            required,
            birthDatePastValidator,
          },
          gender: {
            required,
          },
          madePermanentMove: {
            required,
            permanentMoveValidator: optionalValidator(permanentMoveValidator),
          },
          movedFrom: {
            required,
          },
          arrivalToBCDate: {
            required,
          },
          arrivalToCanadaDate: {
            required,
          },
          outsideBCLast12Months: {
            required,
          },
          outsideBCLast12MonthsReason: {
            required: doesRequireOutsideBCInfo,
          },
          outsideBCLast12MonthsLocation: {
            required: doesRequireOutsideBCInfo,
          },
          outsideBCLast12MonthsDepartureDate: {
            required: doesRequireOutsideBCInfo,
          },
          outsideBCLast12MonthsReturnDate: {
            required: doesRequireOutsideBCInfo,
          },
          hasPreviousPHN: {
            required,
          },
          previousPHN: {
            phnValidator: optionalValidator(phnValidator),
          },
          schoolName: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolAddressLine1: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolAddressLine2: {
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolAddressLine3: {
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolCity: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolProvinceOrState: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolCountry: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolPostalCode: {
            required: doesRequireSchoolInfo,
          },
          schoolCompletionDate: {
            required: doesRequireSchoolInfo,
          },
          willResideInBCAfterStudies: {
            required: doesRequireSchoolInfo,
          },
        }
      }
    };

    return validations;
  },
  methods: {
    addChild() {
      this.children.push({
        collapsed: false,
        ageRange: null,
        status: null,
        statusReason: null,
        citizenshipSupportDocumentType: null,
        citizenshipSupportDocuments: [],
        isNameChanged: null,
        nameChangeSupportDocumentType: null,
        nameChangeSupportDocuments: [],
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        gender: null,
        movedFrom: null,
        arrivalToBCDate: null,
        arrivalToCanadaDate: null,
        madePermanentMove: null,
        outsideBCLast12Months: null,
        outsideBCLast12MonthsReason: null,
        outsideBCLast12MonthsDestination: null,
        outsideBCLast12MonthsDepartureDate: null,
        outsideBCLast12MonthsReturnDate: null,
        hasPreviousPHN: null,
        previousPHN: null,
        schoolName: null,
        schoolAddressLine1: null,
        schoolAddressLine2: null,
        schoolAddressLine3: null,
        schoolCity: null,
        schoolProvinceOrState: null,
        schoolCountry: null,
        schoolPostalCode: null,
        schoolDepartureDate: null,
        schoolCompletionDate: null,
        willResideInBCAfterStudies: null,
      });
    },
    removeChild(index) {
      this.children.splice(index, 1);
    },
    getChildTitle(index) {
      return 'Child #' + (index + 1) + ' basic information';
    },
    collapseChild(index) {
      this.children[index].collapsed = true;
      this.children = [...this.children];
    },
    expandChild(index) {
      this.children[index].collapsed = false;
      this.children = [...this.children];
    },
    expandAllChildren() {
      const children = this.children;
      children.forEach(child => {
        child.collapsed = false;
      });
      this.children = [...children];
    },
    citizenshipSupportDocumentOptions(child) {
      let options;

      if (child.status === StatusInCanada.PermanentResident) {
        options = selectOptionsPermanentResidentSupportDocuments;
      } else if (child.status === StatusInCanada.TemporaryResident){
        if (child.statusReason === CanadianStatusReasons.WorkingInBC) {
          options = selectOptionWorkPermitSupportDocument;
        } else if (child.statusReason === CanadianStatusReasons.StudyingInBC) {
          options = selectOptionStudyPermitSupportDocument;
        } else if (child.statusReason === CanadianStatusReasons.ReligiousWorker) {
          options = selectOptionReligiousWorkSupportDocument;
        } else if (child.statusReason === CanadianStatusReasons.Diplomat) {
          options = selectOptionDiplomaticFoilSupportDocument;
        } else if (child.statusReason === CanadianStatusReasons.Visiting) {
          options = selectOptionVisitorVisaSupportDocument;
        }
      } else {
        options = selectOptionsCitizenshipSupportDocuments;
      }

      return options;
    },
    handleBlurField(validationObject) {
      if (validationObject) {
        validationObject.$touch();
      }
    },
    validateFields() {
      this.saveData();

      if (!this.hasChildren) {
        this.navigateToNextPage();
        return;
      }

      this.$v.$touch()
      if (this.$v.$invalid) {
        this.expandAllChildren();
        scrollToError();
        return;
      }

      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(enrolmentModule + '/' + SET_HAS_CHILDREN, this.hasChildren);
      this.$store.dispatch(enrolmentModule + '/' + SET_NUM_CHILDREN, this.children.length);
      this.$store.dispatch(enrolmentModule + '/' + SET_CHILDREN, this.children);
    },
    navigateToNextPage() {
      // Determine which page to navigate to next
      let routePath;
      if (this.$store.state.enrolmentModule.isApplyingForFPCare) {
        routePath = enrolmentRoutes.FPCARE_INFO_PAGE.path;
      } else if (this.$store.state.enrolmentModule.isApplyingForSuppBen) {
        routePath = enrolmentRoutes.SUPP_BEN_INFO_PAGE.path;
      } else {
        routePath = enrolmentRoutes.CONTACT_INFO_PAGE.path;
      }

      // Navigate to next path
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        routePath
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
  },
  watch: {
    children(arr) {
      if (arr.length > 0) {
        this.hasChildren = true;
      } else {
        this.hasChildren = false;
      }
    }
  },
  computed: {
    maximumChildrenReached() {
      return this.children.length > 27;
    },
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
        enrolmentRoutes.CHILD_INFO_PAGE.path
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
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-header {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.remove-icon {
  cursor: pointer;
}

.collapsed {
  display: none;
}
</style>
