<script setup>
import { ref } from "vue";
import Avatar from "./Avatar.vue";
import Heading from "./Heading.vue";

defineProps({
  avatar: {
    type: String,
  },
  width: {
    type: String,
  },
});

const authURL = import.meta.env.VITE_APP_AUTH_SERVICE_URL;
const isMenuOpen = ref(false);

function openMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

const menuItems = [
  { name: "Profile", class: "card__wrapper_menu_main_list_item" },
  { name: "Send Message", class: "card__wrapper_menu_main_list_item" },
  { name: "Block", class: "card__wrapper_menu_main_list_item" },
  {
    name: "Delete",
    class:
      "card__wrapper_menu_main_list_item card__wrapper_menu_main_list_item_delete",
  },
];
</script>

<template>
  <div class="card__wrapper">
    <div class="card__wrapper_menu">
      <img src="../assets/svg/dots.svg" @click="openMenu" alt="menu" />
      <div v-if="isMenuOpen" class="card__wrapper_menu_main">
        <ul
          v-for="index in menuItems"
          :key="index"
          class="card__wrapper_menu_main_list"
          ><li :class="index.class">{{ index.name }}</li></ul
        >
      </div>
    </div>
    <div class="card__wrapper_main">
      <Avatar :image="avatar" :width="'100px'" :height="'100px'" />
      <div class="card__wrapper_main_info"
        ><Heading size="sm"><slot /></Heading
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card__wrapper {
  display: flex;
  flex-direction: column;
  background-color: var(--card-color);
  padding: 10px;
  border: none;
  border-radius: 10px;
  gap: 12px;

  &_menu {
    display: flex;
    justify-content: end;

    &_main {
      position: absolute;
      background-color: var(--secondary-color);
      padding: 8px;
      border-radius: 8px;
      margin-right: 22px;

      &_list {
        font-family: var(--main-font-family);
        font-size: 13px;
        display: flex;
        flex-direction: column;
        list-style-type: none;
        padding: 4px;

        &_item {
          cursor: pointer;
          color: var(--main-color);
          font-weight: 600;

          &_delete {
            color: var(--red);
          }
        }

        &:hover {
          background-color: var(--main-bg-color);
          border: none;
          border-radius: 4px;
        }
      }
    }

    img {
      cursor: pointer;
    }
  }

  &_main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;

    &_avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--secondary-color);
      border-radius: 50%;
      height: 70px;
      width: 70px;
      overflow: hidden;

      &_has_avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &_no_avatar {
        width: 55px;
        height: 55px;
      }
    }

    &_info {
      font-family: var(--main-font-family);

      h4 {
        color: var(--main-color);
        font-size: 20px;
      }
    }
  }
}
</style>
