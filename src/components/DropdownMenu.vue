<template>
  <div class="dropdown">
    <!-- Button to toggle dropdown -->
    <button @click="toggleDropdown" class="dropdown-button">
      {{ selectedOption || options[0] }}
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </button>

    <!-- Dropdown menu -->
    <ul v-if="isOpen" class="dropdown-menu">
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="handleOptionSelect(option)"
        class="dropdown-item"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

// Define the emit for communication with parent
const emit = defineEmits(["optionSelected"]);

// Define the options and state
const options = ref(["My friends", "Friend requests", "Blocked"]);
const isOpen = ref(false);
const selectedOption = ref(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Function to handle the selection of an option
const handleOptionSelect = (option) => {
  selectedOption.value = option;
  isOpen.value = false;
  emit("optionSelected", option); // Emit the event to parent
};
</script>

<style scoped>
/* Dropdown wrapper */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown button */
.dropdown-button {
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

/* Dropdown menu */
.dropdown-menu {
  font-family: var(--main-font-family);
  color: var(--gray);
  position: absolute;
  top: 110%;
  left: 0;
  border: 1px solid var(--gray);
  border-radius: 12px;
  list-style-type: none;
  padding: 4px;
  margin: 0;
  width: 100%;
}

/* Dropdown items */
.dropdown-item {
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 10px;
}

.dropdown-item:hover {
  background-color: var(--card-color);
  color: #ffffff;
}

/* Arrow for dropdown button */
.arrow {
  font-size: 13px;
  margin-left: 10px;
  transition: transform 0.2s ease-in-out;
}

.arrow.open {
  transform: rotate(180deg);
}
</style>
