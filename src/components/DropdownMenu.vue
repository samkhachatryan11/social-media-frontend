<template>
  <div class="dropdown">
    <button @click="toggleDropdown" class="dropdown_button">
      {{ selectedOption || options[0] }}
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </button>

    <ul v-if="isOpen" class="dropdown_menu">
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="handleOptionSelect(option)"
        class="dropdown_item"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["optionSelected"]);

const options = ref(["My friends", "Friend requests", "Blocked"]);
const isOpen = ref(false);
const selectedOption = ref(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleOptionSelect = (option) => {
  selectedOption.value = option;
  isOpen.value = false;
  emit("optionSelected", option);
};
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-block;

  &_button {
    width: 170px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--gray);
    color: var(--gray);
    font-family: var(--main-font-family);
    border-radius: 12px;
    padding: 6px 10px;
    cursor: pointer;
  }

  &_menu {
    font-family: var(--main-font-family);
    color: #ffffff;
    position: absolute;
    top: 110%;
    left: 0;
    border: 1px solid var(--gray);
    background-color: var(--card-color);
    border-radius: 12px;
    list-style-type: none;
    padding: 4px;
    margin: 0;
    width: 100%;
  }

  &_item {
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
      background-color: var(--gray);
    }
  }
}

.arrow {
  font-size: 13px;
  margin-left: 10px;
  transition: transform 0.2s ease-in-out;
}

.arrow.open {
  transform: rotate(180deg);
}
</style>
