<script setup>
import { ref, toRef } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  rows: {
    type: Number,
    default: 3,
  },
  maxLength: {
    type: Number,
  },
  send: {
    type: Function,
  },
});

const emit = defineEmits(["update:modelValue"]);

const content = toRef(props, "modelValue");

const handleInputChange = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <div class="textarea__wrapper">
    <textarea
      :rows="rows"
      :maxlength="maxLength"
      :value="content"
      @input="handleInputChange"
      :placeholder="placeholder"
      class="textarea__wrapper_main"
    ></textarea>
    <div class="textarea__wrapper_menu">
      <span>{{ content?.length || 0 }}/{{ props.maxLength }}</span>
      <img src="../assets/svg/send.svg" alt="send" @click="props.send" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.textarea__wrapper {
  border: 1px solid var(--gray);
  background-color: var(--card-color);
  border-radius: 10px;

  &_main {
    color: #ffffff;
    font-family: var(--secondary-font-family);
    font-size: 17px;
    padding: 6px;
    min-width: 100%;
    resize: none;
    height: 132px;
    background: transparent;
    border-bottom: 1px solid var(--gray);

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
      border: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--gray);
      border-radius: 20px;
      cursor: default;
    }
  }

  &_menu {
    display: flex;
    justify-content: space-between;
    padding: 0px 5px 5px 5px;
    gap: 8px;

    img {
      cursor: pointer;

      &:hover {
        -webkit-filter: brightness(85%);
        -webkit-transition: all 0.3s ease;
        transition: all 0.3s ease;
      }
    }

    span {
      font-family: var(--main-font-family);
      color: #dddddd;
    }
  }
}
</style>
