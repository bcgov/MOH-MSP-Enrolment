<template>
  <div
    class="bcgov-table-body p-3"
    :style="{ 'background-color': backgroundColor }"
  >
    <div
      v-for="(element, index) in elements"
      :key="element.label + '-' + index"
      class="bcgov-row d-flex"
    >
      <div class="bcgov-table-cell label">
        <div :class="['table-cell-max', { underlined: element.underlined }]">
          {{ element.label }}
        </div>
      </div>
      <div class="bcgov-table-cell value">
        <b>{{ element.value }}</b>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReviewTable",
  components: {},
  props: {
    elements: Array,
    backgroundColor: {
      type: String,
      default: "white",
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bcgov-table-body {
  display: flex;
  flex-direction: column;
  /* background-color: #EEE; */
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  line-height: 1.5rem;
}

.bcgov-row {
  display: flex;
  flex-direction: row;
  vertical-align: middle;
  padding: 5px 8px;
  white-space: pre-wrap;
}

.bcgov-table-cell.label {
  width: 50%;
}
.bcgov-table-cell.value {
  width: 50%;
  padding-left: 6px;
  word-break: break-word;
}
.table-cell-max {
  max-width: 350px;
  display: inline-block;
}
.underlined {
  text-decoration: underline;
}
</style>
