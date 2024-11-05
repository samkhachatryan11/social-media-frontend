<script setup>
import { useRoute } from "vue-router";
import Btn from "./Btn.vue";
import UploadPostModal from "./UploadPostModal.vue";
import { ref } from "vue";

const isOpen = ref(false);
const route = useRoute();

const sidebarItems = [
  { label: "Home", icon: "../assets/svg/home.svg", to: "Home" },
  {
    label: "Notifications",
    icon: "../assets/svg/notifications.svg",
    to: "Notifications",
  },
  { label: "Messages", icon: "../assets/svg/messages.svg", to: "Messages" },
  {
    label: "Friends",
    icon: "../assets/svg/friends.svg",
    to: "Friends",
  },
];

const getImageUrl = (iconPath) => new URL(iconPath, import.meta.url).href;

async function openPostUploadModal() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div class="sidebar">
    <ul class="sidebar__list">
      <router-link
        :to="{ name: item.to }"
        v-for="(item, index) in sidebarItems"
        :key="index"
        :class="{ clicked: route.name === item.to }"
        class="sidebar__list_items"
      >
        <img :src="getImageUrl(item.icon)" />{{ item.label }}
      </router-link>
    </ul>
    <div @click="openPostUploadModal">
      <Btn size="md" color="green" class="Btn"
        ><img src="../assets/svg/plus.svg" alt="add"
      /></Btn>
    </div>
  </div>
  <UploadPostModal v-model:show="isOpen" />
</template>

<style scoped lang="scss">
.sidebar {
  position: fixed;
  border-radius: 20px;

  &__list {
    display: inline;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    list-style-type: none;
    padding: 10px 10px;
    background-color: var(--secondary-color);
    border-radius: 20px;

    &_items {
      font-family: var(--main-font-family);
      color: var(--main-color);
      font-weight: 600;
      font-size: 24px;
      border: none;
      cursor: pointer;
      transition: 0.2s;
      padding: 10px 10px;
      border-radius: 10px;
      text-decoration: none;
      &:hover {
        background-color: var(--main-bg-color);

        &:active {
          background-color: var(--main-bg-color);
        }
      }

      img {
        margin-right: 14px;
      }
    }
  }

  .Btn {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .publishPostModal {
    font-family: var(--main-font-family);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 50px 50px;
  }
}

.clicked {
  background-color: var(--main-bg-color);
}
</style>
