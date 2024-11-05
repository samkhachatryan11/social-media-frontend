<script setup>
import Avatar from "./Avatar.vue";
const props = defineProps({
  content: {
    type: String,
  },
  user: {
    type: Object,
  },
  type: {
    type: String,
  },
});
</script>

<template>
  <div class="notification__card_wrapper">
    <div class="notification__card_wrapper_content">
      <div v-if="!image" class="notification__card_wrapper_content_image">
        <Avatar :width="'60px'" :height="'60px'" :image="props.user?.avatar" />
      </div>
      <p v-if="props.type === 'Request'">{{ user.username }}</p
      ><span>have sent you friend request!</span>
    </div>
    <div class="notification__card_wrapper_menu">
      <img src="../assets/svg/dots.svg" alt="" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.notification__card_wrapper {
  display: flex;
  align-items: center;
  background-color: var(--card-color);
  padding: 6px;
  border-radius: 12px;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background: rgba(100, 100, 100, 0.6);
  }

  &_content {
    font-family: var(--main-font-family);
    display: flex;
    align-items: center;
    gap: 10px;

    p {
      font-weight: 600;
      font-size: 22px;
      color: var(--main-color);
    }
    span {
      font-size: 14px;
      font-family: var(--secondary-font-family);
      color: #fff;
      font-weight: 500;
    }
  }

  &_menu {
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
