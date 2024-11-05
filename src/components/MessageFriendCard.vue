<script setup>
import Avatar from "./Avatar.vue";
import formatTimeAgo from "../helpers/formatDate";

defineProps({
  avatar: {
    type: String,
  },
  lastMessageTime: {
    type: String,
  },
  lastMessage: {
    type: String,
  },
});

const authURL = import.meta.env.VITE_APP_AUTH_SERVICE_URL;
</script>

<template>
  <div class="messages__card_wrapper">
    <div class="messages__card_wrapper_main">
      <Avatar :image="avatar" :width="'42px'" :height="'42px'" />
      <div class="messages__card_wrapper_main_info">
        <span><slot /></span>
        <p v-if="lastMessage">{{ lastMessage }}</p>
        <p v-else>No Messages</p>
      </div>
    </div>
    <div class="messages__card_wrapper_stats">
      <span>{{ lastMessageTime }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.messages__card_wrapper {
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray);
  padding: 3px;
  cursor: pointer;

  &_main {
    display: flex;
    align-items: center;
    gap: 10px;

    &_info {
      font-family: var(--main-font-family);
      display: flex;
      flex-direction: column;
      span {
        color: var(--main-color);
        font-size: 16px;
        font-weight: 600;
        width: 7rem;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;

        @media (max-width: 550px) {
          width: 4.25rem;
        }
      }
      p {
        color: var(--gray);
        font-size: 13px;
      }
    }
  }
  &_stats {
    font-family: var(--main-font-family);

    span {
      font-size: 12px;
      color: #ddd;
    }
  }
}
</style>
