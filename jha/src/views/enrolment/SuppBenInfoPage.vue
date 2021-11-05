<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Suplimentary Benefits Financial Information</h1>
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
                    @blur="handleBlurField($v.selectedNOAYear)"/>
            <div v-if="selectedNOAYear === `${this.currentYear - 2}`" class="text-danger">
              <font-awesome-icon icon="exclamation-circle"/>
              Selecting this Notice of Assessment will allow you to apply for supplementary benefits for the rest of the current calendar year only. Provide a more recent Notice of Assessment to apply for the rest of the calendar year <strong>and</strong> the next calendar year.
            </div>
            <p class="mt-2 mb-1 font-weight-bolder">Enter your 2020 net income.</p>
            <CurrencyInput id="ah-net-income"
              label="See line 23600 of your Notice of Assessment or Reassessment."
              v-model="ahSBIncome"
              :inputStyle='mediumStyles'
              @blur="handleBlurField($v.ahSBIncome)"/>
              <div class="text-danger"
                  v-if="$v.ahSBIncome.$dirty && !$v.ahSBIncome.required"
                    aria-live="assertive">Your net income from {{selectedNOAYear}} is required.</div>
            <div v-if="hasSpouse === 'Y'">
              <p class="mt-4 mb-1 font-weight-bolder">Enter your spouse's 2020 net income.</p>
              <CurrencyInput id="spouse-net-income"
                label="See line 23600 of your spouse's Notice of Assessment or Reassessment."
                v-model="spouseSBIncome"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.spouseSBIncome)"/>
              <div class="text-danger"
                  v-if="$v.spouseSBIncome.$dirty && !$v.spouseSBIncome.required"
                    aria-live="assertive">Your spouse/common-law partner's net income from {{selectedNOAYear}} is required.</div>
            </div>
            <div v-if="children.length > 0">
              <p class="mt-4 mb-1 font-weight-bolder">How much did you claim for child care expenses in {{selectedNOAYear}}?</p>
              <CurrencyInput id="child-care-expenses"
                label="See line 21400 of your Notice of Assessment or Reassessment."
                v-model="claimedChildCareExpenses"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.claimedChildCareExpenses)"/>
              <div class="text-danger"
                v-if="$v.claimedChildCareExpenses.$dirty && !$v.claimedChildCareExpenses.required"
                  aria-live="assertive">Your claimed child care expenses from {{selectedNOAYear}} are required.</div>
            </div>
            <p class="mt-4 mb-1 font-weight-bolder">Did anyone on your Medical Services Plan account claim a disability tax credit in {{selectedNOAYear}}?</p>
            <Radio id="has-disability-credit"
              name="has-disability-credit"
              label="See line 31600, 31800, or 32600 of your Notice of Assessment or Reassessment."
              v-model="hasDisabilityCredit"
              :items="radioOptionsNoYes"
              @blur="handleBlurField($v.hasDisabilityCredit)"/>
            <div class="ml-5" v-if="hasDisabilityCredit === 'Y'">
              <CheckboxGroup id="selected-disability-credit-recipients"
                name="selected-disability-credit-recipients"
                label="Who claimed the disability tax credit?"
                v-model="selectedDisabilityRecipients"
                :items="selectOptionsFamilyMembers"
                @blur="handleBlurField($v.selectedDisabilityRecipients)"/>
              <div class="text-danger"
                v-if="$v.selectedDisabilityRecipients.$dirty && !$v.selectedDisabilityRecipients.required"
                  aria-live="assertive">You must select who claimed the disability tax credit.</div>
              <div v-if="selectedDisabilityRecipients.includes('child')">
                <DigitInput id="num-attendant-nursing-children"
                  label="How many of your children are eligible for a disability tax credit?"
                  v-model="numDisabilityChildren"
                  :inputStyle="extraSmallStyles"
                  @blur="handleBlurField($v.numDisabilityChildren)"/>
                <div class="text-danger"
                  v-if="$v.numDisabilityChildren.$dirty && !$v.numDisabilityChildren.required"
                    aria-live="assertive">You must enter how many of your children claimed the disability tax credit.</div>
                <div class="text-danger"
                  v-if="$v.numDisabilityChildren.$dirty
                      && $v.numDisabilityChildren.required
                      && !$v.numDisabilityChildren.validateNumChildren"
                    aria-live="assertive">This number cannot be zero or exceed the number of children on your account.</div>
              </div>
            </div>
            <p class="mt-4 mb-1 font-weight-bolder">Does anyone on your Medical Services Plan account have a Registered Disability Savings Plan?</p>
            <Radio id="has-disability-savings"
              name="has-disability-savings"
              v-model="hasRDSP"
              :items="radioOptionsNoYes"
              @blur="handleBlurField($v.hasRDSP)"/>
            <div class="ml-5" v-if="hasRDSP === 'Y'">
              <p class="mt-4 mb-1 font-weight-bolder">How much did you report for a Registered Disability Savings Plan in {{selectedNOAYear}}?</p>
              <CurrencyInput id="disability-savings-plan"
                label="See Line 12500 of the Notice of Assessment or Reassessment"
                v-model="sbRDSPAmount"
                :inputStyle='mediumStyles'
                @blur="handleBlurField($v.sbRDSPAmount)"/>
              <div class="text-danger"
                v-if="$v.sbRDSPAmount.$dirty && !$v.sbRDSPAmount.required"
                  aria-live="assertive">You must enter how much you reported for a Registered Disability Savings Plan</div>
            </div>
            <p class="mt-4 mb-1 font-weight-bolder">Did anyone on your Medical Services Plan account claim attendant or nursing home expenses in place of a disability in {{selectedNOAYear}}?</p>
            <Radio id="has-attendant-nursing-expenses"
              name="has-attendant-nursing-expenses"
              label="See line 21500 or 33099 of your Notice of Assessment or Reassessment."
              v-model="hasAttendantNursingExpenses"
              :items="radioOptionsNoYes"
              @blur="handleBlurField($v.hasAttendantNursingExpenses)"/>
            <div class="ml-5" v-if="hasAttendantNursingExpenses === 'Y'">
              <CheckboxGroup id="selected-attendant-nursing-recipients"
                name="selected-attendant-nursing-recipients"
                label="Who claimed the attendant or nursing home expenses?"
                v-model="selectedAttendantNursingRecipients"
                :items="selectOptionsFamilyMembers"
                @blur="handleBlurField($v.selectedAttendantNursingRecipients)"/>
              <div class="text-danger"
                v-if="$v.selectedAttendantNursingRecipients.$dirty && !$v.selectedAttendantNursingRecipients.required"
                  aria-live="assertive">You must select who claimed the attendant or nursing home expenses.</div>
              <div v-if="selectedAttendantNursingRecipients.includes('child')">
                <DigitInput id="num-attendant-nursing-children"
                  label="How many children claimed attendant care expenses?"
                  v-model="numAttendantNursingChildren"
                  :inputStyle="extraSmallStyles"
                  @blur="handleBlurField($v.numAttendantNursingChildren)"/>
                <div class="text-danger"
                  v-if="$v.numAttendantNursingChildren.$dirty && !$v.numAttendantNursingChildren.required"
                    aria-live="assertive">You must enter how many of your children claimed the attendant or nursing home expenses.</div>
                <div class="text-danger"
                  v-if="$v.numAttendantNursingChildren.$dirty
                    && $v.numAttendantNursingChildren.required
                    && !$v.numAttendantNursingChildren.validateNumChildren"
                    aria-live="assertive">This number cannot be zero or exceed the number of children on your account.</div>
              </div>
            </div>
          </div>
          <div class="col-md-5" v-if="windowWidth >= 768">
            <SuppBenWidget v-model="widgetData"/>
          </div>
        </div>

        <div v-if="hasAttendantNursingExpenses === 'Y'">
          <p class="font-weight-bolder ml-5">Please upload your attendant care or nursing receipts.</p>
          <div class="row">
            <div class="col-md-7">
              <FileUploader class="ml-5"
                v-model="attendantNursingReceipts"
                @blur="handleBlurField($v.attendantNursingReceipts)"/>
              <div class="text-danger"
                  v-if="$v.attendantNursingReceipts.$dirty && !$v.attendantNursingReceipts.required"
                    aria-live="assertive">You must upload your attendant care or nursing receipts.</div>
            </div>
            <div class="col-md-5">
              <TipBox title="Tip">
                <p>Scan the document, or take a photo of it.</p>
                <p>Make sure it's:</p>
                <ul>
                  <li>The entire document, from corner to corner.</li>
                  <li>Rotated Correctly(not upside down or sideways).</li>
                  <li>In focus and easy to read.</li>
                  <li>A JPG, PNG, GIF, BMP, or PDF file.</li>
                </ul>
              </TipBox>
            </div>
          </div>
        </div>
        <div class="mt-3" v-if="windowWidth < 768">
            <SuppBenWidget v-model="widgetData"/>
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
  mediumStyles,
  extraSmallStyles,
}  from '@/constants/input-styles';
import { 
  radioOptionsNoYes, 
}  from '@/constants/radio-options';
import {
  selectOptionsFamilyMembers
} from '@/constants/select-options';

