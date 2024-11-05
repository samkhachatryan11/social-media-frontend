<script setup>
defineProps({
  width: {
    type: [String, Number],
    default: 50,
  },
  height: {
    type: [String, Number],
    default: 50,
  },
  color: {
    type: [String, Number],
  },
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="`0 0 100 100`"
  >
    <circle
      cx="50"
      cy="50"
      r="35"
      :stroke="color"
      stroke-width="10"
      fill="none"
      class="circle"
    />
  </svg>
</template>

<style lang="scss" scoped>
.circle {
  stroke-dasharray: 164.93361431346415 56.97787143782138;
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
    transform-origin: 50%;
  }
  to {
    transform: rotate(360deg);
    transform-origin: 50%;
  }
}
</style>
