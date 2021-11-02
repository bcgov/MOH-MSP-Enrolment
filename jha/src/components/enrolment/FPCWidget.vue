<template>
  <div>
    <div class="row">
      <div class="col-sm-7">Total Family Income</div>
      <div class="col-sm-5">
        <b>{{formattedTotalIncome}}</b>
      </div>
    </div>

    <hr/>
    <p>
      <b>Deductions</b>
    </p>
    <div class="row">
      <div class="col-sm-7">Family Registered Disability Savings Plan</div>
      <div class="col-sm-5">
        <b>{{formattedRDSP}}</b>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-7">Total Deductions</div>
      <div class="col-sm-5">
        <b>{{formattedRDSP}}</b>
      </div>
    </div>

    <hr/>
    <div class="row">
      <div class="col-sm-7">Adjusted Income</div>
      <div class="col-sm-5">
        <b>{{formattedAdjustedIncome}}</b>
      </div>
    </div>

    <hr/>
    <p>The information you entered indicates you would be eligible for the level of coverage below. Coverage is temporary until we verify your income with CRA.</p>

    <h3>Level of Coverage</h3>
    <DistributionBar startingLabel="$0"
      :items="distributionBarItems"/>
  </div>
</template>

<script>
import { DistributionBar } from 'common-lib-vue';

export default {
  name: 'FPCWidget',
  components: {
    DistributionBar,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    formattedTotalIncome() {
      const ahIncome = parseFloat(this.value.ahIncome) || 0;
      const spouseIncome = parseFloat(this.value.spouseIncome) || 0;
      const totalIncome = ahIncome + spouseIncome;
      return this.formatCurrencyValue(totalIncome);
    },
    formattedRDSP() {
      const ahRDSP = parseFloat(this.value.ahRDSP) || 0;
      const spouseRDSP = parseFloat(this.value.spouseRDSP) || 0;
      const totalRDSP = ahRDSP + spouseRDSP;
      return this.formatCurrencyValue(totalRDSP);
    },
    formattedAdjustedIncome() {
      const ahIncome = parseFloat(this.value.ahIncome) || 0;
      const spouseIncome = parseFloat(this.value.spouseIncome) || 0;
      const ahRDSP = parseFloat(this.value.ahRDSP) || 0;
      const spouseRDSP = parseFloat(this.value.spouseRDSP) || 0;
      const adjustedIncome = ahIncome + spouseIncome - ahRDSP - spouseRDSP;
      return this.formatCurrencyValue(adjustedIncome);
    },
    distributionBarItems() {
      return [
        {
          color: '#036',
          barLabel: '$200',
          label: 'First tier coverage.'
        },
        {
          color: '#f3cd65',
          barLabel: '$400',
          label: 'Second tier coverage.'
        },
        {
          color: '#486446',
          barLabel: '&infin;',
          label: 'Third tier coverage.'
        },
      ];
    }
  },
  methods: {
    formatCurrencyValue(value) {
      const formatterOptions = {
        style: 'currency',
        currency: 'USD',
      };
      const formatter = new Intl.NumberFormat('en-US', formatterOptions);
      return formatter.format(value).replace('.00', '');
    }
  }
}
</script>

<style scoped>

</style>