<template>
  <div :class="'widget-container rounded p-3' + className">
    <h2>Eligibility Calculator</h2>
    <table class="table table-borderless">
      <tbody>
        <tr>
          <td>
            <span>Total Household Income</span>
          </td>
          <td>
            <span v-if="sbTotalHouseholdIncome > 0">
              {{ currencyString(sbTotalHouseholdIncome) }}
            </span>
            <span v-else> - - </span>
          </td>
        </tr>
      </tbody>
    </table>
    <hr style="border: 1px solid black" />

    <table class="table table-borderless">
      <tr>
        <th>
          <h3>Deductions</h3>
        </th>
      </tr>
      <tr v-if="ah65Deduction > 0">
        <td>Age over 65</td>
        <td>
          {{currencyString(ah65Deduction)}}
        </td>
      </tr>
      <tr v-if="spouseDeduction > 0">
        <td>Spouse</td>
        <td>
          {{currencyString(spouseDeduction)}}
        </td>
      </tr>
      <tr v-if="spouse65Deduction > 0">
        <td>
          Spouse age over 65
        </td>
        <td>
          {{currencyString(spouse65Deduction)}}
        </td>
      </tr>
      <tr v-if="childDeduction > 0">
        <td>Children</td>
        <td>
          {{currencyString(childDeduction)}}
        </td>
      </tr>
      <tr v-if="claimedChildCareExpensesReduction < 0">
        <td>
          -50% child care expense claimed on income tax
        </td>
        <td>
          {{currencyString(claimedChildCareExpensesReduction)}}
        </td>
      </tr>
      <tr v-if="ahDisabilityCreditDeduction > 0">
        <td>
          Applicant Disability credit
        </td>
        <td>
          {{ currencyString(ahDisabilityCreditDeduction) }}
        </td>
      </tr>
      <tr v-if="spouseDisabilityCreditDeduction > 0">
        <td>
          Spouse disability credit
        </td>
        <td>
          {{currencyString(spouseDisabilityCreditDeduction)}}
        </td>
      </tr>
      <tr v-if="childDisabilityCreditDeduction > 0">
        <td>
          Child disability credit
        </td>
        <td>
          {{currencyString(childDisabilityCreditDeduction)}}
        </td>
      </tr>
      <tr v-if="sbRDSPDeduction > 0">
        <td>
          Disability savings plan
        </td>
        <td>
          {{currencyString(sbRDSPDeduction)}}
        </td>
      </tr>
      <tr v-if="ahAttendantNursingDeduction > 0">
        <td>
          Applicant attendant care expense
        </td>
        <td>
          {{currencyString(ahAttendantNursingDeduction) }}
        </td>
      </tr>
      <tr v-if="spouseAttendantNursingDeduction > 0">
        <td>
          Spouse attendant care expense
        </td>
        <td>
          {{currencyString(spouseAttendantNursingDeduction)}}
        </td>
      </tr>
      <tr v-if="childAttendantNursingDeduction > 0">
        <td>
          Child attendant care expense
        </td>
        <td>
          {{currencyString(childAttendantNursingDeduction)}}
        </td>
      </tr>
      <tr>
        <td class="deduction-table-cell-margin">
          <h4>Total deductions</h4>
        </td>
        <td>
          <span v-if="sbTotalDeductions > 0" >
            {{currencyString(sbTotalDeductions)}}
          </span>
          <span v-else>- - </span>
        </td>
      </tr>
    </table>
    <hr style="border: 1px solid black;">

    <table class="table table-borderless">
      <tbody>
        <tr>
          <td>
            <h4>Adjusted Net Income:</h4>
          </td>
          <td>
            <span v-if="sbAdjustedIncome > 0">
              {{currencyString(sbAdjustedIncome)}}
            </span>
            <span v-else>
              - -
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="sbAdjustedIncome > 0 && sbIncomeUnderThreshold" class="text-success font-weight-bold">
      It is likely that you will qualify for Supplementary Benefits.
    </p>
    <p v-else class="text-danger font-weight-bold" aria-live="assertive">
      You might not qualify for Supplementary Benefits.
    </p>
  </div>
</template>

<script>

import {
  convertNumberToFormattedString,
  calculateAge,
} from 'common-lib-vue';

