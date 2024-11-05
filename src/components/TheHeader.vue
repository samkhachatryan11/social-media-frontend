<script setup>
import { RouterLink, useRoute, useRouter } from "vue-router";
import Btn from "./Btn.vue";
import Heading from "./Heading.vue";
import axios from "axios";
import TextInput from "./TextInput.vue";
import SearchProfileCard from "./SearchProfileCard.vue";
import { authInstance } from "../axios";
import { onMounted, ref, watch } from "vue";
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";

const postStore = usePostStore();
const userStore = useUserStore();
const router = useRouter();
const users = ref([]);
const searchInput = ref("");
const route = useRoute();
const userId = ref("");

onMounted(async () => {
  userId.value = await userStore.getUser.id;
});

const AUTH_SERVICE_URL = import.meta.env.VITE_APP_AUTH_SERVICE_URL;

async function logout() {
  try {
    await authInstance.post("/api/logout");
    router.push("/");
  } catch (error) {
    console.log(error);
  }
}

async function searchUsers() {
  try {
    const { data } = await authInstance.get("/api/search-users", {
      params: { username: searchInput.value },
    });
    users.value = data;
  } catch (error) {
    console.log(error);
  }
}

async function navigateToUserProfile(userId) {
  await postStore.fetchPostData(userId);

  router.push({ name: "Profile", params: { id: userId } });

  users.value = [];
  searchInput.value = "";

  watch(
    () => route.params.id,
    () => {
      postStore.fetchPostData(userId, 1);
    }
  );
}
</script>

<template>
  <header class="header__wrapper">
    <Heading size="md">MyFreinds</Heading>
    <div class="header__wrapper_search">
      <TextInput
        v-debounce:200ms="searchUsers"
        :debounce-events="'keydown'"
        v-model="searchInput"
        :placeholder="'Search profiles'"
        :width="'350px'"
        :height="'50px'"
        :search="true"
      />
      <div v-if="users.length > 0" class="header__wrapper_search_main">
        <SearchProfileCard
          v-for="user in users"
          :key="user"
          :avatar="user.avatar"
          :username="user.username"
          @click="navigateToUserProfile(user.id)"
        />
      </div>
    </div>
    <div class="header__wrapper_menu">
      <Btn
        @click="navigateToUserProfile(userStore.getUser.id)"
        size="md"
        color="green"
        >Profile</Btn
      >
      <Btn @click="logout()" size="md" color="green">Logout</Btn>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0px;

  &_search {
    overflow: hidden;
    &_main {
      position: absolute;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      background-color: var(--secondary-color);
      border: 1px solid var(--gray);
      border-radius: 14px;
      padding: 10px;
      width: 380px;
      height: 320px;
      gap: 6px;
      overflow-y: auto;
      z-index: 1;

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
      }
    }
  }

  &_menu {
    display: flex;
    gap: 7px;
  }
}
</style>
