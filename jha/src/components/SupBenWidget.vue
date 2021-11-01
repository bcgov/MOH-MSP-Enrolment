<template>
  <div :class="'widget-container rounded p-3' + className">
    <h2>Eligibility Calculator</h2>
    <table class="table">
      <tbody>
        <tr>
          <td>
            <span>Total Household Income</span>
          </td>
          <td>
            <span v-if="totalHouseholdIncome > 0">
              {{ currencyString(totalHouseholdIncome) }}
            </span>
            <span v-else> - - </span>
          </td>
        </tr>
      </tbody>
    </table>
    <hr style="border: 1px solid black" />

    <table class="table">
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
      <tr v-if="childDeductions > 0">
        <td>Children</td>
        <td>
          {{currencyString(childDeductions)}}
        </td>
      </tr>
      <tr v-if="claimedChildCareExpensesReduction > 0">
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
      <tr v-if="dspDeduction > 0">
        <td>
          Disability savings plan
        </td>
        <td>
          {{currencyString(dspDeduction)}}
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
          <span v-if="totalDeductions > 0" >
            {{currencyString(totalDeductions)}}
          </span>
          <span v-else>- - </span>
        </td>
      </tr>
    </table>
    <hr style="border: 1px solid black;">

    <table class="table">
      <tbody>
        <tr>
          <td>
            <h4>Adjusted Net Income:</h4>
          </td>
          <td>
            <span v-if="adjustedIncome > 0">
              {{currencyString(adjustedIncome)}}
            </span>
            <span v-else>
              - -
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="adjustedIncome > 0 && incomeUnderThreshhold">
      It is likely that you will qualify for Supplementary Benefits.
    </p>
    <p v-else>
      "You might not qualify for Supplementary Benefits."
    </p>
  </div>
</template>

<script>

import {
  convertNumberToFormattedString,
  calculateAge,
} from 'common-lib-vue';

export default {
  name: "SupBenWidget",
  props: {
    value: {
      type: Object,
      default: {},
    },
    className: {
      type: String,
      default: "",
    },
  },
  data: () => {
    return {
      qualificationThreshhold: 42000,
    };
  },
  methods: {
    removeCommas(stringNumber) {
      return stringNumber.replace(/[,]/g, '');
    },
    stringToFloat(stringNumber) {
      return (!!stringNumber && !isNaN(stringNumber)) ? 
        parseFloat(removeCommas(stringNumber)) : 0;
    },
    ageOver65(birthdate) {
      return (birthDate instanceof Date) && (65 <= calculateAge(birthdate));
    },
    currencyString(num) {
      return (num >= 0) ?
          `$${convertNumberToFormattedString(num)}`
          : `-$${convertNumberToFormattedString(num * -1)}`;
    }
  },
  computed: {
    // Income
    totalHouseholdIncome() {
      let income = stringToFloat(this.value.ahNetIncome);
      if( this.value.hasSpouse) {
        income += stringToFloat(this.value.spouseNetIncome);
      }
      income = (income > 0) ? income : 0;
      this.value.totalHouseholdIncome = income;
      return income;
    },
    // Deductions
    ah65Deduction() {
      let deduction = ageOver65(this.value.ahBirthdate) ? 3000 : 0;
      this.value.ah65Deduction = deduction;
      return deduction;
    },
    spouseDeduction () {
      let deduction = (this.value.hasSpouse === 'Y') ? 3000 : 0;
      this.value.spouseDeduction = deduction;
      return deduction;
    },
    spouse65Deduction() {
      let deduction = ageOver65(this.value.spouseBirthdate) ? 3000 : 0;
      this.value.spouse65Deduction = deduction;
      return deduction;
    },
    childDeduction() {
      let deduction = !!this.value.children ? this.value.children.length() * 3000: 0;
      this.value.childDeduction = deduction;
      return deduction;
    },
    claimedChildCareExpensesReduction() {
      let expenses = stringToFloat(this.value.claimedChildCareExpenses);
      expenses = expenses > 0 ? ((expenses / 2) * -1): 0;
      this.value.childAdjustedDeduction = (((expenses * -1) < this.childDeductions) ?  
                    (this.childDeductions + expenses) : 0);
      return expenses;
    },
    ahDisabilityCreditDeduction() {
      let deduction = !!this.value.ahDisabilityCredit ? 3000: 0;
      this.value.ahDisabilityCreditDeduction = deduction;
      return deduction;
    },
    spouseDisabilityCreditDeduction() {
      let deduction = !!this.value.spouseDisabilityCredit ? 3000: 0;
      this.value.spouseDisabilityCreditDeduction = deduction;
      return deduction;
    },
    childDisabilityCreditDeduction() {
      let deduction = 0;
      if ( !!this.value.numDisabilityChildren
          && this.value.numDisabilityChildren > 0
          && this.value.numDisabilityChildren <= this.value.children.length()
        ) {
        deduction = this.value.numDisabilityChildren * 3000;
      }
      this.value.childDisabilityCreditDeduction = deduction;
      return deduction;
    },
    dspDeduction() {
      let deduction = stringToFloat(this.value.dspDeduction);
      deduction = (deduction > 0) ? deduction: 0;
      this.value.dspDeduction = deduction;
      return deduction;
    },
    ahAttendantNursingDeduction() {
      let deduction = !!this.value.ahAttendantNursingCredit ? 3000: 0;
      this.value.ahAttendantNursingDeduction = deduction;
      return deduction;
    },
    spouseAttendantNursingDeduction() {
      let deduction = !!this.value.spouseAttendantNursingCredit ? 3000: 0;
      this.value.spouseAttendantNursingDeduction = deduction;
      return deduction;
    },
    childAttendantNursingDeduction() {
      let deduction = 0;
      if ( !!this.value.numAttendantNursingChildren
          && this.value.numAttendantNursingChildren > 0
          && this.value.numAttendantNursingChildren <= this.value.children.length()
        ) {
        deduction = this.value.numAttendantNursingChildren * 3000;
      }
      this.value.childAttendantNursingDeduction = deduction;
      return deduction;
    },
    // Totals
    totalDeductions() {
      let  deductions =  this.ah65Deduction
        + this.spouseDeduction
        + this.spouse65Deduction
        + (((this.claimedChildCareExpensesReduction * -1) < this.childDeductions) ?  
              (this.childDeductions + this.claimedChildCareExpensesReduction)
              : 0)
        + this.ahDisabilityCreditDeduction
        + this.spouseDisabilityCreditDeduction
        + this.childDisabilityCreditDeduction
        + this.dspDeduction
        + this.ahAttendantNursingDeduction
        + this.spouseAttendantNursingDeduction
        + this.childAttendantNursingDeduction;
      this.value.totalDeductions = deductions;
      return deductions;
    },
    adjustedIncome() {
      let adjusted = this.totalHouseholdIncome - this.totalDeductions;
      adjusted = (adjusted > 0) ? adjusted : 0;
      this.value.adjustedIncome = adjusted;
      return adjusted;
    },
    incomeUnderThreshhold() {
      let underThreshold = this.adjustedIncome <= this.qualificationThreshhold;
      this.value.incomeUnderThreshold = underThreshold;
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