import {
  MODULE_NAME as enrolmentModule,
  RESET_FORM,
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
} from 'common-lib-vue';
import TipBox from '@/components/TipBox';
import SuppBenWidget from '@/components/SuppBenWidget';
import pageContentMixin from '@/mixins/page-content-mixin';
import {
  required,
} from 'vuelidate/lib/validators';

let validateNumChildren = (value, vm) => {
  return (value <= vm.children.length) 
      && (parseInt(value) > 0);
};

export default {
  name: 'SuppBenInfoPage',
  mixins: [pageContentMixin, windowWidthMixin],
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
      currentYear: 2,
      selectedNOAYear: null,
      radioOptionsNOAYears: [],
      ahSBIncome: null,
      ahBirthDate: null,
      hasSpouse: null,
      spouseSBIncome: null,
      spouseBirthDate: null,
      children: [],
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
      widgetData: {},
      mediumStyles: mediumStyles,
      extraSmallStyles: extraSmallStyles,
      radioOptionsNoYes: radioOptionsNoYes,
      selectOptionsFamilyMembers: selectOptionsFamilyMembers,
    };
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.SUPP_BEN_INFO_PAGE.path,
      enrolmentRoutes.SUPP_BEN_INFO_PAGE.title
    );

    this.selectedNOAYear = this.$store.state.enrolmentModule.selectedNOAYear;
    this.ahSBIncome = this.$store.state.enrolmentModule.ahSBIncome;
    this.hasSpouse = this.$store.state.enrolmentModule.hasSpouse;
    this.spouseSBIncome = this.$store.state.enrolmentModule.spouseSBIncome;
    this.children = this.$store.state.enrolmentModule.children;
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
  },
  validations() {
    let validations = {
      ahSBIncome: {
        required,
      },
    };
    if (this.hasSpouse === 'Y') validations.spouseSBIncome = {required};
    if (this.children.length > 0) validations.claimedChildCareExpenses = {required};
    if (this.hasDisabilityCredit === 'Y') validations.selectedDisabilityRecipients = {required};
    if (this.hasDisabilityCredit === 'Y' && this.selectedDisabilityRecipients.includes('child')){
      validations.numDisabilityChildren = {required, validateNumChildren};
    }
    if (this.hasRDSP === 'Y') validations.sbRDSPAmount = {required};
    if (this.hasAttendantNursingExpenses === 'Y') {
      validations.selectedAttendantNursingRecipients = {required};
      validations.attendantNursingReceipts = {required};
    }
    if (this.hasAttendantNursingExpenses === 'Y' && this.selectedAttendantNursingRecipients.includes('child')){
      validations.numAttendantNursingChildren = {required, validateNumChildren};
    }

    return validations;
  },
  methods: {
    saveData() {
      this.$store.dispatch(`${enrolmentModule}/${SET_SELECTED_NOA_YEAR}`, this.selectedNOAYear);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_SB_INCOME}`, this.ahSBIncome);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_SB_INCOME}`, this.spouseSBIncome);
      this.$store.dispatch(`${enrolmentModule}/${SET_CLAIMED_CHILD_CARE_EXPENSES}`, this.claimedChildCareExpenses);
      this.$store.dispatch(`${enrolmentModule}/${SET_HAS_DISABILITY_CREDIT}`, this.hasDisabilityCredit);
      this.$store.dispatch(`${enrolmentModule}/${SET_SELECTED_DISABILITY_RECIPIENTS}`, this.selectedDisabilityRecipients);
      this.$store.dispatch(`${enrolmentModule}/${SET_NUM_DISABILITY_CHILDREN}`, this.numDisabilityChildren);
      this.$store.dispatch(`${enrolmentModule}/${SET_HAS_RDSP}`, this.hasRDSP);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_RDSP_AMOUNT}`, this.sbRDSPAmount);
      this.$store.dispatch(`${enrolmentModule}/${SET_HAS_ATTENDANT_NURSING_EXPENSES}`, this.hasAttendantNursingExpenses);
      this.$store.dispatch(`${enrolmentModule}/${SET_SELECTED_ATTENDANT_NURSING_RECIPIENTS}`, this.selectedAttendantNursingRecipients);
      this.$store.dispatch(`${enrolmentModule}/${SET_NUM_ATTENDANT_NURSING_CHILDREN}`, this.numAttendantNursing);
      this.$store.dispatch(`${enrolmentModule}/${SET_ATTENDANT_NURSING_RECEIPTS}`, this.attendantNursingReceipts);
      
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_TOTAL_HOUSEHOLD_INCOME}`, this.widgetData.sbTotalHouseholdIncome);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_65_DEDUCTION}`, this.widgetData.ah65Deduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_DEDUCTION}`, this.widgetData.spouseDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_65_DEDUCTION}`, this.widgetData.spouse65Deduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_CHILD_DEDUCTION}`, this.widgetData.childDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_CHILD_ADJUSTED_DEDUCTION}`, this.widgetData.childAdjustedDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_DISABILITY_CREDIT_DEDUCTION}`, this.widgetData.ahDisabilityCreditDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_DISABILITY_CREDIT_DEDUCTION}`, this.widgetData.spouseDisabilityCreditDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_CHILD_DISABILITY_CREDIT_DEDUCTION}`, this.widgetData.childDisabilityCreditDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_RDSP_DEDUCTION}`, this.widgetData.sbRDSPDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_ATTENDANT_NURSING_DEDUCTION}`, this.widgetData.ahAttendantNursingDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_ATTENDANT_NURSING_DEDUCTION}`, this.widgetData.spouseAttendantNursingDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_CHILD_ATTENDANT_NURSING_DEDUCTION}`, this.widgetData.childAttendantNursingDeduction);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_TOTAL_DEDUCTIONS}`, this.widgetData.sbTotalDeductions);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_ADJUSTED_INCOME}`, this.widgetData.sbAdjustedIncome);
      this.$store.dispatch(`${enrolmentModule}/${SET_SB_INCOME_UNDER_THRESHOLD}`, this.widgetData.sbIncomeUnderThreshold);
    },
    validateFields() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        scrollToError();
        return;
      }

      this.saveData();
      this.navigateToNextPage();
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
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
    selectedNOAYear: function(value) {
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
    updatedWidgetData: function(value) {
      this.widgetData = value;
    },
  },
  computed: {
    updatedWidgetData() {
      let info = {};
      info.ahSBIncome = this.ahSBIncome;
      info.ahBirthDate = this.ahBirthDate;
      info.hasSpouse = this.hasSpouse;
      info.spouseSBIncome = this.spouseSBIncome;
      info.spouseBirthDate = this.spouseBirthDate;
      info.children = this.children;
      info.claimedChildCareExpenses = this.claimedChildCareExpenses;
      info.ahDisabilityCredit = this.hasDisabilityCredit === 'Y'
                                && this.selectedDisabilityRecipients.includes('ah');
      info.spouseDisabilityCredit = this.hasDisabilityCredit === 'Y'
                                && this.selectedDisabilityRecipients.includes('spouse');
      info.childDisabilityCredit = this.hasDisabilityCredit === 'Y'
                                && this.selectedDisabilityRecipients.includes('child');                          
      info.numDisabilityChildren = this.numDisabilityChildren;
      info.sbRDSPAmount = (this.hasRDSP === 'Y') ? this.sbRDSPAmount : null;
      info.ahAttendantNursingExpenses = this.hasAttendantNursingExpenses === 'Y'
                                && this.selectedAttendantNursingRecipients.includes('ah');
      info.spouseAttendantNursingExpenses = this.hasAttendantNursingExpenses === 'Y'
                                && this.selectedAttendantNursingRecipients.includes('spouse');
      info.childAttendantNursingExpenses = this.hasAttendantNursingExpenses === 'Y'
                                && this.selectedAttendantNursingRecipients.includes('child'); 
      info.numAttendantNursingChildren = this.numAttendantNursingChildren
      return info;
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
