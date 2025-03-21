<template>
  <div>
    <div class="row">
      <div class="col-sm-7">Total net income</div>
      <div class="col-sm-5">
        <b>{{ totalIncome }}</b>
      </div>
    </div>

    <hr />
    <p>
      <b>Deductions</b>
    </p>
    <div class="row">
      <div class="col-sm-7">Total RDSP income</div>
      <div class="col-sm-5">
        <b>{{ RDSP }}</b>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-7">Total deductions</div>
      <div class="col-sm-5">
        <b>{{ RDSP }}</b>
      </div>
    </div>

    <hr />
    <div class="row">
      <div class="col-sm-7">Adjusted income</div>
      <div class="col-sm-5">
        <b>{{ formatAdjustedIncome }}</b>
      </div>
    </div>

    <hr />
    <p>
      Based on the information you entered, you may be eligible for the level of
      coverage below. Coverage is temporary until we verify your income with the
      CRA.
    </p>

    <h3>Level of coverage</h3>
    <div v-if="isLoading" class="text-center">
      <LoaderComponent color="#000" size="24px" />
    </div>
    <div
      v-if="isSystemUnavailable"
      class="text-danger mt-3 mb-3"
      aria-live="assertive"
    >
      Unable to retrieve assistance levels, system unavailable.
    </div>
    <DistributionBar
      v-if="!isLoading && !isSystemUnavailable"
      startingLabel="$0"
      :items="distributionBarItems"
    />
  </div>
</template>

<script>
import { DistributionBar, LoaderComponent } from "common-lib-vue";
import apiService from "@/services/api-service";
import logService from "@/services/log-service";
import {
  MODULE_NAME as appModule,
  SET_DEDUCTIBLES_API_DATA,
} from "@/store/modules/app-module";
import {
  formatCurrencyNumber,
  formatServerData,
  getCoverageTier,
  getDistributionBarItems,
} from "@/helpers/fpc-helpers";

export default {
  name: "FPCWidget",
  components: {
    DistributionBar,
    LoaderComponent,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data: () => {
    return {
      isLoading: false,
      isSystemUnavailable: false,
      deductibleTiers: [],
      pre1939DeductibleTiers: [],
    };
  },
  async created() {
    let apiData = this.$store.state.appModule.deductiblesAPIData;

    this.isLoading = true;
    this.isSystemUnavailable = false;

    try {
      if (!apiData) {
        const response = await apiService.getDeductibles(
          this.$store.state.enrolmentModule.captchaToken,
          this.$store.state.enrolmentModule.fpcUuid,
        );
        apiData = response.data;
        if (
          !apiData ||
          !apiData.assistanceLevels ||
          !apiData.pre1939AssistanceLevels
        ) {
          throw new Error("response data does not include assistance levels.");
        }
        this.$store.dispatch(
          `${appModule}/${SET_DEDUCTIBLES_API_DATA}`,
          apiData,
        );
      }
      this.deductibleTiers = formatServerData(apiData.assistanceLevels) || [];
      this.pre1939DeductibleTiers =
        formatServerData(apiData.pre1939AssistanceLevels) || [];
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.isSystemUnavailable = true;

      logService.logError(this.$store.state.enrolmentModule.applicationUuid, {
        event: "error getting values from getDeductibles endpoint",
        error,
      });
    }
  },
  computed: {
    totalIncome() {
      const ahIncome = parseFloat(this.modelValue.ahIncome) || 0;
      const spouseIncome = parseFloat(this.modelValue.spouseIncome) || 0;
      const totalIncome = ahIncome + spouseIncome;
      return formatCurrencyNumber(totalIncome);
    },
    RDSP() {
      const ahRDSP = parseFloat(this.modelValue.ahRDSP) || 0;
      const spouseRDSP = parseFloat(this.modelValue.spouseRDSP) || 0;
      const totalRDSP = ahRDSP + spouseRDSP;
      return formatCurrencyNumber(totalRDSP);
    },
    adjustedIncome() {
      const ahIncome = parseFloat(this.modelValue.ahIncome) || 0;
      const spouseIncome = parseFloat(this.modelValue.spouseIncome) || 0;
      const ahRDSP = parseFloat(this.modelValue.ahRDSP) || 0;
      const spouseRDSP = parseFloat(this.modelValue.spouseRDSP) || 0;
      const totalAdjustedIncome = ahIncome + spouseIncome - ahRDSP - spouseRDSP;
      return totalAdjustedIncome;
    },
    formatAdjustedIncome() {
      return formatCurrencyNumber(this.adjustedIncome);
    },
    distributionBarItems() {
      const tier = getCoverageTier({
        ahBirthdate: this.modelValue.ahBirthdate,
        spouseBirthdate: this.modelValue.spouseBirthdate,
        adjustedIncome: this.adjustedIncome,
        pre1939DeductibleTiers: this.pre1939DeductibleTiers,
        deductibleTiers: this.deductibleTiers,
      });
      return getDistributionBarItems(tier);
    },
  },
};
</script>

<style scoped></style>
