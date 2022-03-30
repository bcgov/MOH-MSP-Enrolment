<template>
  <div class="success-box container">
    <div class="row align-items-center">
      <div class="col-md-1 pr-0 text-center text-success">
        <font-awesome-icon icon="check-circle" size="3x" />
      </div>
      <div class="col-md-10 py-2">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-box {
  border-radius: 10px;
  border: 5px solid rgba(46, 133, 64, 1);
  padding: 10px;
}
</style>
