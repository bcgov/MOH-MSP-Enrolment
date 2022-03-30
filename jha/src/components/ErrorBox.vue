<template>
  <div class="error-box container box-border border border-danger">
    <div class="row align-items-center">
      <div class="col-md-1 pr-0 text-center">
        <div class="status-icon text-danger">
          <font-awesome-icon icon="times-circle" size="3x" />
        </div>
      </div>
      <div class="col-md-10 py-2">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-box {
  border-radius: 10px;
  padding: 10px;
}
.box-border {
  border-width: 5px !important;
}
</style>
