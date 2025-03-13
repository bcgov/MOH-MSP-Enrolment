<template>
  <div :class="'widget-container rounded p-3' + className">
    <h2>Eligibility calculator</h2>
    <table class="table table-borderless">
      <tbody>
        <tr>
          <td>
            <span>Total net income</span>
          </td>
          <td>
            <span v-if="inputData.totalHouseholdIncome > 0">
              {{ currencyString(inputData.totalHouseholdIncome) }}
            </span>
            <span v-else> - - </span>
          </td>
        </tr>
      </tbody>
    </table>
    <hr style="border: 1px solid black" />

    <table class="table table-borderless">
      <tbody>
        <tr>
          <th>
            <h3>Deductions</h3>
          </th>
        </tr>
        <tr v-if="inputData.ah65Deduction > 0">
          <td>Age over 65</td>
          <td>
            {{ currencyString(inputData.ah65Deduction) }}
          </td>
        </tr>
        <tr v-if="inputData.spouseDeduction > 0">
          <td>Spouse</td>
          <td>
            {{ currencyString(inputData.spouseDeduction) }}
          </td>
        </tr>
        <tr v-if="inputData.spouse65Deduction > 0">
          <td>Spouse age over 65</td>
          <td>
            {{ currencyString(inputData.spouse65Deduction) }}
          </td>
        </tr>
        <tr v-if="inputData.childDeduction > 0">
          <td>Children</td>
          <td>
            {{ currencyString(inputData.childDeduction) }}
          </td>
        </tr>
        <tr v-if="inputData.claimedChildCareExpensesReduction < 0">
          <td>50% of child care expenses</td>
          <td>
            {{ currencyString(inputData.claimedChildCareExpensesReduction) }}
          </td>
        </tr>
        <tr v-if="inputData.ahDisabilityCreditDeduction > 0">
          <td>Applicant disability credit</td>
          <td>
            {{ currencyString(inputData.ahDisabilityCreditDeduction) }}
          </td>
        </tr>
        <tr v-if="inputData.spouseDisabilityCreditDeduction > 0">
          <td>Spouse disability credit</td>
          <td>
            {{ currencyString(inputData.spouseDisabilityCreditDeduction) }}
          </td>
        </tr>
        <tr v-if="inputData.childDisabilityCreditDeduction > 0">
          <td>Child disability credit</td>
          <td>
            {{ currencyString(inputData.childDisabilityCreditDeduction) }}
          </td>
        </tr>
        <tr v-if="inputData.rdspDeduction > 0">
          <td>Disability savings plan</td>
          <td>
            {{ currencyString(inputData.rdspDeduction) }}
          </td>
        </tr>
        <tr v-if="inputData.ahAttendantNursingDeduction > 0">
          <td>Applicant attendant care expense</td>
          <td>
            {{ currencyString(inputData.ahAttendantNursingDeduction) }}
          </td>
        </tr>
        <tr v-if="inputData.spouseAttendantNursingDeduction > 0">
          <td>Spouse attendant care expense</td>
          <td>
            {{ currencyString(inputData.spouseAttendantNursingDeduction) }}
          </td>
        </tr>
        <tr v-if="inputData.childAttendantNursingDeduction > 0">
          <td>Child attendant care expense</td>
          <td>
            {{ currencyString(inputData.childAttendantNursingDeduction) }}
          </td>
        </tr>
        <tr>
          <td class="deduction-table-cell-margin">
            <h4>Total deductions</h4>
          </td>
          <td>
            <span v-if="inputData.totalDeductions > 0">
              {{ currencyString(inputData.totalDeductions) }}
            </span>
            <span v-else> - - </span>
          </td>
        </tr>  
      </tbody>
    </table>
    <hr style="border: 1px solid black" />

    <table class="table table-borderless">
      <tbody>
        <tr>
          <td>
            <h4>Adjusted net income:</h4>
          </td>
          <td>
            <span
              v-if="
                inputData.adjustedIncome === null ||
                inputData.adjustedIncome === undefined ||
                inputData.adjustedIncome === ''
              "
            >
              - -
            </span>
            <span v-else-if="inputData.adjustedIncome > 0">
              {{ currencyString(inputData.adjustedIncome) }}
            </span>
            <span v-else>
              {{ currencyString(0) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p
      v-if="inputData.adjustedIncome >= 0 && inputData.incomeUnderThreshold"
      class="result-message-success"
    >
      It is likely that you will qualify for Supplementary Benefits.
    </p>
    <p
      v-if="!inputData.incomeUnderThreshold"
      class="result-message-failure"
      aria-live="assertive"
    >
      You might not qualify for Supplementary Benefits.
    </p>
  </div>
</template>

<script>
import { convertNumberToFormattedString } from "common-lib-vue";
import SuppBenData from "@/data-types/supp-ben-data";

export default {
  name: "SuppBenWidget",
  props: {
    inputData: {
      type: SuppBenData,
    },
    className: {
      type: String,
      default: "",
    },
  },
  data: () => {
    return {};
  },
  methods: {
    currencyString(num) {
      return num >= 0
        ? `$${convertNumberToFormattedString(num)}`
        : `-$${convertNumberToFormattedString(num * -1)}`;
    },
  },
};
</script>

<style scoped>
.widget-container {
  background: #f2f2f2;
}
.result-message-success {
  color: rgb(0, 128, 0);
  font-size: 1rem;
  font-weight: 400;
}
.result-message-failure {
  color: #cc5900;
  font-size: 1rem;
  font-weight: 700;
}
</style>
