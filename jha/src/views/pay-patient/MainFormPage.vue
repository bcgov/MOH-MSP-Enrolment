<template>
  <div>
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-3">
        <div class="row align-items-end">
          <div class="col-md-7">
            <h1>Pay Patient Claim</h1>
          </div>
          <div class="col-md-5">
            <p class="text-right"><span class="required-asterisk">*</span> Required Information</p>
          </div>
        </div>
        <hr class="mt-0"/>

        <div v-if='isCSR'
            class="section-container p-3 mb-5">
          <a name='plan-reference-number'></a>
          <NumberInput label='Plan Reference Number:'
                id='plan-reference-number'
                v-model='planReferenceNumber'
                maxlength='10'
                :isRequiredAsteriskShown='true'
                :inputStyle='smallStyles' />
          <div class="text-danger"
              v-if="$v.planReferenceNumber.$dirty && !$v.planReferenceNumber.required"
              aria-live="assertive">Plan Reference Number is required.</div>
          <div class="text-danger"
              v-if="$v.planReferenceNumber.$dirty && $v.planReferenceNumber.required &&!$v.planReferenceNumber.intValidator"
              aria-live="assertive">Plan Reference Number must be an integer.</div>
          <div class="text-danger"
              v-if="$v.planReferenceNumber.$dirty && $v.planReferenceNumber.required && !$v.planReferenceNumber.positiveNumberValidator"
              aria-live="assertive">Plan Reference Number must be a positive number.</div>
          <div class="text-danger"
              v-if="$v.planReferenceNumber.$dirty && $v.planReferenceNumber.required && !$v.planReferenceNumber.minLength"
              aria-live="assertive">Plan Reference Number must be 10 digits long.</div>
        </div>

        <a name='patient'></a>
        <h2>Patient Information</h2>
        <div class="section-container p-3">
          <PhnInput label='Personal Health Number (PHN):'
                id='phn'
                v-model='phn'
                :isRequiredAsteriskShown='true'
                :inputStyle='smallStyles' />
          <div class="text-danger"
              v-if="$v.phn.$dirty && !$v.phn.required"
              aria-live="assertive">Personal Health Number (PHN) is required.</div>
          <div class="text-danger"
              v-if="$v.phn.$dirty && $v.phn.required && !$v.phn.phnValidator"
              aria-live="assertive">Personal Health Number (PHN) must be valid.</div>
          <NumberInput label='Dependant:'
                id='dependent-number'
                className='mt-3'
                v-model='dependentNumber'
                maxlength='2'
                :inputStyle='extraSmallStyles' />
          <div class="text-danger"
              v-if="$v.dependentNumber.$dirty && !$v.dependentNumber.intValidator"
              aria-live="assertive">Dependant must be an integer.</div>
          <div class="text-danger"
              v-if="$v.dependentNumber.$dirty && !$v.dependentNumber.positiveNumberValidator"
              aria-live="assertive">Dependant must be a positive number.</div>
          <div class="text-danger"
              v-if="$v.dependentNumber.$dirty && $v.dependentNumber.intValidator && $v.dependentNumber.positiveNumberValidator && !$v.dependentNumber.dependentNumberValidator"
              aria-live="assertive">Dependant must be 00 or 66 for this PHN.</div>
          <Input label='Patient Legal First Name:'
                id='first-name'
                className='mt-3'
                v-model='firstName'
                maxlength='12'
                :isRequiredAsteriskShown='true'
                :inputStyle='mediumStyles' />
          <div class="text-danger"
              v-if="$v.firstName.$dirty && !$v.firstName.required"
              aria-live="assertive">Patient Legal First Name is required.</div>
          <div class="text-danger"
              v-if="$v.firstName.$dirty && $v.firstName.required && !$v.firstName.nameValidator"
              aria-live="assertive">Patient Legal First Name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
          <Input label='Second Name Initial:'
                id='middle-initial'
                className='mt-3'
                v-model='middleInitial'
                maxlength='1'
                :inputStyle='extraSmallStyles' />
          <div class="text-danger"
              v-if="$v.middleInitial.$dirty && !$v.middleInitial.nameInitialValidator"
              aria-live="assertive">Second name initial must be a letter.</div>
          <Input label='Patient Legal Last Name:'
                id='last-name'
                className='mt-3'
                v-model='lastName'
                maxlength='18'
                :isRequiredAsteriskShown='true'
                :inputStyle='mediumStyles' />
          <div class="text-danger"
              v-if="$v.lastName.$dirty && !$v.lastName.required"
              aria-live="assertive">Patient Legal Last Name is required.</div>
          <div class="text-danger"
              v-if="$v.lastName.$dirty && $v.lastName.required && !$v.lastName.nameValidator"
              aria-live="assertive">Patient Legal Last Name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
          <DateInput label='Patient Birth Date:'
                id='birth-date'
                className='mt-3'
                v-model='birthDate'
                :isRequiredAsteriskShown="dependentNumber !== '66'" />
          <div class="text-danger"
              v-if="$v.birthDate.$dirty && dependentNumber !== '66' && !$v.birthDate.required"
              aria-live="assertive">Patient Birth Date is required.</div>
          <div class="text-danger"
              v-if="$v.birthDate.$dirty && !$v.birthDate.pastDateValidator"
              aria-live="assertive">Patient Birth Date cannot be in the future.</div>
        </div>
        
        <a name='vehicle-accident'></a>
        <div class="section-container p-3 mt-5">
          <Radio label='Is this claim related to a motor vehicle accident?'
                v-model='isVehicleAccident'
                :items='isVehicleAccidentOptions'
                :isRequiredAsteriskShown='true' />
          <div class="text-danger"
              v-if="$v.isVehicleAccident.$dirty && !$v.isVehicleAccident.required"
              aria-live="assertive">This field is required.</div>
          <MotorVehicleAccidentClaimNumberInput
                label='Motor Vehicle Accident Claim Number:'
                id='vehicle-accident-claim-number'
                class='mt-3'
                v-model='vehicleAccidentClaimNumber'
                :inputStyle='smallStyles' />
          <div class="text-danger"
              v-if="$v.vehicleAccidentClaimNumber.$dirty && !$v.vehicleAccidentClaimNumber.motorVehicleAccidentClaimNumberValidator"
              aria-live="assertive">Motor Vehicle Accident Claim Number must be valid.</div>
        </div> 

        <a name='claim-info'></a>
        <div class="section-container p-3 mt-5">
          <NumberInput label='Plan Reference Number of Original Claim:'
                id='plan-reference-number-of-original-claim'
                v-model='planReferenceNumberOfOriginalClaim'
                maxlength='10'
                :inputStyle='smallStyles'/>
          <div class="text-danger"
              v-if="$v.planReferenceNumberOfOriginalClaim.$dirty && !$v.planReferenceNumberOfOriginalClaim.intValidator"
              aria-live="assertive">Plan Reference Number of Original Claim must be an integer.</div>
          <div class="text-danger"
              v-if="$v.planReferenceNumberOfOriginalClaim.$dirty && !$v.planReferenceNumberOfOriginalClaim.positiveNumberValidator"
              aria-live="assertive">Plan Reference Number of Original Claim must be a positive number.</div>
        </div>

        <div v-for="(claim, index) in medicalServiceClaims"
            :key="index"
            :set="v = $v.medicalServiceClaims.$each[index]">
          <a :name='"medical-service-claim-" + index'></a>
          <h2 class="mt-5">{{getMedicalServiceClaimTitle(index)}}</h2>
          <div class="section-container p-3">
            <DateInput label='Service Date:'
                      :id="'service-date' + index"
                      v-model='claim.serviceDate'
                      :isRequiredAsteriskShown='true' />
            <div class="text-danger"
                v-if="v.serviceDate.$dirty && !v.serviceDate.required"
                aria-live="assertive">Service date is required.</div>
            <div class="text-danger"
                v-if="v.serviceDate.$dirty && v.serviceDate.required && !v.serviceDate.serviceDateValidator"
                aria-live="assertive">{{getServiceDateErrorMessage(claim.feeItem)}}</div>
            <NumberInput label='Number of Services:'
                  :id='"number-of-services-" + index'
                  class='mt-3'
                  v-model='claim.numberOfServices'
                  maxlength='2'
                  :isRequiredAsteriskShown='true'
                  :inputStyle='extraSmallStyles' />
            <div class="text-danger"
                v-if="v.numberOfServices.$dirty && !v.numberOfServices.required"
                aria-live="assertive">Number of services is required.</div>
            <div class="text-danger"
                v-if="v.numberOfServices.$dirty && v.numberOfServices.required && !v.numberOfServices.intValidator"
                aria-live="assertive">Number of Services must be an integer.</div>
            <div class="text-danger"
                v-if="v.numberOfServices.$dirty && v.numberOfServices.required && !v.numberOfServices.positiveNumberValidator"
                aria-live="assertive">Number of Services must be a positive number.</div>  
            <Input label='Service Clarification Code:'
                  :id='"service-clarification-code-" + index'
                  class='mt-3'
                  v-model='claim.serviceClarificationCode'
                  maxlength='2'
                  :isUpperCaseForced='true'
                  :inputStyle='extraSmallStyles' />
            <div class="text-danger"
                v-if="v.serviceClarificationCode.$dirty && !v.serviceClarificationCode.clarificationCodeValidator"
                aria-live="assertive">Service Clarification Code is invalid.</div>  
            <Input label='Fee Item:'
                  :id='"fee-item-" + index'
                  class='mt-3'
                  v-model='claim.feeItem'
                  maxlength='5'
                  :isRequiredAsteriskShown='true'
                  :inputStyle='smallStyles' />
            <div class="text-danger"
                v-if="v.feeItem.$dirty && !v.feeItem.required"
                aria-live="assertive">Fee item is required.</div>
            <NumberInput label='Amount Billed:'
                  :id='"amount-billed-" + index'
                  class='mt-3'
                  v-model='claim.amountBilled'
                  maxlength='7'
                  :isRequiredAsteriskShown='true'
                  :inputStyle='smallStyles' />
            <div class="text-danger"
                v-if="v.amountBilled.$dirty && !v.amountBilled.required"
                aria-live="assertive">Amount billed is required.</div>
            <div class="text-danger"
                v-if="v.amountBilled.$dirty && v.amountBilled.required && !v.amountBilled.dollarNumberValidator"
                aria-live="assertive">Amount billed must be a dollar amount. Example: 10.00</div>
            <div class="text-danger"
                v-if="v.amountBilled.$dirty && v.amountBilled.required && !v.amountBilled.positiveNumberValidator"
                aria-live="assertive">Amount billed must be a positive number.</div> 
            <div class="text-danger"
                v-if="v.amountBilled.$dirty && v.amountBilled.required && !v.amountBilled.amountBilledZeroValidator"
                aria-live="assertive">Amount billed must be zero if Fee item is '03333'.</div>
            <TimeInput label='Called Start Time:'
                      :id='"called-start-time-" + index'
                      className='mt-3'
                      v-model='claim.calledStartTime'
                      :isHourTwoDigits='true' />
            <div class="text-danger"
                v-if="v.calledStartTime.$dirty && !v.calledStartTime.partialTimeValidator"
                aria-live="assertive">Called start time must be an exact value.</div>
            <TimeInput label='Rendered Finish Time:'
                      :id='"rendered-finish-time-" + index'
                      className='mt-3'
                      v-model='claim.renderedFinishTime'
                      :isHourTwoDigits='true' />
            <div class="text-danger"
                v-if="v.renderedFinishTime.$dirty && !v.renderedFinishTime.partialTimeValidator"
                aria-live="assertive">Rendered finish time must be an exact value.</div>
            <Input label='Diagnostic Code:'
                  :id='"diagnostic-code-" + index'
                  class='mt-3'
                  v-model='claim.diagnosticCode'
                  maxlength='5'
                  :isRequiredAsteriskShown='true'
                  :inputStyle='smallStyles' />
            <div class="text-danger"
                v-if="v.diagnosticCode.$dirty && !v.diagnosticCode.required"
                aria-live="assertive">Diagnostic code is required.</div>
            <div class="text-danger"
                v-if="v.diagnosticCode.$dirty && v.diagnosticCode.required && !v.diagnosticCode.diagnosticCodeValidator"
                aria-live="assertive">Diagnostic code must be valid.</div>
            <Select label='Service Location Code:'
                  :id='"location-of-service-" + index'
                  class='mt-3'
                  v-model='claim.locationOfService'
                  :options='serviceLocationOptions'
                  :isRequiredAsteriskShown='true'
                  :inputStyle='extraLargeStyles'/>
            <div class="text-danger"
                v-if="v.locationOfService.$dirty && !v.locationOfService.required"
                aria-live="assertive">Service location code is required.</div>
            <Select label='Correspondence Attached:'
                :id='"correspondence-attached-" + index'
                class='mt-3'
                v-model='claim.correspondenceAttached'
                :options='correspondenceAttachedOptions'
                defaultOptionLabel='None'
                :inputStyle='largeStyles' />
            <Select label='Submission Code:'
                :id='"submission-code-" + index'
                class='mt-3'
                v-model='claim.submissionCode'
                defaultOptionLabel='None'
                :options='submissionCodeOptions'
                :isRequiredAsteriskShown='isSubmissionCodeRequired'
                :inputStyle='largeStyles' />
            <div class="text-danger"
                v-if="v.submissionCode.$dirty && isSubmissionCodeRequired && !v.submissionCode.required"
                aria-live="assertive">Submission code is required.</div>
            <Textarea label='Notes/Additional Information:'
                  :id='"notes-" + index'
                  class='mt-3'
                  v-model='claim.notes'
                  :remainingCharsMaxlength='400'
                  :isRemainingCharsShown='true'
                  :inputStyle='textareaStyle' />
          </div>
        </div>

        <a name='mailing-address'></a>
        <h2 class="mt-5">Payment Mailing Address</h2>
        <div class="section-container p-3">
          <Radio label='Whose address is this?'
                v-model='addressOwner'
                :items='addressOwnerOptions'
                :isRequiredAsteriskShown='true' />
          <div class="text-danger"
              v-if="$v.addressOwner.$dirty && !$v.addressOwner.required"
              aria-live="assertive">This field is required.</div>
          <Input label='Apartment / Unit:'
                id='unit-number'
                className='mt-3'
                v-model='unitNumber'
                maxlength='6'
                :inputStyle='smallStyles' />
          <Input label='Street Number:'
                id='street-number'
                className='mt-3'
                v-model='streetNumber'
                maxlength='6'
                :inputStyle='smallStyles' />
          <Input label='Street Name:'
                id='street-name'
                className='mt-3'
                v-model='streetName'
                maxlength='24'
                :isRequiredAsteriskShown='true'
                :inputStyle='mediumStyles' />
          <div class="text-danger"
              v-if="$v.streetName.$dirty && !$v.streetName.required"
              aria-live="assertive">Street Name is required.</div>
          <Input label='City:'
                id='city'
                className='mt-3'
                v-model='city'
                maxlength='22'
                :isRequiredAsteriskShown='true'
                :inputStyle='mediumStyles' />
          <div class="text-danger"
              v-if="$v.city.$dirty && !$v.city.required"
              aria-live="assertive">City is required.</div>
          <div class='my-3'>Province:</div>
          <p><strong>British Columbia</strong></p>
          <PostalCodeInput label='Postal Code:'
                id='postal-code'
                className='mt-3'
                v-model='postalCode'
                :isRequiredAsteriskShown='true'
                :inputStyle='smallStyles' />
          <div class="text-danger"
              v-if="$v.postalCode.$dirty && !$v.postalCode.required"
              aria-live="assertive">Postal Code is required.</div>
          <div class="text-danger"
              v-if="$v.postalCode.$dirty && $v.postalCode.required && !$v.postalCode.bcPostalCodeValidator"
              aria-live="assertive">Must be a valid BC postal code.</div>
        </div>

        <a name='practitioner'></a>
        <h2 class="mt-5">Practitioner Information</h2>
        <div class="section-container p-3">
          <Input label='Practitioner Last Name:'
                id='practitioner-last-name'
                v-model='practitionerLastName'
                maxlength='35'
                :inputStyle='mediumStyles'
                :isRequiredAsteriskShown='true'/>
          <div class="text-danger"
              v-if="$v.practitionerLastName.$dirty && !$v.practitionerLastName.required"
              aria-live="assertive">Practitioner Last Name is required.</div>
          <div class="text-danger"
              v-if="$v.practitionerLastName.$dirty && $v.practitionerLastName.required && !$v.practitionerLastName.nameValidator"
              aria-live="assertive">Practitioner Last Name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
          <Input label='Practitioner First Name:'
                id='practitioner-first-name'
                v-model='practitionerFirstName'
                maxlength='15'
                class='mt-3'
                :inputStyle='mediumStyles'
                :isRequiredAsteriskShown='true'/>
          <div class="text-danger"
              v-if="$v.practitionerFirstName.$dirty && !$v.practitionerFirstName.required"
              aria-live="assertive">Practitioner First Name is required.</div>
          <div class="text-danger"
              v-if="$v.practitionerFirstName.$dirty && $v.practitionerFirstName.required && !$v.practitionerFirstName.nameValidator"
              aria-live="assertive">Practitioner First Name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
          <!-- Using PractitionerNumberInput because payment number has the same format as a practitioner number -->
          <PractitionerNumberInput label='Payment Number:'
                id='payment-number'
                class='mt-3'
                v-model='practitionerPaymentNumber'
                :isRequiredAsteriskShown='true'
                :inputStyle='smallStyles'/>
          <div class="text-danger"
              v-if="$v.practitionerPaymentNumber.$dirty && !$v.practitionerPaymentNumber.required"
              aria-live="assertive">Payment number is required.</div>
          <div class="text-danger"
              v-if="$v.practitionerPaymentNumber.$dirty && $v.practitionerPaymentNumber.required && !$v.practitionerPaymentNumber.minLength"
              aria-live="assertive">Practitioner number must not be less than 5 characters.</div>
          <PractitionerNumberInput label='Practitioner Number:'
                id='practitioner-number'
                class='mt-3'
                v-model='practitionerPractitionerNumber'
                :isRequiredAsteriskShown='true'
                :inputStyle='smallStyles'/>
          <div class="text-danger"
              v-if="$v.practitionerPractitionerNumber.$dirty && !$v.practitionerPractitionerNumber.required"
              aria-live="assertive">Practitioner number is required.</div>
          <div class="text-danger"
              v-if="$v.practitionerPractitionerNumber.$dirty && $v.practitionerPractitionerNumber.required && !$v.practitionerPractitionerNumber.minLength"
              aria-live="assertive">Practitioner number must not be less than 5 characters.</div>
          <Input label='Specialty Code:'
                id='specialty-code'
                class='mt-3'
                v-model='practitionerSpecialtyCode'
                maxlength='2'
                :inputStyle='extraSmallStyles'/>
          <div class="text-danger"
              v-if="$v.practitionerSpecialtyCode.$dirty && !$v.practitionerSpecialtyCode.alphanumericValidator"
              aria-live="assertive">Specialty code must be alphanumeric.</div>
          <FacilityNumberInput label='Facility Number:'
                id='facility-number'
                class='mt-3'
                v-model='practitionerFacilityNumber'
                :inputStyle='smallStyles'/>
          <div class="text-danger"
              v-if="$v.practitionerFacilityNumber.$dirty && !$v.practitionerFacilityNumber.minLength"
              aria-live="assertive">Facility number must not be less than 5 characters.</div>
        </div>

        <a name='referred-by'></a>
        <h2 class="mt-5">Referred By</h2>
        <div class="section-container p-3">
          <PractitionerNumberInput label='Referred By Practitioner Number:'
                id='referred-by-practitioner-number'
                v-model='referredByPractitionerNumber'
                :isRequiredAsteriskShown='isReferredByPopulated'
                :inputStyle='smallStyles'/>
          <div class="text-danger"
              v-if="isReferredByPopulated && $v.referredByPractitionerNumber.$dirty && !$v.referredByPractitionerNumber.required"
              aria-live="assertive">Practitioner number is required.</div>
          <div class="text-danger"
              v-if="$v.referredByPractitionerNumber.$dirty && !$v.referredByPractitionerNumber.minLength"
              aria-live="assertive">Practitioner number must not be less than 5 characters.</div>
          <Input label='Referred By Practitioner Last Name:'
                id='referred-by-last-name'
                v-model='referredByLastName'
                maxlength='18'
                class='mt-3'
                :isRequiredAsteriskShown='isReferredByPopulated'
                :inputStyle='mediumStyles'/>
          <div class="text-danger"
              v-if="isReferredByPopulated && $v.referredByLastName.$dirty && !$v.referredByLastName.required"
              aria-live="assertive">Last name is required.</div>
          <div class="text-danger"
              v-if="$v.referredByLastName.$dirty && !$v.referredByLastName.nameValidator"
              aria-live="assertive">Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
          <Input label='Referred By Practitioner First Name Initial:'
                id='referred-by-first-name-initial'
                v-model='referredByFirstNameInitial'
                maxlength='1'
                class='mt-3'
                :isRequiredAsteriskShown='isReferredByPopulated'
                :inputStyle='extraSmallStyles'/>
          <div class="text-danger"
              v-if="isReferredByPopulated && $v.referredByFirstNameInitial.$dirty && !$v.referredByFirstNameInitial.required"
              aria-live="assertive">First name is required.</div>
          <div class="text-danger"
              v-if="$v.referredByFirstNameInitial.$dirty && !$v.referredByFirstNameInitial.alphaValidator"
              aria-live="assertive">First name initial must only be an alphabetic character.</div>
        </div>

        <a name='referred-to'></a>
        <h2 class="mt-5">Referred To</h2>
        <div class="section-container p-3">
          <PractitionerNumberInput label='Referred To Practitioner Number:'
                id='referred-to-practitioner-number'
                v-model='referredToPractitionerNumber'
                :isRequiredAsteriskShown='isReferredToPopulated'
                :inputStyle='smallStyles'/>
          <div class="text-danger"
              v-if="isReferredToPopulated && $v.referredToPractitionerNumber.$dirty && !$v.referredToPractitionerNumber.required"
              aria-live="assertive">Practitioner number is required.</div>
          <div class="text-danger"
              v-if="$v.referredToPractitionerNumber.$dirty && !$v.referredToPractitionerNumber.minLength"
              aria-live="assertive">Practitioner number must not be less than 5 characters.</div>
          <Input label='Referred To Practitioner Last Name:'
                id='referred-to-last-name'
                v-model='referredToLastName'
                maxlength='18'
                class='mt-3'
                :isRequiredAsteriskShown='isReferredToPopulated'
                :inputStyle='mediumStyles'/>
          <div class="text-danger"
              v-if="isReferredToPopulated && $v.referredToLastName.$dirty && !$v.referredToLastName.required"
              aria-live="assertive">Last name is required.</div>
          <div class="text-danger"
              v-if="$v.referredToLastName.$dirty && !$v.referredToLastName.nameValidator"
              aria-live="assertive">Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
          <Input label='Referred To Practitioner First Name Initial:'
                id='referred-to-first-name-initial'
                v-model='referredToFirstNameInitial'
                maxlength='1'
                class='mt-3'
                :isRequiredAsteriskShown='isReferredToPopulated'
                :inputStyle='extraSmallStyles'/>
          <div class="text-danger"
              v-if="isReferredToPopulated && $v.referredToFirstNameInitial.$dirty && !$v.referredToFirstNameInitial.required"
              aria-live="assertive">First name is required.</div>
          <div class="text-danger"
              v-if="$v.referredToFirstNameInitial.$dirty && !$v.referredToFirstNameInitial.alphaValidator"
              aria-live="assertive">First name initial must only be an alphabetic character.</div>
        </div>
      </div>
    </PageContent>
    <PromptModal v-if='isValidationModalShown'
                title='Warning'
                @yes='validationModalYesHandler()'
                @no='validationModalNoHandler()'>
      <p>The following items do not match our records:</p>
      <ul v-if="validationWarningList.length > 0">
        <li v-for="(item, index) in validationWarningList"
            :key="index"
            class="text-danger validation-warning-item">{{item}}</li>
      </ul>
      <p>Do you wish to continue?</p>
    </PromptModal>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import {
  payPatientRoutes,
  isPastPath,
} from '@/router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition
} from '@/helpers/scroll';
import {
  getConvertedPath,
  isCSR,
} from '@/helpers/url';
import {
  clarificationCodeValidator,
  diagnosticCodeValidator,
} from '@/helpers/validators';
import {
  selectOptionsSubmissionCode,
  selectOptionsCorrespondenceAttached,
  selectOptionsServiceLocation,
} from '@/constants/select-options';
import {
  extraSmallStyles,
  smallStyles,
  mediumStyles,
  largeStyles,
  extraLargeStyles,
} from '@/constants/input-styles';
import ContinueBar from '@/components/ContinueBar.vue';
import PageContent from '@/components/PageContent.vue';
import {
  MODULE_NAME as formModule,
  RESET_FORM,
  SET_PLAN_REFERENCE_NUMBER,
  SET_PHN,
  SET_DEPENDENT_NUMBER,
  SET_FIRST_NAME,
  SET_MIDDLE_INITIAL,
  SET_LAST_NAME,
  SET_BIRTH_DATE,
  SET_ADDRESS_OWNER,
  SET_UNIT_NUMBER,
  SET_STREET_NUMBER,
  SET_STREET_NAME,
  SET_CITY,
  SET_POSTAL_CODE,
  SET_IS_VEHICLE_ACCIDENT,
  SET_VEHICLE_ACCIDENT_CLAIM_NUMBER,
  SET_PLAN_REFERENCE_NUMBER_OF_ORIGINAL_CLAIM,
  SET_MEDICAL_SERVICE_CLAIMS,
  SET_PRACTITIONER_LAST_NAME,
  SET_PRACTITIONER_FIRST_NAME,
  SET_PRACTITIONER_PAYMENT_NUMBER,
  SET_PRACTITIONER_PRACTITIONER_NUMBER,
  SET_PRACTITIONER_FACILITY_NUMBER,
  SET_PRACTITIONER_SPECIALTY_CODE,
  SET_REFERRED_BY_LAST_NAME,
  SET_REFERRED_BY_FIRST_NAME_INITIAL,
  SET_REFERRED_BY_PRACTITIONER_NUMBER,
  SET_REFERRED_TO_LAST_NAME,
  SET_REFERRED_TO_FIRST_NAME_INITIAL,
  SET_REFERRED_TO_PRACTITIONER_NUMBER,
} from '@/store/modules/pay-patient-form';
import logService from '@/services/log-service';
import { required, maxLength, minLength } from 'vuelidate/lib/validators';
import {
  DateInput,
  FacilityNumberInput,
  Input,
  MotorVehicleAccidentClaimNumberInput,
  NumberInput,
  PhnInput,
  PostalCodeInput,
  PractitionerNumberInput,
  PromptModal,
  Radio,
  Select,
  Textarea,
  TimeInput,
  alphanumericValidator,
  alphaValidator,
  cloneDeep,
  dollarNumberValidator,
  intValidator,
  motorVehicleAccidentClaimNumberValidator,
  optionalValidator,
  pastDateValidator,
  phnValidator,
  positiveNumberValidator,
} from 'common-lib-vue';
import {
  startOfToday,
  addDays,
  isBefore,
  subDays,
} from 'date-fns';

