<script setup>
import { ref, onMounted, nextTick, watch, computed } from "vue";
import { useUserStore } from "../stores/userStore";
import { chatSocket } from "../services/socket"; // Ensure this imports your socket instance
import { useChatStore } from "../stores/chatStore";
import TextArea from "../components/TextArea.vue";
import MainLayout from "../layouts/MainLayout.vue";
import MessageCard from "../components/MessageCard.vue";
import MessageFriendCard from "../components/MessageFriendCard.vue";
import TextInput from "../components/TextInput.vue";
import Heading from "../components/Heading.vue";
import Avatar from "../components/Avatar.vue";
import router from "../router";
import { useRoute } from "vue-router";

const searchInput = ref("");
const isChatActive = ref(false);
const userStore = useUserStore();
const socket = ref(chatSocket);
const messageContent = ref("");
const chosenFriend = ref({});
const chatStore = useChatStore();
const messagesContainer = ref(null); // Create a ref for the messages container
const route = useRoute();

const isTypingFriend = ref(false); // Track if the friend is typing
const isTypingCurrentUser = ref(false); // Track if the current user is typing
const typingUser = ref(""); // Store the typing user's name

const initializeSocket = () => {
  socket.value.on("chat", async (message) => {
    await chatStore.fetchMessages(userStore.getUser.id, chosenFriend.value.id);
    scrollToBottom(); // Scroll down when a new message is received
    isTypingFriend.value = false; // Reset friend typing status
  });

  socket.value.on("typing", ({ userId }) => {
    const friendId = chosenFriend.value.id;
    typingUser.value = chosenFriend.value.username; // Get the friend's username
    isTypingFriend.value = true; // Show that the friend is typing
    setTimeout(() => {
      isTypingFriend.value = false; // Reset after 2 seconds
    }, 2000);
  });
};

watch(
  () => route.params.id,
  async () => {
    await chatStore.fetchMessages(userStore.getUser.id, route.params.id);
  }
);

onMounted(() => {
  userStore.fetchUserData();
  initializeSocket();
});

const openChatWithFriend = async (friend) => {
  isChatActive.value = true;
  chosenFriend.value = friend;
  await chatStore.fetchMessages(userStore.getUser.id, friend.id);
  scrollToBottom(); // Scroll down when opening the chat
  const userId = userStore.getUser.id;
  socket.value.emit("join", { userId, secondMember: friend.id });
  router.push({ name: "Messages", params: { id: friend.id } });
};

const sendMessage = () => {
  const userId = userStore.getUser.id;
  const friendId = chosenFriend.value.id;
  const content = messageContent.value;

  if (!content.trim()) return;

  socket.value.emit("chat", {
    userId,
    secondMember: friendId,
    messageContent: content,
  });

  messageContent.value = "";
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const notifyTyping = () => {
  const userId = chosenFriend.value.id;

  socket.value.emit("typing", { userId });
};
</script>

<template>
  <MainLayout>
    <div class="messages__wrapper">
      <div class="messages__wrapper_friend_list">
        <div class="messages__wrapper_friend_list_search">
          <TextInput
            v-debounce:200ms="searchFriends"
            :debounce-events="'keydown'"
            v-model="searchInput"
            :placeholder="'Search in friends'"
            :width="'100%'"
          />
        </div>
        <div
          v-if="userStore.getUserFriends.length < 1"
          class="messages__wrapper_friend_list_empty"
        >
          <Heading size="sm">No Friends</Heading>
        </div>
        <div v-else class="messages__wrapper_friend_list_main">
          <MessageFriendCard
            v-for="friend in userStore.getUserFriends"
            :key="friend.id"
            :avatar="friend.avatar"
            @click="openChatWithFriend(friend)"
            class="messages__wrapper_friend_list_main_item"
          >
            {{ friend.username }}
          </MessageFriendCard>
        </div>
      </div>
      <div v-if="isChatActive" class="messages__wrapper_chat_section">
        <div class="messages__wrapper_chat_section_input">
          <TextArea
            class="messages__wrapper_chat_section_input_textarea"
            :maxLength="800"
            v-model="messageContent"
            :placeholder="'Type Something...'"
            name="content"
            id="content"
            :send="sendMessage"
            @input="notifyTyping"
          ></TextArea>
        </div>
        <div v-if="isTypingFriend" class="typing-indicator">
          {{ chosenFriend.username }} is typing...</div
        >
        <!-- Friend typing -->
        <!-- <div v-if="notifyTyping" class="typing-indicator">
          {{ chosenFriend.username }} are typing...</div
        > -->
        <!-- Current user typing -->
        <div
          v-if="chatStore.getMessages.length < 1"
          class="messages__wrapper_chat_section_empty"
        >
          <Heading size="md">Send the first message</Heading>
        </div>
        <div
          v-else
          class="messages__wrapper_chat_section_message"
          ref="messagesContainer"
        >
          <MessageCard
            v-for="message in chatStore.getMessages"
            :key="message._id"
            :message="message.content"
            :friend="chosenFriend"
            :user="userStore.getUser"
            :isMine="message.sender_id === userStore.getUser.id"
          />
        </div>
        <div class="messages__wrapper_chat_section_info">
          <Avatar
            :image="userStore.getUser.avatar"
            :width="'34px'"
            :height="'34px'"
          />
          <Heading size="xs">{{ userStore.getUser.username }}</Heading>
          <Avatar
            :image="chosenFriend.avatar"
            :width="'34px'"
            :height="'34px'"
          />
          <Heading size="xs">{{ chosenFriend.username }}</Heading>
        </div>
      </div>
      <div v-else class="messages__wrapper_chat_section_choose_friend">
        <Heading size="md">Choose a friend to chat</Heading>
        <img src="../assets/svg/chatting.svg" alt="chatting" />
      </div>
    </div>
  </MainLayout>
</template>

<style scoped lang="scss">
.messages__wrapper {
  display: flex;
  height: 720px;
  background-color: var(--secondary-color);
  border-radius: 20px;
  padding: 14px;

  &_friend_list {
    height: 100%;
    width: 27%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--gray);

    &_search {
      padding: 0px 4px 4px 0px;
      input {
        width: 100%;
        border: 1px solid var(--gray);
        padding: 4px;
        border-radius: 8px;
        font-family: var(--main-font-family);
        color: #dddddd;
      }
    }

    &_empty {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    &_main {
      height: 100%;
      width: 100%;
      overflow: auto;
      display: flex;
      flex-direction: column;

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
      }
      &_item {
        &:hover {
          background-color: var(--card-color);
          border: 0px 0px 0px 1px;
          border-radius: 6px;
        }
      }
    }
  }

  &_chat_section {
    width: 73%;
    display: flex;
    flex-direction: column-reverse;
    padding-left: 14px;
    justify-content: space-between;

    &_empty {
      align-self: center;
    }

    &_input {
      border: 1px solid var(--gray);
      background-color: var(--card-color);
      border-radius: 10px;

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

    &_message {
      overflow-y: auto;
      height: 100%;
      padding: 8px;
      display: flex;
      flex-direction: column;

      &::-webkit-scrollbar {
        width: 7px;
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

    &_info {
      display: flex;
      width: 100%;
      height: 40px;
      min-height: 45px;
      border-bottom: 1px solid var(--gray);
      gap: 8px;
    }

    &_choose_friend {
      width: 73%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
.typing-indicator {
  font-style: italic;
  color: gray;
  margin: 5px 0; /* Add some margin */
}
</style>
