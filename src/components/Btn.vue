<script setup>
defineProps({
  size: {
    type: String,
    default: "sm",
  },
  color: {
    type: String,
  },
});
</script>

<template>
  <button :class="{ [`btn__${size}_${color}`]: size, color }"><slot /></button>
</template>

<style scoped lang="scss">
button {
  font-family: var(--main-font-family);
  font-weight: 500px;
  font-size: 24px;
  padding: 13px 16px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-image: linear-gradient(rgb(0 0 0/15%) 0 0);
}

button.btn {
  &__md {
    &_green {
      font-weight: 500;
      background-color: var(--main-color);
      color: var(--secondary-color);
    }

    &_gray {
      font-weight: 600;
      background-color: var(--secondary-color);
      color: var(--main-color);
    }
  }

  &__sm {
    &_green {
      font-size: 18px;
      padding: 8px 16px;
      border-radius: 12px;
      border: 1px solid var(--main-color);
      color: var(--secondary-color);
      background-color: var(--main-color);
      cursor: pointer;
    }

    &_gray {
      font-size: 10px;
      padding: 10px 12px;
      border-radius: 12px;
      background-color: var(--secondary-color);
      color: var(--main-color);
    }

    &_disabled {
      font-size: 18px;
      padding: 8px 16px;
      border-radius: 12px;
      border: 1px solid var(--gray);
      color: var(--gray);
      background: transparent;
      cursor: default;
    }
  }
}
</style>