const bcPostalCodeValidator = (value) => {
  if (value && value !== '') {
    const criteria = RegExp('^[Vv]\\d[A-Za-z][ ]?\\d[A-Za-z]\\d$');
    return criteria.test(value);
  }
  return true;
};

const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

const nameInitialValidator = (value) => {
  const criteria = /^[a-zA-Z]*$/;
  return criteria.test(value);
};

const dependentNumberValidator = (value, vm) => {
  const phn = vm.phn;
  if (phn && phn[0] === '9' && !(value === '00' || value === '66')) {
    return false;
  }
  return true;
};

const amountBilledZeroValidator = (value, vm) => {
  const feeItem = vm.feeItem;
  const parsedValue = parseFloat(value);
  if (feeItem && feeItem === '03333' && parsedValue !== 0) {
    return false;
  }
  return true;
};

const serviceDateValidator = (value, vm) => {
  const feeItem = vm.feeItem;
  if (!value) {
    return false;
  }
  if (feeItem === '03333') {
    const future90Days = addDays(startOfToday(), 90);
    return isBefore(value, future90Days);
  }
  return isBefore(value, addDays(startOfToday(), 1)); // Add 1 day to include today's date.
};

const partialTimeValidator = (value) => {
  if ((value.hour && !value.minute)
    || (!value.hour && value.minute)) {
    return false;
  }
  return true;
};

