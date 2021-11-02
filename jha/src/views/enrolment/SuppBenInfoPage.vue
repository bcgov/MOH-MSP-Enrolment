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
        <SuppBenWidget v-model="widgetInfo"/>
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
          v-model="ahNetIncome"
          :inputStyle='mediumStyles'/>
        <div v-if="hasSpouse === 'Y'">
          <p class="mt-4 mb-1 font-weight-bolder">Enter your spouse's 2020 net income.</p>
          <CurrencyInput id="spouse-net-income"
            label="See line 23600 of your spouse's Notice of Assessment or Reassessment."
            v-model="spouseNetIncome"
            :inputStyle='mediumStyles'/>
        </div>
        <div v-if="children.length > 0">
          <p class="mt-4 mb-1 font-weight-bolder">How much did you claim for child care expenses in {{selectedNOAYear}}?</p>
          <CurrencyInput id="child-care-expenses"
            label="See line 21400 of your Notice of Assessment or Reassessment."
            v-model="claimedChildCareExpenses"
            :inputStyle='mediumStyles'/>
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
            :items="selectOptionsFamilyMembers"/>
          <DigitInput v-if="selectedDisabilityRecipients.includes('child')"
            id="num-attendant-nursing-children"
            label="How many of your children are eligible for a disability tax credit?"
            v-model="numDisabilityChildren"
            :inputStyle="extraSmallStyles"/>
        </div>
        <p class="mt-4 mb-1 font-weight-bolder">Does anyone on your Medical Services Plan account have a Registered Disability Savings Plan?</p>
        <Radio id="has-disability-savings"
          name="has-disability-savings"
          v-model="hasDisabilitySavings"
          :items="radioOptionsNoYes"
          @blur="handleBlurField($v.hasDisabilitySavings)"/>
        <div class="ml-5" v-if="hasDisabilitySavings === 'Y'">
          <p class="mt-4 mb-1 font-weight-bolder">How much did you report for a Registered Disability Savings Plan in {{selectedNOAYear}}?</p>
          <CurrencyInput id="disability-savings-plan"
            label="See Line 12500 of the Notice of Assessment or Reassessment"
            v-model="dspAmount"
            :inputStyle='mediumStyles'/>
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
            :items="selectOptionsFamilyMembers"/>
          <DigitInput v-if="selectedAttendantNursingRecipients.includes('child')"
            id="num-attendant-nursing-children"
            label="How many children claimed attendant care expenses?"
            v-model="numAttendantNursingChildren"
            :inputStyle="extraSmallStyles"/>
          <p class="font-weight-bolder">Please upload your attendant care or nursing receipts</p>
          <div class="row">
            <div class="col-md-7">
              <FileUploader class="ml-0"
                v-model="AttendantNursingReceipts" />
            </div>
            <div class="col-md-4">
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
  MODULE_NAME as formModule,
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
} from 'common-lib-vue';
import TipBox from '@/components/TipBox';
import SuppBenWidget from '@/components/SuppBenWidget';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'SuppBenInfoPage',
  mixins: [pageContentMixin],
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
      selectedNOAYear: '',
      radioOptionsNOAYears: [],
      ahNetIncome: '',
      ahBirthDate: null,
      hasSpouse: null,
      spouseNetIncome: null,
      spouseBirthDate: null,
      children: [],
      claimedChildCareExpenses: null,
      hasDisabilityCredit: '',
      selectedDisabilityRecipients: [],
      numDisabilityChildren: null,
      hasDisabilitySavings: null,
      dspAmount: null,
      hasAttendantNursingExpenses: null,
      selectedAttendantNursingRecipients: [],
      numAttendantNursingChildren: null,
      AttendantNursingReceipts: [],
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

    this.ahNetIncome = '';
    this.hasSpouse = 'Y';
    this.spouseNetIncome = '';
    this.children = ['test1', 'test2', 'test3']
    this.hasDisabilityCredit = 'N';
    this.selectedDisabilityRecipients = [];
    this.hasDisabilitySavings = 'N';
    this.hasAttendantNursingExpenses = 'N';
    this.selectedAttendantNursingRecipients = [];
    this.numAttendantNursingChildren = '';
    this.AttendantNursingReceipts = [];
    this.currentYear = (new Date()).getFullYear();
    this.selectedNOAYear = `${this.currentYear - 1}`;
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
  computed: {
    widgetInfo() {
      let info = {};
      info.ahNetIncome = this.ahNetIncome;
      info.ahBirthDate = this.ahBirthDate;
      info.hasSpouse = this.hasSpouse;
      info.spouseNetIncome = this.spouseNetIncome;
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
      info.dspAmount = (this.hasDisabilitySavings === 'Y') ? this.dspAmount : null;
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
      this.$store.dispatch(formModule + '/' + RESET_FORM);
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
