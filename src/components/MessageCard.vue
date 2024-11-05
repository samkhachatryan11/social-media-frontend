<script setup>
import { computed, onMounted } from "vue";
import Avatar from "./Avatar.vue";

const props = defineProps({
  friend: {
    type: Object,
    required: true,
  },
  message: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  isMine: Boolean,
});

const messageClass = computed(() => {
  return props.isMine ? "message-card right" : "message-card left";
});
</script>

<template>
  <div :class="['message__card_wrapper', messageClass]">
    <!-- Avatar Section -->
    <div class="message__card_wrapper_avatar">
      <Avatar
        v-if="isMine"
        :image="user.avatar"
        :width="'36px'"
        :height="'36px'"
      />
      <Avatar v-else :image="friend.avatar" :width="'36px'" :height="'36px'" />
    </div>

    <!-- Message Content -->
    <div class="message__card_wrapper_main">
      <!-- Typing indicator -->
      <div v-if="typing" class="message__card_wrapper_main_content typing">
        <p>typing...</p>
      </div>

      <!-- Actual message content -->
      <div v-else class="message__card_wrapper_main_content">
        <p>{{ message.content }}</p>
      </div>

      <!-- Message timestamp -->
      <div class="message__card_wrapper_main_date">
        <span>{{ message.createdAt }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message__card_wrapper {
  display: flex;
  gap: 8px;
  padding: 10px 0px;

  &_main {
    font-family: var(--secondary-font-family);
    display: flex;
    flex-direction: column;

    &_content {
      background-color: var(--card-color);
      color: #dddddd;
      padding: 8px;
      border-radius: 12px;
      max-width: 230px;
      word-wrap: break-word;
    }

    &_date {
      color: var(--main-color);
      font-size: 0.75rem;
      margin-top: 5px;
    }
  }
}

/* Align the current user's messages to the right */
.right {
  align-self: flex-end;
}

.left {
  align-self: flex-start;
}
</style>
