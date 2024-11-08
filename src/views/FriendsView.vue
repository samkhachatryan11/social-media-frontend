<script setup>
import { ref } from "vue";
import MainLayout from "../layouts/MainLayout.vue";
import Heading from "../components/Heading.vue";
import FriendCard from "../components/FriendCard.vue";
import { onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import { authInstance, postInstance } from "../axios";
import TextInput from "../components/TextInput.vue";
import { usePostStore } from "../stores/postStore";
import { useRouter } from "vue-router";
import DropdownMenu from "../components/DropdownMenu.vue";

const userStore = useUserStore();
const searchInput = ref("");
const postStore = usePostStore();
const router = useRouter();
let page = 1;

onMounted(() => {
  userStore.fetchUserData();
});

async function searchFriends() {
  try {
    const { data } = await authInstance.get("/api/friends/my-friends", {
      params: { username: searchInput.value },
    });
    userStore.getUserFriends = data;
  } catch (error) {
    console.log(error);
  }
}

function resetList() {
  data.value = [];
  reset();
}

async function navigateToFriendProfile(friend) {
  await postStore.fetchPostData(friend.id);

  router.push({ name: "Profile", params: { id: friend.id } });
}

async function friendRequests(option) {
  if (option === "My friends") {
    userStore.fetchUserData();
  } else if (option === "Friend requests") {
    userStore.fetchFriendRequests();
  }
}
</script>

<template>
  <MainLayout>
    <div id="wrapper" class="friends__wrapper">
      <div class="friends__wrapper_menu">
        <TextInput
          class="friends__wrapper_menu_search"
          v-debounce:200ms="searchFriends"
          :debounce-events="'keydown'"
          v-model="searchInput"
          :placeholder="'Search in friends'"
        />
        <DropdownMenu
          @optionSelected="friendRequests"
          class="friends__wrapper_menu_dropdown"
        />
      </div>
      <div
        v-if="userStore.userFriends.length < 1"
        class="friends__wrapper_no_friends"
      >
        <heading class="friends__wrapper_no_friends">
          You have no friends
        </heading>
      </div>
      <div v-else class="friends__wrapper_main">
        <FriendCard
          class="friends__wrapper_main_item"
          v-for="friend in userStore.getUserFriends"
          :key="friend"
          :avatar="friend.avatar"
          @click="navigateToFriendProfile(friend)"
        >
          {{ friend.username }}
        </FriendCard>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped lang="scss">
.friends__wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 700px;
  background-color: var(--secondary-color);
  border-radius: 20px;
  overflow: hidden;

  &_menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    z-index: 1;
    gap: 8px;
  }

  &_main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 200px;
    gap: 10px;
    overflow-y: scroll;
    padding: 0px 14px 14px 14px;

    &_item {
      position: relative;
      cursor: pointer;

      &:hover {
        -webkit-filter: brightness(90%);
        -webkit-transition: all 0.3s ease;
        transition: all 0.3s ease;
      }
    }

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

  &_no_friends {
    text-align: center;
  }
}
</style>