export default {
  name: "SuppBenWidget",
  props: {
    inputData: {
      type: Object,
    },
    className: {
      type: String,
      default: "",
    },
  },
  data: () => {
    return {
      qualificationThreshhold: 42000,
      calculatedData: {},
    };
  },
  methods: {
    removeCommas(stringNumber) {
      return stringNumber.replace(/[,]/g, '');
    },
    stringToFloat(stringNumber) {
      return (stringNumber && !isNaN(stringNumber)) ? 
        parseFloat(this.removeCommas(stringNumber)) : 0;
    },
    ageOver65(birthDate) {
      return (birthDate instanceof Date) && (65 <= calculateAge(birthDate));
    },
    currencyString(num) {
      return (num >= 0) ?
          `$${convertNumberToFormattedString(num)}`
          : `-$${convertNumberToFormattedString(num * -1)}`;
    },
    storeCalculatedData(key, data) {
      this.calculatedData[key] = data;
      if(key === 'sbIncomeUnderThreshold') {
        this.$emit('change', this.calculatedData);
      }
    },
  },
  computed: {
    // Income
    sbTotalHouseholdIncome() {
      let income = this.stringToFloat(this.inputData.ahSBIncome);
      if( this.inputData.hasSpouse) {
        income += this.stringToFloat(this.inputData.spouseSBIncome);
      }
      income = (income > 0) ? income : 0;
      this.storeCalculatedData('sbTotalHouseholdIncome', income);
      return income;
    },
    // Deductions
    ah65Deduction() {
      let deduction = this.ageOver65(this.inputData.ahBirthDate) ? 3000 : 0;
      this.storeCalculatedData('ah65Deduction', deduction);
      return deduction;
    },
    spouseDeduction () {
      let deduction = (this.inputData.hasSpouse === 'Y') ? 3000 : 0;
      this.storeCalculatedData('spouseDeduction', deduction);
      return deduction;
    },
    spouse65Deduction() {
      let deduction = this.ageOver65(this.inputData.spouseBirthDate) ? 3000 : 0;
      this.storeCalculatedData('spouse65Deduction', deduction);
      return deduction;
    },
    numChildren() {
      return this.inputData.children ?  this.inputData.children.length : 0;
    },
    childDeduction() {
      let deduction = this.inputData.children ? this.numChildren * 3000: 0;
      this.storeCalculatedData('childDeduction', deduction);
      return deduction;
    },
    claimedChildCareExpensesReduction() {
      let expenses = this.stringToFloat(this.inputData.claimedChildCareExpenses);
      expenses = expenses > 0 ? ((expenses / 2) * -1): 0;
      this.storeCalculatedData('childAdjustedDeduction', ((expenses * -1) < this.childDeduction) ?  
                    (this.childDeduction + expenses) : 0);
      return expenses;
    },
    ahDisabilityCreditDeduction() {
      let deduction = this.inputData.ahDisabilityCredit ? 3000: 0;
      this.storeCalculatedData('ahDisabilityCreditDeduction', deduction);
      return deduction;
    },
    spouseDisabilityCreditDeduction() {
      let deduction = this.inputData.spouseDisabilityCredit ? 3000: 0;
      this.storeCalculatedData('spouseDisabilityCreditDeduction', deduction);
      return deduction;
    },
    childDisabilityCreditDeduction() {
      let deduction = 0;
      if (this.inputData.childDisabilityCredit
          && this.inputData.numDisabilityChildren
          && this.inputData.numDisabilityChildren > 0
          && this.inputData.numDisabilityChildren <= this.numChildren
        ) {
        deduction = this.inputData.numDisabilityChildren * 3000;
      }
      this.storeCalculatedData('childDisabilityCreditDeduction', deduction);
      return deduction;
    },
    sbRDSPDeduction() {
      let deduction = this.stringToFloat(this.inputData.sbRDSPAmount);
      deduction = (deduction > 0) ? deduction: 0;
      this.storeCalculatedData('sbRDSPDeduction', deduction);
      return deduction;
    },
    ahAttendantNursingDeduction() {
      let deduction = this.inputData.ahAttendantNursingExpenses ? 3000: 0;
      this.storeCalculatedData('ahAttendantNursingDeduction', deduction);
      return deduction;
    },
    spouseAttendantNursingDeduction() {
      let deduction = this.inputData.spouseAttendantNursingExpenses ? 3000: 0;
      this.storeCalculatedData('spouseAttendantNursingDeduction', deduction);
      return deduction;
    },
    childAttendantNursingDeduction() {
      let deduction = 0;
      if (this.inputData.childAttendantNursingExpenses
          && this.inputData.numAttendantNursingChildren
          && this.inputData.numAttendantNursingChildren > 0
          && this.inputData.numAttendantNursingChildren <= this.numChildren
        ) {
        deduction = this.inputData.numAttendantNursingChildren * 3000;
      }
      this.storeCalculatedData('childAttendantNursingDeduction', deduction);
      return deduction;
    },
    // Totals
    sbTotalDeductions() {
      let  deductions =  this.ah65Deduction
        + this.spouseDeduction
        + this.spouse65Deduction
        + (((this.claimedChildCareExpensesReduction * -1) < this.childDeduction) ?  
              (this.childDeduction + this.claimedChildCareExpensesReduction)
              : 0)
        + this.ahDisabilityCreditDeduction
        + this.spouseDisabilityCreditDeduction
        + this.childDisabilityCreditDeduction
        + this.sbRDSPDeduction
        + this.ahAttendantNursingDeduction
        + this.spouseAttendantNursingDeduction
        + this.childAttendantNursingDeduction;
      this.storeCalculatedData('sbTotalDeductions', deductions);
      return deductions;
    },
    sbAdjustedIncome() {
      let adjusted = this.sbTotalHouseholdIncome - this.sbTotalDeductions;
      adjusted = (adjusted > 0) ? adjusted : 0;
      this.storeCalculatedData('sbAdjustedIncome', adjusted);
      return adjusted;
    },
    sbIncomeUnderThreshold() {
      let underThreshold = this.sbAdjustedIncome <= this.qualificationThreshhold;
      this.storeCalculatedData('sbIncomeUnderThreshold', underThreshold);
      return underThreshold;
    },
  },
};
</script>

<style scoped>
.widget-container {
  background: #f2f2f2;
}
</style>