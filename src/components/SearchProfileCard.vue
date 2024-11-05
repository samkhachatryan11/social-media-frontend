<script setup>
import Avatar from "./Avatar.vue";
import Heading from "./Heading.vue";

const props = defineProps({
  avatar: {
    type: String,
  },
  username: {
    type: String,
  },
});
</script>

<template>
  <div class="search__profile_wrapper">
    <div class="search__profile_wrapper_info">
      <Avatar :image="props.avatar" :width="'64px'" :height="'64px'" />
      <Heading size="sm">{{ props.username }}</Heading>
    </div>
    <div class="search__profile_wrapper_menu">
      <img src="../assets/svg/dots.svg" alt="menu" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search__profile_wrapper {
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--gray);
  padding: 8px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background: rgba(100, 100, 100, 0.3);
  }

  &_info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &_menu {
    display: flex;
    align-items: center;
  }
}
</style>
