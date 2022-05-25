<template>
  <div>
    <div class="container stepper">
      <PageStepper :currentPath='$router.currentRoute.value.path'
        :routes='stepRoutes'
        @toggleShowMobileDetails='handleToggleShowMobileStepperDetails($event)'
        :isMobileStepperOpen='isMobileStepperOpen'
        @onClickLink='handleClickStepperLink($event)'/>
    </div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Supplementary Benefits Financial Information</h1>
        <h4 class="font-weight-normal">
          Your application must be based on income from the most recent Notice of 
          Assessment or Notice of Reassessment available from Canada Revenue Agency(CRA). 
          You will be required to upload a copy (and your spouse's, if applicable) with your application.
        </h4>
        <hr class="mt-0"/>
        <div class="row">
          <div class="col-md-7">
            <h2>Which year's Notice of Assessment or Reassessment will you upload?</h2>
            <Radio id="select-noa-year"
                    name="select-noa-year"
                    class="mt-3"
                    v-model="selectedNOAYear"
                    :items="radioOptionsNOAYears"
                    @blur="handleBlurField(v$.selectedNOAYear)"/>
            <div class="text-danger"
                  v-if="v$.selectedNOAYear.$dirty && v$.selectedNOAYear.required.$invalid"
                    aria-live="assertive">Please indicate which year's Notice of Assessment you are uploading.</div>
            <div v-if="selectedNOAYear === `${this.currentYear - 2}`" class="text-danger">
              <font-awesome-icon icon="exclamation-circle"/>
              Selecting this Notice of Assessment will allow you to apply for supplementary benefits for the rest of the current calendar year only. Provide a more recent Notice of Assessment to apply for the rest of the calendar year <strong>and</strong> the next calendar year.
            </div>
            <p class="mt-2 mb-1 font-weight-bolder">Enter your {{selectedNOAYear}} net income.</p>
            <CurrencyInput id="ah-net-income"
              label="See line 23600 of your Notice of Assessment or Reassessment."
              v-model="ahSBIncome"
              maxlength="6"
              :inputStyle='mediumStyles'
              @blur="handleBlurField(v$.ahSBIncome)"/>
              <div class="text-danger"
                  v-if="v$.ahSBIncome.$dirty && v$.ahSBIncome.required.$invalid"
                    aria-live="assertive">Your net income from {{selectedNOAYear}} is required.</div>
              <div class="text-danger"
                  v-if="v$.ahSBIncome.$dirty && v$.ahSBIncome.positiveNumberValidator.$invalid"
                    aria-live="assertive">Your net income must be a positive number.</div>
            <div v-if="hasSpouse === 'Y'">
              <p class="mt-4 mb-1 font-weight-bolder">Enter your spouse's {{selectedNOAYear}} net income.</p>
              <CurrencyInput id="spouse-net-income"
                label="See line 23600 of your spouse's Notice of Assessment or Reassessment."
                v-model="spouseSBIncome"
                maxlength="6"
                :inputStyle='mediumStyles'
                @blur="handleBlurField(v$.spouseSBIncome)"/>
              <div class="text-danger"
                  v-if="v$.spouseSBIncome.$dirty && v$.spouseSBIncome.required.$invalid"
                    aria-live="assertive">Your spouse/common-law partner's net income from {{selectedNOAYear}} is required.</div>
              <div class="text-danger"
                  v-if="v$.spouseSBIncome.$dirty && v$.spouseSBIncome.positiveNumberValidator.$invalid"
                    aria-live="assertive">Your spouse/common-law partner's net income must be a positive number.</div>
            </div>

            <div v-if="onlySuppBen">
              <p class="mt-4 mb-1 font-weight-bolder">Do you have any children on your Medical Services Plan account?</p>
              <Radio id="has-children"
                name="has-children"
                v-model="hasChildren"
                :items="radioOptionsNoYes"
                @blur="handleBlurField(v$.hasChildren)"/>
              <div class="text-danger"
                  v-if="v$.hasChildren.$dirty && v$.hasChildren.required.$invalid"
                    aria-live="assertive">Please indicate if you have children on your Medical Services Plan account.</div>
              <div v-if="hasChildren === 'Y'">
                <DigitInput id="num-children"
                  label="How many children do you have on your account?"
                  v-model="numChildren"
                  :inputStyle="extraSmallStyles"
                  @blur="handleBlurField(v$.numChildren)"/>
                <div class="text-danger"
                  v-if="v$.numChildren.$dirty && v$.numChildren.required.$invalid"
                    aria-live="assertive">You must enter how many children are on your account.</div>
                <div class="text-danger"
                  v-if="v$.numChildren.$dirty
                      && !v$.numChildren.required.$invalid
                      && v$.numChildren.validateNumChildren.$invalid"
                    aria-live="assertive">This number cannot be zero or over 28.</div>
              </div>
            </div>

            <div v-if="intNumChildren > 0">
              <p class="mt-4 mb-1 font-weight-bolder">How much did you claim for child care expenses in {{selectedNOAYear}}?</p>
              <CurrencyInput id="child-care-expenses"
                label="See line 21400 of your Notice of Assessment or Reassessment."
                v-model="claimedChildCareExpenses"
                maxlength="6"
                :inputStyle='mediumStyles'
                @blur="handleBlurField(v$.claimedChildCareExpenses)"/>
              <div class="text-danger"
                v-if="v$.claimedChildCareExpenses.$dirty && v$.claimedChildCareExpenses.required.$invalid"
                  aria-live="assertive">Your claimed child care expenses from {{selectedNOAYear}} are required.</div>
            </div>

            <p class="mt-4 mb-1 font-weight-bolder">Did anyone on your Medical Services Plan account claim a disability tax credit in {{selectedNOAYear}}?</p>
            <Radio id="has-disability-credit"
              name="has-disability-credit"
              label="See line 31600, 31800, or 32600 of your Notice of Assessment or Reassessment."
              v-model="hasDisabilityCredit"
              :items="radioOptionsNoYes"
              @blur="handleBlurField(v$.hasDisabilityCredit)"/>
            <div class="text-danger"
                  v-if="v$.hasDisabilityCredit.$dirty && v$.hasDisabilityCredit.required.$invalid"
                    aria-live="assertive">Please indicate if anyone on your Medical Services Plan has claimed a disability tax credit in {{selectedNOAYear}}.</div>

            <div class="ml-5" v-if="hasDisabilityCredit === 'Y'">
              <CheckboxGroup id="selected-disability-credit-recipients"
                name="selected-disability-credit-recipients"
                label="Who claimed the disability tax credit?"
                v-model="selectedDisabilityRecipients"
                :items="selectOptionsFamilyMembers"
                icon='cross'
                @blur="handleBlurField(v$.selectedDisabilityRecipients)"/>
              <div class="text-danger"
                v-if="v$.selectedDisabilityRecipients.$dirty && v$.selectedDisabilityRecipients.required.$invalid"
                  aria-live="assertive">You must select who claimed the disability tax credit.</div>
              <div class="text-danger"
                v-if="v$.selectedDisabilityRecipients.$dirty && v$.selectedDisabilityRecipients.notApplyingForBoth.$invalid"
                  aria-live="assertive">You have already selected nursing home credit for this person. Please remove nursing home credit if you want to claim disability credit for them.</div>
              <div v-if="selectedDisabilityRecipients.includes('child')">
                <DigitInput id="num-attendant-nursing-children"
                  label="How many of your children are eligible for a disability tax credit?"
                  v-model="numDisabilityChildren"
                  :inputStyle="extraSmallStyles"
                  @blur="handleBlurField(v$.numDisabilityChildren)"/>
                <div class="text-danger"
                  v-if="v$.numDisabilityChildren.$dirty && v$.numDisabilityChildren.required.$invalid"
                    aria-live="assertive">You must enter how many of your children claimed the disability tax credit.</div>
                <div class="text-danger"
                  v-if="v$.numDisabilityChildren.$dirty
                      && !v$.numDisabilityChildren.required.$invalid
                      && v$.numDisabilityChildren.validateNumChildClaims.$invalid"
                    aria-live="assertive">This number cannot be zero or exceed the number of children on your account.</div>
              </div>
            </div>

            <p class="mt-4 mb-1 font-weight-bolder">Does anyone on your Medical Services Plan account have a Registered Disability Savings Plan?</p>
            <Radio id="has-disability-savings"
              name="has-disability-savings"
              v-model="hasRDSP"
              :items="radioOptionsNoYes"
              @blur="handleBlurField(v$.hasRDSP)"/>
            <div class="text-danger"
                  v-if="v$.hasRDSP.$dirty && v$.hasRDSP.required.$invalid"
                    aria-live="assertive">Please indicate if anyone on your Medical Services Plan has a Registered Disability Savings Plan.</div>

            <div class="ml-5" v-if="hasRDSP === 'Y'">
              <p class="mt-4 mb-1 font-weight-bolder">How much did you report for a Registered Disability Savings Plan in {{selectedNOAYear}}?</p>
              <CurrencyInput id="disability-savings-plan"
                label="See Line 12500 of the Notice of Assessment or Reassessment"
                v-model="sbRDSPAmount"
                maxlength="6"
                :inputStyle='mediumStyles'
                @blur="handleBlurField(v$.sbRDSPAmount)"/>
              <div class="text-danger"
                v-if="v$.sbRDSPAmount.$dirty && v$.sbRDSPAmount.required.$invalid"
                  aria-live="assertive">You must enter how much you reported for a Registered Disability Savings Plan</div>
            </div>

            <p class="mt-4 mb-1 font-weight-bolder">Did anyone on your Medical Services Plan account claim attendant or nursing home expenses in place of a disability in {{selectedNOAYear}}?</p>
            <Radio id="has-attendant-nursing-expenses"
              name="has-attendant-nursing-expenses"
              label="See line 21500 or 33099 of your Notice of Assessment or Reassessment."
              v-model="hasAttendantNursingExpenses"
              :items="radioOptionsNoYes"
              @blur="handleBlurField(v$.hasAttendantNursingExpenses)"/>
            <div class="text-danger"
                  v-if="v$.hasAttendantNursingExpenses.$dirty && v$.hasAttendantNursingExpenses.required.$invalid"
                    aria-live="assertive">Please indicate if anyone on your Medical Services Plan has claimed attendant or nursing home expenses in place of a disability in {{selectedNOAYear}}.</div>
            <div class="ml-5" v-if="hasAttendantNursingExpenses === 'Y'">
              <CheckboxGroup id="selected-attendant-nursing-recipients"
                name="selected-attendant-nursing-recipients"
                label="Who claimed the attendant or nursing home expenses?"
                v-model="selectedAttendantNursingRecipients"
                :items="selectOptionsFamilyMembers"
                icon='cross'
                @blur="handleBlurField(v$.selectedAttendantNursingRecipients)"/>
              <div class="text-danger"
                v-if="v$.selectedAttendantNursingRecipients.$dirty && v$.selectedAttendantNursingRecipients.required.$invalid"
                  aria-live="assertive">You must select who claimed the attendant or nursing home expenses.</div>
              <div class="text-danger"
                v-if="v$.selectedAttendantNursingRecipients.$dirty && v$.selectedAttendantNursingRecipients.notApplyingForBoth.$invalid"
                  aria-live="assertive">You have already selected disability credit for this person. Please remove disability credit if you want to claim nursing home credit for them.</div>
              <div v-if="selectedAttendantNursingRecipients.includes('child')">
                <DigitInput id="num-attendant-nursing-children"
                  label="How many children claimed attendant care expenses?"
                  v-model="numAttendantNursingChildren"
                  :inputStyle="extraSmallStyles"
                  @blur="handleBlurField(v$.numAttendantNursingChildren)"/>
                <div class="text-danger"
                  v-if="v$.numAttendantNursingChildren.$dirty && v$.numAttendantNursingChildren.required.$invalid"
                    aria-live="assertive">You must enter how many of your children claimed the attendant or nursing home expenses.</div>
                <div class="text-danger"
                  v-if="v$.numAttendantNursingChildren.$dirty
                    && !v$.numAttendantNursingChildren.required.$invalid
                    && v$.numAttendantNursingChildren.validateNumChildClaims.$invalid"
                    aria-live="assertive">This number cannot be zero or exceed the number of children on your account.</div>
              </div>
            </div>
          </div>
          <div class="col-md-5" v-if="windowWidth >= 768">
            <SuppBenWidget :inputData="widgetData"/>
          </div>
        </div>

        <div v-if="hasAttendantNursingExpenses === 'Y'">
          <p class="font-weight-bolder ml-5">Please upload your attendant care or nursing receipts.</p>
          <div class="row">
            <div class="col-md-7">
              <FileUploader class="ml-5"
                id='attendant-nursing-receipts'
                v-model="attendantNursingReceipts"
                @blur="handleBlurField(v$.attendantNursingReceipts)"
                :isZoomPortalEnabled="true"
                modalElementTarget="#modal-target" />
              <div class="text-danger ml-5"
                  v-if="v$.attendantNursingReceipts.$dirty && v$.attendantNursingReceipts.required.$invalid"
                    aria-live="assertive">You must upload your attendant care or nursing receipts.</div>
            </div>
            <div class="col-md-5">
              <TipBox title="Tip">
                <p>Scan the document, or take a photo of it.</p>
                <p>Make sure it's:</p>
                <ul>
                  <li>The entire document, from corner to corner</li>
                  <li>Rotated correctly (not upside down or sideways)</li>
                  <li>In focus and easy to read</li>
                  <li>A JPG, PNG, GIF, BMP, or PDF file</li>
                </ul>
              </TipBox>
            </div>
          </div>
        </div>
        <div class="mt-3" v-if="windowWidth < 768">
          <SuppBenWidget :inputData="widgetData"/>
        </div>
      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import pageStateService from '@/services/page-state-service';
import {
  enrolmentRoutes,
  isEQPath,
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
  mediumStyles,
  extraSmallStyles,
}  from '@/constants/input-styles';
import { 
  radioOptionsNoYes, 
}  from '@/constants/radio-options';
import {
  selectOptionsFamilyMembers
} from '@/constants/select-options';
import SuppBenData from '@/data-types/supp-ben-data';

import {
  MODULE_NAME as enrolmentModule,
  SET_HAS_CHILDREN,
  SET_NUM_CHILDREN,
  SET_SELECTED_NOA_YEAR,
  SET_AH_SB_INCOME,
  SET_SPOUSE_SB_INCOME,
  SET_CLAIMED_CHILD_CARE_EXPENSES,
  SET_HAS_DISABILITY_CREDIT,
  SET_SELECTED_DISABILITY_RECIPIENTS,
  SET_NUM_DISABILITY_CHILDREN,
  SET_HAS_RDSP,
  SET_SB_RDSP_AMOUNT,
  SET_HAS_ATTENDANT_NURSING_EXPENSES,
  SET_SELECTED_ATTENDANT_NURSING_RECIPIENTS,
  SET_NUM_ATTENDANT_NURSING_CHILDREN,
  SET_ATTENDANT_NURSING_RECEIPTS,
  // Calculated SuppBen Widget Values
  SET_SB_TOTAL_HOUSEHOLD_INCOME,
  SET_AH_65_DEDUCTION,
  SET_SPOUSE_DEDUCTION,
  SET_SPOUSE_65_DEDUCTION,
  SET_CHILD_DEDUCTION,
  SET_CHILD_ADJUSTED_DEDUCTION,
  SET_AH_DISABILITY_CREDIT_DEDUCTION,
  SET_SPOUSE_DISABILITY_CREDIT_DEDUCTION,
  SET_CHILD_DISABILITY_CREDIT_DEDUCTION,
  SET_SB_RDSP_DEDUCTION,
  SET_AH_ATTENDANT_NURSING_DEDUCTION,
  SET_SPOUSE_ATTENDANT_NURSING_DEDUCTION,
  SET_CHILD_ATTENDANT_NURSING_DEDUCTION,
  SET_SB_TOTAL_DEDUCTIONS,
  SET_SB_ADJUSTED_INCOME,
  SET_SB_INCOME_UNDER_THRESHOLD,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import {
  ContinueBar,
  PageContent,
  Radio,
  CurrencyInput,
  FileUploader,
  DigitInput,
  CheckboxGroup,
  windowWidthMixin,
  positiveNumberValidator,
  optionalValidator,
} from 'common-lib-vue';
import TipBox from '@/components/TipBox';
import SuppBenWidget from '@/components/SuppBenWidget';
import pageContentMixin from '@/mixins/page-content-mixin';
import {
  required,
} from '@vuelidate/validators';
import pageStepperMixin from '@/mixins/page-stepper-mixin';

const validateNumChildClaims = (value, vm) => {
  return (parseInt(value) <= vm.intNumChildren) 
      && (parseInt(value) > 0);
};

const validateNumChildren = (value) => {
  return (parseInt(value) > 0) && (parseInt(value) <= 28)
};

const notApplyingForBoth = (value, vm) => {
  return !((vm.selectedAttendantNursingRecipients.includes('child') && vm.selectedDisabilityRecipients.includes('child'))
    || (vm.selectedAttendantNursingRecipients.includes('spouse') && vm.selectedDisabilityRecipients.includes('spouse'))
    || (vm.selectedAttendantNursingRecipients.includes('ah') && vm.selectedDisabilityRecipients.includes('ah')));
};

export default {
  name: 'SuppBenInfoPage',
  mixins: [
    pageContentMixin, 
    windowWidthMixin, 
    pageStepperMixin
  ],
  components: {
    ContinueBar,
    PageContent,
    Radio,
    CurrencyInput,
    FileUploader,
    DigitInput,
    CheckboxGroup,
    TipBox,
    SuppBenWidget,
  },
  data: () => {
    return {
      onlySuppBen: false,
      currentYear: 2,
      selectedNOAYear: null,
      radioOptionsNOAYears: [],
      ahSBIncome: null,
      ahBirthDate: null,
      hasSpouse: null,
      spouseBirthDate: null,
      spouseSBIncome: null,
      hasChildren: null,
      numChildren: null,
      claimedChildCareExpenses: null,
      hasDisabilityCredit: null,
      selectedDisabilityRecipients: [],
      numDisabilityChildren: null,
      hasRDSP: null,
      sbRDSPAmount: null,
      hasAttendantNursingExpenses: null,
      selectedAttendantNursingRecipients: [],
      numAttendantNursingChildren: null,
      attendantNursingReceipts: [],
      mediumStyles: mediumStyles,
      extraSmallStyles: extraSmallStyles,
      radioOptionsNoYes: radioOptionsNoYes,
      selectOptionsFamilyMembers: selectOptionsFamilyMembers,
      pageLoaded: false,
    };
  },
  setup () {
    return { v$: useVuelidate() }
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.SUPP_BEN_INFO_PAGE.path,
      enrolmentRoutes.SUPP_BEN_INFO_PAGE.title
    );

    // Load stored data
    this.onlySuppBen = !this.$store.state.enrolmentModule.isApplyingForMSP
                      && !this.$store.state.enrolmentModule.isApplyingForFPCare;
    this.selectedNOAYear = this.$store.state.enrolmentModule.selectedNOAYear;
    this.ahBirthDate = this.$store.state.enrolmentModule.ahBirthdate;
    this.ahSBIncome = this.$store.state.enrolmentModule.ahSBIncome;
    this.hasSpouse = this.$store.state.enrolmentModule.hasSpouse;
    this.spouseBirthDate = this.$store.state.enrolmentModule.spouseBirthDate;
    this.spouseSBIncome = this.$store.state.enrolmentModule.spouseSBIncome;
    this.hasChildren = this.$store.state.enrolmentModule.hasChildren;
    this.numChildren = `${this.$store.state.enrolmentModule.numChildren}`;
    this.claimedChildCareExpenses = this.$store.state.enrolmentModule.claimedChildCareExpenses;
    this.hasDisabilityCredit = this.$store.state.enrolmentModule.hasDisabilityCredit;
    this.selectedDisabilityRecipients = this.$store.state.enrolmentModule.selectedDisabilityRecipients;
    this.numDisabilityChildren = this.$store.state.enrolmentModule.numDisabilityChildren
    this.hasRDSP = this.$store.state.enrolmentModule.hasRDSP;
    this.sbRDSPAmount = this.$store.state.enrolmentModule.sbRDSPAmount
    this.hasAttendantNursingExpenses = this.$store.state.enrolmentModule.hasAttendantNursingExpenses;
    this.selectedAttendantNursingRecipients = this.$store.state.enrolmentModule.selectedAttendantNursingRecipients;
    this.numAttendantNursingChildren = this.$store.state.enrolmentModule.numAttendantNursingChildren;
    this.attendantNursingReceipts = this.$store.state.enrolmentModule.attendantNursingReceipts;
    
    this.currentYear = (new Date()).getFullYear();
    
    // disable selection options for spouse
    if (this.hasSpouse === 'N') {
      this.selectOptionsFamilyMembers.filter(option => {return option.id === "spouse";} )[0].disabled = true;
      if (this.selectedDisabilityRecipients.includes("spouse")){
        this.selectedDisabilityRecipients.splice(this.selectedDisabilityRecipients.indexOf("spouse"), 1);
      }
      if (this.selectedAttendantNursingRecipients.includes("spouse")){
        this.selectedAttendantNursingRecipients.splice(this.selectedAttendantNursingRecipients.indexOf("spouse"), 1);
      }
    } else {
      this.selectOptionsFamilyMembers.filter(option => {return option.id === 'spouse';})[0].disabled = false;
    }

    if (this.hasChildren !== 'Y') {
      //the ah has no children so disable the checkbox group option for child 
      this.selectOptionsFamilyMembers.filter(option => {return option.id === "child";} )[0].disabled = true;
      this.selectOptionsFamilyMembers = [...this.selectOptionsFamilyMembers];
      //if the ah has selected child for one of the deductions, remove that selection
      if (this.selectedDisabilityRecipients.includes("child")){
        this.selectedDisabilityRecipients.splice(this.selectedDisabilityRecipients.indexOf("child"), 1);
      }
      if (this.selectedAttendantNursingRecipients.includes("child")){
        this.selectedAttendantNursingRecipients.splice(this.selectedAttendantNursingRecipients.indexOf("child"), 1);
      }
    } else if (this.intNumChildren > 0) {
      // the hasChildren is 'Y' and numChildren is > 0 so enable the checkbox group option for child
      this.selectOptionsFamilyMembers.filter(option => {return option.id === "child";} )[0].disabled = false;
      this.selectOptionsFamilyMembers = [...this.selectOptionsFamilyMembers];
    }
    
    // set options for years
    this.radioOptionsNOAYears = [
      {
        id: 'currentNOAYear',
        label: `${this.currentYear - 1}`,
        value: `${this.currentYear - 1}`,
      },
      {
        id: 'previousNOAYear',
        label: `${this.currentYear - 2}`,
        value: `${this.currentYear - 2}`,
      }
    ];

    setTimeout(() => {
      this.pageLoaded = true;
    }, 0);
  },
  validations() {
    let validations = {
      selectedNOAYear: {
        required,
      },
      ahSBIncome: {
        required,
        positiveNumberValidator: optionalValidator(positiveNumberValidator),
      },
      spouseSBIncome: {},
      hasChildren: {},
      numChildren: {},
      hasRDSP: {
        required,
      },
      hasDisabilityCredit: {
        required,
      },
      claimedChildCareExpenses: {},
      selectedDisabilityRecipients: {},
      numDisabilityChildren: {},
      sbRDSPAmount: {},
      hasAttendantNursingExpenses: {
        required,
      },
      selectedAttendantNursingRecipients: {},
      attendantNursingReceipts: {},
      numAttendantNursingChildren: {},
    };

    if (this.onlySuppBen) {
      validations.hasChildren.required = required;
    }
    
    if (this.hasSpouse === 'Y') {
      validations.spouseSBIncome.required = required;
      validations.spouseSBIncome.positiveNumberValidator = optionalValidator(positiveNumberValidator);
    }

    if (this.hasChildren === 'Y' && this.onlySuppBen) {
      validations.numChildren.required = required; 
      validations.numChildren.validateNumChildren = validateNumChildren;
    }

    if (this.hasChildren === 'Y') {
      validations.claimedChildCareExpenses.required = required;
    }

    if (this.hasDisabilityCredit === 'Y') {
      validations.selectedDisabilityRecipients.required = required;
      validations.selectedDisabilityRecipients.notApplyingForBoth = notApplyingForBoth;
    }

    if (this.hasDisabilityCredit === 'Y' && this.selectedDisabilityRecipients.includes('child')){
      validations.numDisabilityChildren.required = required;
      validations.numDisabilityChildren.validateNumChildClaims = validateNumChildClaims;
    }

    if (this.hasRDSP === 'Y') {
      validations.sbRDSPAmount.required = required;
    }

    if (this.hasAttendantNursingExpenses === 'Y') {
      validations.selectedAttendantNursingRecipients.required = required;
      validations.selectedAttendantNursingRecipients.notApplyingForBoth = notApplyingForBoth;
      validations.attendantNursingReceipts.required = required;
    }

    if (this.hasAttendantNursingExpenses === 'Y' && this.selectedAttendantNursingRecipients.includes('child')){
      validations.numAttendantNursingChildren.required = required;
      validations.numAttendantNursingChildren.validateNumChildClaims = validateNumChildClaims;
    }

    return validations;
  },
  methods: {
    setEmptyFields() {
      //No Spouse
      if (this.hasSpouse === "N") {
        this.spouseSBIncome = "0";
      }

      //No children
      if (this.hasChildren === "N") {
        this.numChildren = "0";
        this.numDisabilityChildren = "0";
        this.numAttendantNursingChildren = "0";
        this.claimedChildCareExpenses = "0";
      }

      if (this.numChildren === 0) {
        this.hasChildren = "N";
        this.numDisabilityChildren = "0";
        this.numAttendantNursingChildren = "0";
        this.claimedChildCareExpenses = "0";
      }

      //No children in recipients list
      if (!this.selectedDisabilityRecipients.includes("child")) {
        this.numDisabilityChildren = "0";
      }

      if (!this.selectedAttendantNursingRecipients.includes("child")) {
        this.numAttendantNursingChildren = "0";
      }

      //No expenses/credits
      if (this.hasAttendantNursingExpenses === "N") {
        this.attendantNursingReceipts = [];
        this.selectedAttendantNursingRecipients = [];
      }

      if (this.hasDisabilityCredit === "N") {
        this.selectedDisabilityRecipients = [];
      }

      //No RDSP
      if (this.hasRDSP === "N") {
        this.sbRDSPAmount = "0";
      }
    },
    saveData() {
      this.setEmptyFields();
      this.$store.dispatch(`${enrolmentModule}/${SET_SELECTED_NOA_YEAR}`, this.selectedNOAYear);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_SB_INCOME}`, this.ahSBIncome);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_SB_INCOME}`, this.spouseSBIncome);
      if (this.onlySuppBen) {
        this.$store.dispatch(`${enrolmentModule}/${SET_HAS_CHILDREN}`, this.hasChildren);
        this.$store.dispatch(`${enrolmentModule}/${SET_NUM_CHILDREN}`, this.intNumChildren);
      }
      this.$store.dispatch(`${enrolmentModule}/${SET_CLAIMED_CHILD_CARE_EXPENSES}`, this.claimedChildCareExpenses);
      this.$store.dispatch(`${enrolmentModule}/${SET_HAS_DISABILITY_CREDIT}`, this.hasDisabilityCredit);
      this.$store.dispatch(`${enrolmentModule}/${SET_SELECTED_DISABILITY_RECIPIENTS}`, this.selectedDisabilityRecipients);
      this.$store.dispatch(`${enrolmentModule}/${SET_NUM_DISABILITY_CHILDREN}`, this.numDisabilityChildren);
      this.$store.dispatch(`${enrolmentModule}/${SET_HAS_RDSP}`, this.hasRDSP);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_RDSP_AMOUNT}`, this.sbRDSPAmount);
      this.$store.dispatch(`${enrolmentModule}/${SET_HAS_ATTENDANT_NURSING_EXPENSES}`, this.hasAttendantNursingExpenses);
      this.$store.dispatch(`${enrolmentModule}/${SET_SELECTED_ATTENDANT_NURSING_RECIPIENTS}`, this.selectedAttendantNursingRecipients);
      this.$store.dispatch(`${enrolmentModule}/${SET_NUM_ATTENDANT_NURSING_CHILDREN}`, this.numAttendantNursingChildren);
      this.$store.dispatch(`${enrolmentModule}/${SET_ATTENDANT_NURSING_RECEIPTS}`, this.attendantNursingReceipts);
      
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_TOTAL_HOUSEHOLD_INCOME}`, this.widgetData.totalHouseholdIncome);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_65_DEDUCTION}`, this.widgetData.ah65Deduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_DEDUCTION}`, this.widgetData.spouseDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_65_DEDUCTION}`, this.widgetData.spouse65Deduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_CHILD_DEDUCTION}`, this.widgetData.childDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_CHILD_ADJUSTED_DEDUCTION}`, this.widgetData.childAdjustedDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_DISABILITY_CREDIT_DEDUCTION}`, this.widgetData.ahDisabilityCreditDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_DISABILITY_CREDIT_DEDUCTION}`, this.widgetData.spouseDisabilityCreditDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_CHILD_DISABILITY_CREDIT_DEDUCTION}`, this.widgetData.childDisabilityCreditDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_RDSP_DEDUCTION}`, this.widgetData.rdspDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_ATTENDANT_NURSING_DEDUCTION}`, this.widgetData.ahAttendantNursingDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_ATTENDANT_NURSING_DEDUCTION}`, this.widgetData.spouseAttendantNursingDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_CHILD_ATTENDANT_NURSING_DEDUCTION}`, this.widgetData.childAttendantNursingDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_TOTAL_DEDUCTIONS}`, this.widgetData.totalDeductions);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_ADJUSTED_INCOME}`, this.widgetData.adjustedIncome);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_INCOME_UNDER_THRESHOLD}`, this.widgetData.incomeUnderThreshold);
    },
    validateFields() {
      this.v$.$touch()
      if (this.v$.$invalid) {
        scrollToError();
        return;
      }

      this.saveData();
      this.navigateToNextPage();
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.DOCUMENTS_PAGE.path
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
  },
  watch: {
    selectedNOAYear(value) {
      if (this.$store.state.enrolmentModule.isApplyingForFPCare) {
        if (value === `${this.currentYear - 2}`) {
          this.ahSBIncome = this.$store.state.enrolmentModule.ahFPCIncome;
          this.spouseSBIncome = this.$store.state.enrolmentModule.spouseFPCIncome;
        } else {
          this.ahSBIncome = this.$store.state.enrolmentModule.ahSBIncome;
          this.spouseSBIncome = this.$store.state.enrolmentModule.spouseSBIncome;
        }
      }
    },
    intNumChildren(value) {
      if (!value) {
        //the ah has no children so disable the checkbox group option for child 
        this.selectOptionsFamilyMembers.filter(option => {return option.id === "child";} )[0].disabled = true;
        this.selectOptionsFamilyMembers = [...this.selectOptionsFamilyMembers];
        //if the ah has selected child for one of the deductions, remove that selection
        if (this.selectedDisabilityRecipients.includes("child")){
          this.selectedDisabilityRecipients.splice(this.selectedDisabilityRecipients.indexOf("child"), 1);
        }
        if (this.selectedAttendantNursingRecipients.includes("child")){
          this.selectedAttendantNursingRecipients.splice(this.selectedAttendantNursingRecipients.indexOf("child"), 1);
        }
      } else {
        // the hasChildren is 'Y' and numChildren is > 0 so enable the checkbox group option for child
        this.selectOptionsFamilyMembers.filter(option => {return option.id === "child";} )[0].disabled = false;
        this.selectOptionsFamilyMembers = [...this.selectOptionsFamilyMembers];
      }
    },
    hasChildren(value) {
      if (value !== 'Y') {
        //the ah has no children so disable the checkbox group option for child 
        this.selectOptionsFamilyMembers.filter(option => {return option.id === "child";} )[0].disabled = true;
        this.selectOptionsFamilyMembers = [...this.selectOptionsFamilyMembers];
        //if the ah has selected child for one of the deductions, remove that selection
        if (this.selectedDisabilityRecipients.includes("child")){
          this.selectedDisabilityRecipients.splice(this.selectedDisabilityRecipients.indexOf("child"), 1);
        }
        if (this.selectedAttendantNursingRecipients.includes("child")){
          this.selectedAttendantNursingRecipients.splice(this.selectedAttendantNursingRecipients.indexOf("child"), 1);
        }
      } else if (this.intNumChildren > 0) {
        // the hasChildren is 'Y' and numChildren is > 0 so enable the checkbox group option for child
        this.selectOptionsFamilyMembers.filter(option => {return option.id === "child";} )[0].disabled = false;
        this.selectOptionsFamilyMembers = [...this.selectOptionsFamilyMembers];
      }
    },
    hasDisabilityCredit(value) {
      if (this.pageLoaded && value === "N") {
        this.selectedDisabilityRecipients = [];
        this.numDisabilityChildren = 0;
        this.v$.selectedDisabilityRecipients.$reset();
        this.v$.numDisabilityChildren.$reset();
      }
    },
    hasAttendantNursingExpenses(value) {
      if (this.pageLoaded && value === "N") {
        this.selectedAttendantNursingRecipients = [];
        this.numAttendantNursingChildren = 0;
        this.attendantNursingReceipts = [];
        this.v$.selectedAttendantNursingRecipients.$reset();
        this.v$.numAttendantNursingChildren.$reset();
        this.v$.attendantNursingReceipts.$reset();
      }
    }
  },
  computed: {
    intNumChildren() {
      if (this.hasChildren && this.hasChildren === 'Y') {
        return (this.numChildren && !isNaN(this.numChildren)) ? 
          parseInt(this.numChildren) : 0;
      }
      return 0;
    },
    widgetData() {
      let info = new SuppBenData();
      info.selectedNOAYear = this.selectedNOAYear;
      info.ahIncome = this.ahSBIncome;
      info.ahBirthdate = this.ahBirthDate;
      info.hasSpouse = this.hasSpouse;
      info.spouseBirthdate = this.spouseBirthDate;
      info.spouseIncome = this.spouseSBIncome;
      info.numChildren = this.intNumChildren;
      info.claimedChildCareExpenses = this.claimedChildCareExpenses;
      info.hasDisabilityCredit = this.hasDisabilityCredit;
      info.selectedDisabilityRecipients = this.selectedDisabilityRecipients;
      info.numDisabilityChildren = this.numDisabilityChildren
      info.hasRDSP = this.hasRDSP;
      info.rdspAmount = this.sbRDSPAmount;
      info.hasAttendantNursingExpenses = this.hasAttendantNursingExpenses;
      info.selectedAttendantNursingRecipients = this.selectedAttendantNursingRecipients;
      info.numAttendantNursingChildren = this.numAttendantNursingChildren;
      info.attendantNursingReceipts = this.attendantNursingReceipts;
      info.qualificationThreshhold = 42000;
      return info;
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
        this.$router.currentRoute.value.path,
        enrolmentRoutes.SUPP_BEN_INFO_PAGE.path
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
