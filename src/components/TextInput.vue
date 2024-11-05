<script setup>
const props = defineProps({
  placeholder: {
    type: String,
  },
  modelValue: {
    type: String,
  },
  search: {
    type: Boolean,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
});

const emit = defineEmits(["update:modelValue"]);

const onInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <div class="input__wrapper">
    <input
      type="text"
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
    />
  </div>
</template>

<style scoped lang="scss">
.input__wrapper {
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    border: 1px solid var(--gray);
    padding: 4px;
    border-radius: 8px;
    color: #dddddd;
    font-family: var(--main-font-family);
    width: v-bind(width);
    height: v-bind(height);
  }

  img {
    cursor: pointer;
  }
}

textarea:focus,
input:focus {
  outline: none;
}
</style>
