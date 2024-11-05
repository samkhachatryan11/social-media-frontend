<script setup>
defineProps({
  size: {
    type: String,
    default: "md",
  },
});
</script>

<template>
  <h2 v-if="size === 'lg'" :class="{ [`heading__${size}`]: size }"><slot /></h2>
  <h3 v-if="size === 'md'" :class="{ [`heading__${size}`]: size }"><slot /></h3>
  <h4 v-if="size === 'sm'" :class="{ [`heading__${size}`]: size }"><slot /></h4>
  <h4 v-if="size === 'xs'" :class="{ [`heading__${size}`]: size }"><slot /></h4>
</template>

<style scoped lang="scss">
h2 {
  font-family: var(--main-font-family);
  color: var(--main-color);
}
h3 {
  font-family: var(--main-font-family);
  color: var(--main-color);
}
h4 {
  font-family: var(--main-font-family);
  color: var(--main-color);
}

h2.heading {
  &__lg {
    position: absolute;
    top: 17%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 64px;
    font-weight: 900;
  }
}
h3.heading {
  &__md {
    font-size: 40px;
    font-weight: 800;
  }
}
h4.heading {
  &__sm {
    font-size: 26px;
    font-weight: 600;
  }

  &__xs {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
