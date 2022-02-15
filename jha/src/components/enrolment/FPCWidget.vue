<template>
  <div>
    <div class="row">
      <div class="col-sm-7">Total Family Income</div>
      <div class="col-sm-5">
        <b>{{totalIncome | currencyFilter}}</b>
      </div>
    </div>

    <hr/>
    <p>
      <b>Deductions</b>
    </p>
    <div class="row">
      <div class="col-sm-7">Family Registered Disability Savings Plan</div>
      <div class="col-sm-5">
        <b>{{RDSP | currencyFilter}}</b>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-7">Total Deductions</div>
      <div class="col-sm-5">
        <b>{{RDSP | currencyFilter}}</b>
      </div>
    </div>

    <hr/>
    <div class="row">
      <div class="col-sm-7">Adjusted Income</div>
      <div class="col-sm-5">
        <b>{{adjustedIncome | currencyFilter}}</b>
      </div>
    </div>

    <hr/>
    <p>The information you entered indicates you would be eligible for the level of coverage below. Coverage is temporary until we verify your income with CRA.</p>

    <h3>Level of Coverage</h3>
    <div v-if="isLoading"
      class="text-center">
      <Loader color="#000"
        size="24px" />
    </div>
    <DistributionBar v-if="!isLoading"
      startingLabel="$0"
      :items="distributionBarItems"/>
  </div>
</template>

<script>
import {
  DistributionBar,
  Loader,
} from 'common-lib-vue';
import {
  isBefore,
  parseISO,
} from 'date-fns';
import apiService from '@/services/api-service';
import {
  MODULE_NAME as appModule,
  SET_DEDUCTIBLES_API_DATA,
} from '@/store/modules/app-module';

const BLUE = '#036';
const YELLOW = '#f3cd65';
const GREEN = '#486446';

