<script setup>
import { ref, onMounted } from "vue";
import MainLayout from "../layouts/MainLayout.vue";
import NotificationCard from "../components/NotificationCard.vue";
import { notificationSocket } from "../services/socket";
import { useUserStore } from "../stores/userStore";
import { useNotificationStore } from "../stores/notificationStore";
import { usePostStore } from "../stores/postStore";
import { useRouter } from "vue-router";
import Heading from "../components/Heading.vue";

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const postStore = usePostStore();
const router = useRouter();

const userId = ref(null);

const initializeSocket = () => {
  notificationSocket.on("connect", () => {
    console.log("Connected to notification socket");
    if (userId.value) {
      notificationSocket.emit("join", userId.value);
    } else {
      console.warn("User ID is not set");
    }
  });

  notificationSocket.on("notification", (notification) => {
    console.log("New notification received:", notification);
    notificationStore.addNotification(notification);
  });

  notificationSocket.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });
};

onMounted(() => {
  userId.value = userStore.getUser.id;
  notificationStore.fetchNotifications(userStore.getUser.id);
  initializeSocket();
});

async function navigateToFriendProfile(userId) {
  await postStore.fetchPostData(userId);

  router.push({ name: "Profile", params: { id: userId } });
}
</script>

<template>
  <MainLayout>
    <div class="notifications__wrapper">
      <div class="notifications__wrapper_title">
        <Heading size="sm">Notifications</Heading>
      </div>
      <div
        v-if="notificationStore.getNotifications.length < 1"
        class="notifications__wrapper_empty"
      >
        <Heading>You have no notifications!</Heading>
      </div>
      <div v-else class="notifications__wrapper_main">
        <NotificationCard
          v-for="notification in notificationStore.getNotifications"
          :key="notification._id"
          :content="notification.content"
          :user="notification.sender"
          :type="notification.type"
          :createdAt="notification.createdAt"
          @click="navigateToFriendProfile(notification.sender.userId)"
        />
      </div>
    </div>
  </MainLayout>
</template>

<style scoped lang="scss">
.notifications__wrapper {
  background-color: var(--secondary-color);
  width: 100%;
  height: 700px;
  border-radius: 20px;

  &_title {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--gray);
    height: 9%;
  }

  &_main {
    height: 91%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 6px;
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

  &_empty {
    height: 91%;
    display: flex;
    justify-content: center;
    margin-top: 100px;
  }
}
</style>