export default {
  name: 'MainFormPage',
  components: {
    ContinueBar,
    DateInput,
    FacilityNumberInput,
    Input,
    MotorVehicleAccidentClaimNumberInput,
    NumberInput,
    PageContent,
    PhnInput,
    PostalCodeInput,
    PractitionerNumberInput,
    PromptModal,
    Radio,
    Select,
    Textarea,
    TimeInput,
  },
  data: () => {
    return {
      isPageLoaded: false,
      isValidationModalShown: false,
      addressOwnerOptions: [
        {
          id: 'address-owner-practitioner',
          label: 'Practitioner',
          value: 'PRACTITIONER',
        },
        {
          id: 'address-owner-patient',
          label: 'Patient',
          value: 'PATIENT',
        }
      ],
      isVehicleAccidentOptions: [
        {
          id: 'is-vehicle-accident-y',
          label: 'Yes',
          value: 'Y',
        },
        {
          id: 'is-vehicle-accident-n',
          label: 'No',
          value: 'N',
        }
      ],
      correspondenceAttachedOptions: selectOptionsCorrespondenceAttached,
      submissionCodeOptions: selectOptionsSubmissionCode,
      serviceLocationOptions: selectOptionsServiceLocation,
      extraSmallStyles,
      smallStyles,
      mediumStyles,
      largeStyles,
      extraLargeStyles,
      textareaStyle: {
        height: '150px'
      },

      planReferenceNumber: null,
      phn: null,
      dependentNumber: null,
      firstName: null,
      middleInitial: null,
      lastName: null,
      birthDate: null,

      addressOwner: null,
      unitNumber: null,
      streetNumber: null,
      streetName: null,
      city: null,
      postalCode: null,

      isVehicleAccident: null,
      vehicleAccidentClaimNumber: null,

      planReferenceNumberOfOriginalClaim: null,

      medicalServiceClaims: [],

      practitionerLastName: null,
      practitionerFirstName: null,
      practitionerPaymentNumber: null,
      practitionerPractitionerNumber: null,
      practitionerFacilityNumber: null,
      practitionerSpecialtyCode: null,

      referredByFirstNameInitial: null,
      referredByLastName: null,
      referredByPractitionerNumber: null,

      referredToFirstNameInitial: null,
      referredToLastName: null,
      referredToPractitionerNumber: null,
    };
  },
  created() {
    this.planReferenceNumber = this.$store.state.payPatientForm.planReferenceNumber;

    this.phn = this.$store.state.payPatientForm.phn;
    this.dependentNumber = this.$store.state.payPatientForm.dependentNumber;
    this.firstName = this.$store.state.payPatientForm.firstName;
    this.middleInitial = this.$store.state.payPatientForm.middleInitial;
    this.lastName = this.$store.state.payPatientForm.lastName;
    this.birthDate = this.$store.state.payPatientForm.birthDate;

    this.addressOwner = this.$store.state.payPatientForm.addressOwner;
    this.unitNumber = this.$store.state.payPatientForm.unitNumber;
    this.streetNumber = this.$store.state.payPatientForm.streetNumber;
    this.streetName = this.$store.state.payPatientForm.streetName;
    this.city = this.$store.state.payPatientForm.city;
    this.postalCode = this.$store.state.payPatientForm.postalCode;

    this.isVehicleAccident = this.$store.state.payPatientForm.isVehicleAccident;
    this.vehicleAccidentClaimNumber = this.$store.state.payPatientForm.vehicleAccidentClaimNumber;

    this.planReferenceNumberOfOriginalClaim = this.$store.state.payPatientForm.planReferenceNumberOfOriginalClaim;

    this.medicalServiceClaims = this.$store.state.payPatientForm.medicalServiceClaims ? cloneDeep(this.$store.state.payPatientForm.medicalServiceClaims) : [];

    this.practitionerLastName = this.$store.state.payPatientForm.practitionerLastName;
    this.practitionerFirstName = this.$store.state.payPatientForm.practitionerFirstName;
    this.practitionerPaymentNumber = this.$store.state.payPatientForm.practitionerPaymentNumber;
    this.practitionerPractitionerNumber = this.$store.state.payPatientForm.practitionerPractitionerNumber;
    this.practitionerFacilityNumber = this.$store.state.payPatientForm.practitionerFacilityNumber;
    this.practitionerSpecialtyCode = this.$store.state.payPatientForm.practitionerSpecialtyCode;

    this.referredByFirstNameInitial = this.$store.state.payPatientForm.referredByFirstNameInitial;
    this.referredByLastName = this.$store.state.payPatientForm.referredByLastName;
    this.referredByPractitionerNumber = this.$store.state.payPatientForm.referredByPractitionerNumber;

    this.referredToFirstNameInitial = this.$store.state.payPatientForm.referredToFirstNameInitial;
    this.referredToLastName = this.$store.state.payPatientForm.referredToLastName;
    this.referredToPractitionerNumber = this.$store.state.payPatientForm.referredToPractitionerNumber;

    setTimeout(() => {
      this.isPageLoaded = true;
    }, 0);

    logService.logNavigation(
      this.$store.state.payPatientForm.applicationUuid,
      payPatientRoutes.MAIN_FORM_PAGE.path,
      payPatientRoutes.MAIN_FORM_PAGE.title
    );
  },
  validations() {
    const validations = {
      planReferenceNumber: {},
      phn: {
        required,
        phnValidator,
      },
      dependentNumber: {
        intValidator: optionalValidator(intValidator),
        positiveNumberValidator: optionalValidator(positiveNumberValidator),
        dependentNumberValidator: optionalValidator(dependentNumberValidator),
      },
      firstName: {
        required,
        nameValidator,
      },
      middleInitial: {
        nameInitialValidator: optionalValidator(nameInitialValidator),
      },
      lastName: {
        required,
        nameValidator,
      },
      birthDate: {
        pastDateValidator: optionalValidator(pastDateValidator),
      },
      addressOwner: {
        required,
      },
      streetName: {
        required,
      },
      city: {
        required,
      },
      postalCode: {
        required,
        bcPostalCodeValidator,
      },
      isVehicleAccident: {
        required,
      },
      vehicleAccidentClaimNumber: {
        motorVehicleAccidentClaimNumberValidator: optionalValidator(motorVehicleAccidentClaimNumberValidator),
      },
      planReferenceNumberOfOriginalClaim: {
        intValidator: optionalValidator(intValidator),
        positiveNumberValidator: optionalValidator(positiveNumberValidator),
      },
      medicalServiceClaims: {
        $each: {
          serviceDate: {
            required,
            serviceDateValidator,
          },
          numberOfServices: {
            required,
            intValidator,
            positiveNumberValidator,
          },
          feeItem: {
            required,
          },
          amountBilled: {
            required,
            dollarNumberValidator,
            positiveNumberValidator,
            amountBilledZeroValidator,
          },
          calledStartTime: {
            partialTimeValidator: optionalValidator(partialTimeValidator),
          },
          renderedFinishTime: {
            partialTimeValidator: optionalValidator(partialTimeValidator),
          },
          diagnosticCode: {
            required,
            diagnosticCodeValidator,
          },
          locationOfService: {
            required,
          },
          serviceClarificationCode: {
            clarificationCodeValidator: optionalValidator(clarificationCodeValidator),
          },
          submissionCode: {},
          notes: {
            maxLength: maxLength(400),
          },
        }
      },
      practitionerLastName: {
        required,
        nameValidator,
      },
      practitionerFirstName: {
        required,
        nameValidator,
      },
      practitionerPaymentNumber: {
        required,
        minLength: minLength(5),
      },
      practitionerPractitionerNumber: {
        required,
        minLength: minLength(5),
      },
      practitionerFacilityNumber: {
        minLength: optionalValidator(minLength(5)),
      },
      practitionerSpecialtyCode: {
        alphanumericValidator: optionalValidator(alphanumericValidator),
      },
      referredByFirstNameInitial: {
        alphaValidator: optionalValidator(alphaValidator),
      },
      referredByLastName: {
        nameValidator: optionalValidator(nameValidator),
      },
      referredByPractitionerNumber: {
        minLength: optionalValidator(minLength(5)),
      },
      referredToFirstNameInitial: {
        alphaValidator: optionalValidator(alphaValidator),
      },
      referredToLastName: {
        nameValidator: optionalValidator(nameValidator),
      },
      referredToPractitionerNumber: {
        minLength: optionalValidator(minLength(5)),
      },
    };
    if (this.dependentNumber !== '66') {
      validations.birthDate.required = required;
    }
    if (this.isReferredByPopulated) {
      validations.referredByFirstNameInitial.required = required;
      validations.referredByLastName.required = required;
      validations.referredByPractitionerNumber.required = required;
    }
    if (this.isReferredToPopulated) {
      validations.referredToFirstNameInitial.required = required;
      validations.referredToLastName.required = required;
      validations.referredToPractitionerNumber.required = required;
    }
    if (this.isSubmissionCodeRequired) {
      validations.medicalServiceClaims.$each.submissionCode.required = required; 
    }
    if (this.isCSR) {
      validations.planReferenceNumber = {
        required,
        intValidator,
        positiveNumberValidator,
        minLength: minLength(10),
      };
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

      // Do server-side validation.
      this.isValidationModalShown = true;

      // this.navigateToNextPage();
    },
    validationModalYesHandler() {
      this.navigateToNextPage();
    },
    validationModalNoHandler() {
      this.isValidationModalShown = false;
    },
    navigateToNextPage() {
      this.$store.dispatch(formModule + '/' + SET_PLAN_REFERENCE_NUMBER, this.planReferenceNumber);

      this.$store.dispatch(formModule + '/' + SET_PHN, this.phn);
      this.$store.dispatch(formModule + '/' + SET_DEPENDENT_NUMBER, this.dependentNumber);
      this.$store.dispatch(formModule + '/' + SET_FIRST_NAME, this.firstName);
      this.$store.dispatch(formModule + '/' + SET_MIDDLE_INITIAL, this.middleInitial);
      this.$store.dispatch(formModule + '/' + SET_LAST_NAME, this.lastName);
      this.$store.dispatch(formModule + '/' + SET_BIRTH_DATE, this.birthDate);

      this.$store.dispatch(formModule + '/' + SET_ADDRESS_OWNER, this.addressOwner);
      this.$store.dispatch(formModule + '/' + SET_UNIT_NUMBER, this.unitNumber);
      this.$store.dispatch(formModule + '/' + SET_STREET_NUMBER, this.streetNumber);
      this.$store.dispatch(formModule + '/' + SET_STREET_NAME, this.streetName);
      this.$store.dispatch(formModule + '/' + SET_CITY, this.city);
      this.$store.dispatch(formModule + '/' + SET_POSTAL_CODE, this.postalCode);

      this.$store.dispatch(formModule + '/' + SET_IS_VEHICLE_ACCIDENT, this.isVehicleAccident);
      this.$store.dispatch(formModule + '/' + SET_VEHICLE_ACCIDENT_CLAIM_NUMBER, this.vehicleAccidentClaimNumber);

      this.$store.dispatch(formModule + '/' + SET_PLAN_REFERENCE_NUMBER_OF_ORIGINAL_CLAIM, this.planReferenceNumberOfOriginalClaim);

      this.$store.dispatch(formModule + '/' + SET_MEDICAL_SERVICE_CLAIMS, this.medicalServiceClaims);

      this.$store.dispatch(formModule + '/' + SET_PRACTITIONER_LAST_NAME, this.practitionerLastName);
      this.$store.dispatch(formModule + '/' + SET_PRACTITIONER_FIRST_NAME, this.practitionerFirstName);
      this.$store.dispatch(formModule + '/' + SET_PRACTITIONER_PAYMENT_NUMBER, this.practitionerPaymentNumber);
      this.$store.dispatch(formModule + '/' + SET_PRACTITIONER_PRACTITIONER_NUMBER, this.practitionerPractitionerNumber);
      this.$store.dispatch(formModule + '/' + SET_PRACTITIONER_FACILITY_NUMBER, this.practitionerFacilityNumber);
      this.$store.dispatch(formModule + '/' + SET_PRACTITIONER_SPECIALTY_CODE, this.practitionerSpecialtyCode);

      this.$store.dispatch(formModule + '/' + SET_REFERRED_BY_FIRST_NAME_INITIAL, this.referredByFirstNameInitial);
      this.$store.dispatch(formModule + '/' + SET_REFERRED_BY_LAST_NAME, this.referredByLastName);
      this.$store.dispatch(formModule + '/' + SET_REFERRED_BY_PRACTITIONER_NUMBER, this.referredByPractitionerNumber);

      this.$store.dispatch(formModule + '/' + SET_REFERRED_TO_FIRST_NAME_INITIAL, this.referredToFirstNameInitial);
      this.$store.dispatch(formModule + '/' + SET_REFERRED_TO_LAST_NAME, this.referredToLastName);
      this.$store.dispatch(formModule + '/' + SET_REFERRED_TO_PRACTITIONER_NUMBER, this.referredToPractitionerNumber);

      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPatientRoutes.REVIEW_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    getMedicalServiceClaimTitle(index) {
      if (this.medicalServiceClaims && this.medicalServiceClaims.length > 1) {
        return `Service (${index + 1} of ${this.medicalServiceClaims.length})`;
      }
      return 'Service';
    },
    getServiceDateErrorMessage(feeItem) {
      if (feeItem === '03333') {
        return 'Service date cannot be more than 90 days in the future.';
      }
      return 'Service date cannot be in the future.';
    },
  },
  computed: {
    isReferredByPopulated() {
      return !!this.referredByFirstNameInitial
          || !!this.referredByLastName
          || !!this.referredByPractitionerNumber;
    },
    isReferredToPopulated() {
      return !!this.referredToFirstNameInitial
          || !!this.referredToLastName
          || !!this.referredToPractitionerNumber;
    },
    isSubmissionCodeRequired() {
      const past90Days = subDays(startOfToday(), 90);
      let furthestServiceDate;

      for (let i=0; i<this.medicalServiceClaims.length; i++) {
        if (furthestServiceDate) {
          if (this.medicalServiceClaims[i].serviceDate
            && isBefore(this.medicalServiceClaims[i].serviceDate, furthestServiceDate)) {
            furthestServiceDate = this.medicalServiceClaims[i].serviceDate;
          }
        } else {
          furthestServiceDate = this.medicalServiceClaims[i].serviceDate;
        }
      }
      if (!furthestServiceDate) {
        return false;
      }
      return isBefore(furthestServiceDate, past90Days);
    },
    isCSR() {
      return isCSR(this.$router.currentRoute.path);
    },
    validationWarningList() {
      const result = [];
      result.push('Placeholder field name');
      return result;
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
        payPatientRoutes.MAIN_FORM_PAGE.path
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
.validation-warning-item {
  font-size: 1rem;
}
.section-container {
  background-color: #EEE;
}
</style>