export default {
  name: 'FPCWidget',
  components: {
    DistributionBar,
    Loader,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data: () => {
    return {
      isLoading: false,
      isSystemDown: false,
    };
  },
  async created() {
    let apiData = this.$store.state.appModule.deductiblesAPIData;
    try {
      if (!apiData) {
        apiData = await this.fetchCoverageData();
        this.$store.dispatch(`${appModule}/${SET_DEDUCTIBLES_API_DATA}`, apiData);
      }
      this.deductibleTiers = this.formatServerData(apiData.assistanceLevels) || [];
      this.pre1939DeductibleTiers = this.formatServerData(apiData.pre1939AssistanceLevels) || [];
    } catch (error) {
      this.isSystemDown = true;
      this.deductibleTiers = [];
      this.pre1939DeductibleTiers = [];
    }
  },
  computed: {
    totalIncome() {
      const ahIncome = parseFloat(this.value.ahIncome) || 0;
      const spouseIncome = parseFloat(this.value.spouseIncome) || 0;
      const totalIncome = ahIncome + spouseIncome;
      return totalIncome;
    },
    RDSP() {
      const ahRDSP = parseFloat(this.value.ahRDSP) || 0;
      const spouseRDSP = parseFloat(this.value.spouseRDSP) || 0;
      const totalRDSP = ahRDSP + spouseRDSP;
      return totalRDSP;
    },
    adjustedIncome() {
      const ahIncome = parseFloat(this.value.ahIncome) || 0;
      const spouseIncome = parseFloat(this.value.spouseIncome) || 0;
      const ahRDSP = parseFloat(this.value.ahRDSP) || 0;
      const spouseRDSP = parseFloat(this.value.spouseRDSP) || 0;
      const adjustedIncome = ahIncome + spouseIncome - ahRDSP - spouseRDSP;
      return adjustedIncome;
    },
    distributionBarItems() {
      if (this.isLoading) {
        return null;
      }
      const tier = this.getCoverageTier();
      if (tier.maximum === 0) {
        return [
          {
            color: GREEN,
            barLabel: '&infin;',
            label: 'PharmaCare pays 100% of eligible drug costs'
          }
        ];
      } else if (tier.deductible === 0) {
        return [
          {
            color: YELLOW,
            barLabel: this.formatCurrencyNumber(tier.maximum),
            label: `PharmaCare pays ${tier.pharmaCarePortion}% and you pay ${100 - tier.pharmaCarePortion}% of eligible drug costs (between ${this.formatCurrencyNumber(tier.deductible)} and ${this.formatCurrencyNumber(tier.maximum)})`
          },
          {
            color: GREEN,
            barLabel: '&infin;',
            label: `PharmaCare pays 100% of eligible drug costs after you reach the family maximum (${this.formatCurrencyNumber(tier.maximum)})`
          }
        ];
      } else if (tier.pharmaCarePortion === 100) {
        return [
          {
            color: BLUE,
            barLabel: this.formatCurrencyNumber(tier.deductible),
            label: `You pay 100% of eligible drug costs (between $0 and ${this.formatCurrencyNumber(tier.deductible)})`
          },
          {
            color: GREEN,
            barLabel: '&infin;',
            label: `PharmaCare pays 100% of eligible drug costs after you reach the family maximum (${this.formatCurrencyNumber(tier.maximum)})`
          },
        ];
      } else {
        return [
          {
            color: BLUE,
            barLabel: this.formatCurrencyNumber(tier.deductible),
            label: `You pay 100% of eligible drug costs (between $0 and ${this.formatCurrencyNumber(tier.deductible)})`
          },
          {
            color: YELLOW,
            barLabel: this.formatCurrencyNumber(tier.maximum),
            label: `PharmaCare pays ${tier.pharmaCarePortion}% and you pay ${100 - tier.pharmaCarePortion}% of eligible drug costs (between ${this.formatCurrencyNumber(tier.deductible)} and ${this.formatCurrencyNumber(tier.maximum)})`
          },
          {
            color: GREEN,
            barLabel: '&infin;',
            label: `PharmaCare pays 100% of eligible drug costs after you reach the family maximum (${this.formatCurrencyNumber(tier.maximum)})`
          },
        ];
      }
    }
  },
  methods: {
    formatCurrencyNumber(value) {
      if (typeof value !== 'number') {
        return '$0';
      }
      const formatterOptions = {
        style: 'currency',
        currency: 'USD',
      };
      const formatter = new Intl.NumberFormat('en-US', formatterOptions);
      return formatter.format(value).replace('.00', '');
    },
    fetchCoverageData() {
      const formState = this.$store.state.enrolmentModule;
      this.isLoading = true;

      // Make API request to get coverage data.
      return new Promise((resolve, reject) => {
        apiService.getDeductibles(formState)
          .then((response) => {
            this.isLoading = false;
            console.log(response.data);
            resolve(response.data);
          })
          .catch((error) => {
            this.isLoading = false;
            reject(error)
          });
      });
    },
    getCoverageTier() {
      const ahBirthdate = this.value.ahBirthdate;
      if (isBefore(ahBirthdate, parseISO('1939-01-01'))) {
        return this.pre1939DeductibleTiers.find((item) => {
          return this.adjustedIncome >= item.startRange && this.adjustedIncome <= item.endRange;
        });
      } else {
        return this.deductibleTiers.find((item) => {
          return this.adjustedIncome >= item.startRange && this.adjustedIncome <= item.endRange;
        });
      }
    },
    formatServerData(arr) {
      return arr.map((item) => {
        return {
          startRange: Number(item.startRange),
          endRange: Number(item.endRange),
          deductible: Number(item.deductible.replace('$', '')),
          pharmaCarePortion: Number(item.pharmaCarePortion.replace('%', '')),
          maximum: Number(item.maximum.replace('$', ''))
        };
      });
    }
  },
  filters: {
    currencyFilter() {
      //this.formatCurrencyNumber(value);
    }
  }
}
</script>

<style scoped>

</style>