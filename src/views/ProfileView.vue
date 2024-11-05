<script setup>
import { computed, onMounted, ref } from "vue";
import PostModal from "../components/PostModal.vue";
import MainLayout from "../layouts/MainLayout.vue";
import { useUserStore } from "../stores/userStore";
import { usePostStore } from "../stores/postStore";
import { useIntersectionObserver } from "@vueuse/core";
import Loader from "../components/Loader.vue";
import Btn from "../components/Btn.vue";
import formatNumber from "../helpers/formatNumber";
import Heading from "../components/Heading.vue";
import PostCard from "../components/PostCard.vue";
import { authInstance } from "../axios";
import { useRoute } from "vue-router";
import Avatar from "../components/Avatar.vue";
import router from "../router";
import FriendCard from "../components/FriendCard.vue";
import { useNotificationStore } from "../stores/notificationStore";

const fileInput = ref(null);
const page = ref(1);
const target = ref(null);
const targetIsVisible = ref(false);
const authURL = import.meta.env.VITE_APP_AUTH_SERVICE_URL;
const userStore = useUserStore();
const postStore = usePostStore();
const isDisabled = ref(true);
const url = ref("");
const avatar = ref(null);
const status = ref("finished");
const formData = new FormData();
const isMenuOpen = ref(false);
const isPostModalOpen = ref(false);
const postId = ref("");
const selectedPost = ref("");
const author = ref("");
const route = useRoute();
const currentUser = ref({});
const notificationStore = useNotificationStore();
const senders = ref([]);

onMounted(async () => {
  userStore.fetchUserData();
  postStore.fetchPostData();
  notificationStore.fetchNotifications(userStore.getUser.id);

  if (route.params.id) {
    const user = await postStore.fetchPostData(route.params.id, page.value);
    currentUser.value = user;
    if (route.query.post) {
      router.go(-1);
    }
  } else if (route.params.id === userStore.getUser.id) {
    postStore.fetchPostData(userStore.getUser.id, page.value);
    if (route.query.post) {
      router.go(-1);
    }
  }

  const { stop } = useIntersectionObserver(
    target,
    async ([{ isIntersecting }]) => {
      targetIsVisible.value = isIntersecting;

      if (isIntersecting) {
        page.value++;
        await postStore.loadMorePosts(userStore.getUser.id, page.value);
      }
    }
  );

  async function requestSenders() {
    const notifications = notificationStore.getNotifications;
    for (let i = 0; i < notifications.length; i++) {
      let notificationSender = notifications[i].sender.userId;
      senders.value.push(notificationSender);
    }
  }

  requestSenders();
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  avatar.value = file;

  isDisabled.value = false;
  isMenuOpen.value = false;
  url.value = URL.createObjectURL(avatar.value);
};

const triggerFileUpload = () => {
  fileInput.value.click();
};

async function updateAvatar() {
  status.value = "loading";
  try {
    formData.append("avatar", avatar.value);
    const { data } = await authInstance.post(
      "/api/profile/change-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    status.value = "finished";
    isDisabled.value = true;

    userStore.user.avatar = data.avatar;
  } catch (error) {
    status.value = "finished";
    console.log(error);
  }
}

function openMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

async function removeAvatar() {
  try {
    await authInstance.delete("/api/profile/remove-avatar");
    isMenuOpen.value = false;
  } catch (error) {
    isMenuOpen.value = false;
    console.log(error);
  }
}

const menuItems = [
  { name: "Update", icon: "../assets/svg/pen.svg", action: triggerFileUpload },
  {
    name: "Delete",
    icon: "../assets/svg/delete-2.svg",
    action: removeAvatar,
  },
];

function openModal(openPostId) {
  postId.value = openPostId;
  isPostModalOpen.value = true;
  const posts = postStore.getPosts;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === openPostId) {
      selectedPost.value = posts[i];
      author.value = posts[i].publisher;
    }
  }
}

async function sendFriendRequest() {
  await userStore.sendFriendRequest(route.params.id);
}

async function acceptFriendRequest() {
  await userStore.acceptFriendRequest(route.params.id);
}

const getImageUrl = (iconPath) => new URL(iconPath, import.meta.url).href;
</script>

<template>
  <MainLayout>
    <div class="profile__wrapper">
      <div class="profile__wrapper_main">
        <div class="profile__wrapper_main_picture">
          <div
            v-if="route.params.id == userStore.getUser.id"
            class="profile__wrapper_main_picture_options"
            ><img src="../assets/svg/dots.svg" alt="menu" @click="openMenu"
          /></div>
          <div
            v-if="isMenuOpen"
            class="profile__wrapper_main_picture_options_menu"
          >
            <ul>
              <li v-for="item in menuItems" :key="item" @click="item.action()">
                <img :src="getImageUrl(item.icon)" /> {{ item.name }}
              </li>
            </ul>
            <input
              type="file"
              ref="fileInput"
              accept="image/jpeg, image/png"
              multiple
              @change="handleFileUpload"
            />
          </div>
          <Avatar
            :image="postStore.getAuthor.avatar"
            :width="'100px'"
            :height="'100px'"
            :src="getImageUrl(avatar)"
          />
        </div>
        <div class="profile__wrapper_main_info">
          <Heading size="sm">{{ postStore.getAuthor.username }}</Heading>
          <div class="profile__wrapper_main_info_stats">
            <div class="profile__wrapper_main_info_stats_item"
              ><span class="profile__wrapper_main_info_stats_item_name"
                >Friends</span
              ><span class="profile__wrapper_main_info_stats_item_number">{{
                formatNumber(userStore.userFriends.length)
              }}</span></div
            >
            <div class="profile__wrapper_main_info_stats_item"
              ><span class="profile__wrapper_main_info_stats_item_name"
                >Posts</span
              ><span class="profile__wrapper_main_info_stats_item_number">{{
                formatNumber(postStore.getPostsQuantity)
              }}</span></div
            >
            <div class="profile__wrapper_main_info_stats_item"
              ><span class="profile__wrapper_main_info_stats_item_name"
                >Likes</span
              ><span class="profile__wrapper_main_info_stats_item_number">{{
                formatNumber(postStore.getLikesQuantity)
              }}</span></div
            >
          </div>
        </div>
      </div>
      <div class="profile__wrapper_save">
        <Btn
          @click="sendFriendRequest"
          v-if="
            !userStore.getUserFriends.some(
              (friend) => friend.id == route.params.id
            ) && status === 'finished'
          "
          class="profile__wrapper_save_btn"
          size="sm"
          color="green"
          >Follow</Btn
        >
        <Btn
          v-if="
            !userStore.getUserFriends.some(
              (friend) => friend.id == route.params.id
            ) &&
            senders.includes(route.params.id) &&
            status === 'finished'
          "
          @click="acceptFriendRequest"
          class="profile__wrapper_save_btn"
          size="sm"
          color="green"
          >Accept</Btn
        >
        <Btn
          v-else-if="
            userStore.getUserFriends.some(
              (friend) => friend.id == route.params.id
            ) && status === 'finished'
          "
          class="profile__wrapper_save_btn"
          size="sm"
          color="disabled"
          >Friends</Btn
        >

        <Btn
          @click="updateAvatar"
          v-else-if="
            !isDisabled &&
            status === 'finished' &&
            userStore.getUser.id == route.params.id
          "
          class="profile__wrapper_save_btn"
          size="sm"
          color="green"
          >Save</Btn
        >
        <Btn
          v-else-if="
            isDisabled &&
            status === 'finished' &&
            userStore.getUser.id == route.params.id
          "
          class="profile__wrapper_save_btn"
          size="sm"
          color="disabled"
          >Save</Btn
        >
        <Loader
          class="profile__wrapper_save_loader"
          color="#5e8989"
          width="18px"
          height="18px"
          v-else-if="status === 'loading'"
        />
      </div>
      <div
        v-if="postStore.getPostsQuantity > 0"
        class="profile__wrapper_post_section"
        ><PostCard
          v-for="post in postStore.posts"
          :key="post.id"
          :post="post"
          :author="postStore.getAuthor"
          @onPostOpen="openModal"
          class="profile__wrapper_post_section_item"
        />
      </div>
      <div class="loader" ref="target"
        ><Loader
          v-if="postStore.getStatus === 'loading'"
          color="#5e8989"
          width="40px"
          height="40px"
      /></div>
      <div
        v-if="postStore.getPostsQuantity === 0"
        class="profile__wrapper_post_section_empty"
      >
        <Heading size="md">No posts were found</Heading>
      </div>
    </div>
  </MainLayout>
  <PostModal
    v-model:show="isPostModalOpen"
    :post="selectedPost"
    :author="author"
  />
</template>

<style scoped lang="scss">
.profile__wrapper {
  background-color: var(--secondary-color);
  border: none;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  gap: 20px;
  min-height: 600px;

  &_save {
    display: flex;
    justify-content: end;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--gray);

    &_loader {
      height: 45px;
      margin-right: 28px;
    }
  }

  &_main {
    margin-top: 20px;
    height: 84%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;

    &_picture {
      &_options {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        background-color: var(--card-color);
        opacity: 0.9;
        border-radius: 50%;
        position: absolute;
        top: 18.5%;
        left: 46%;
        cursor: pointer;

        &:hover {
          -webkit-filter: brightness(75%);
        }

        &_menu {
          position: absolute;
          margin-right: 35px;
          left: 41.4%;
          padding: 4px;
          background-color: var(--card-color);
          border-radius: 10px;

          ul {
            display: flex;
            flex-direction: column;
            gap: 4px;
            list-style-type: none;

            li {
              display: flex;
              align-items: center;
              font-family: var(--main-font-family);
              color: var(--main-color);
              font-size: 13px;
              padding: 2px;
              font-weight: 600;
              border-radius: 6px;
              gap: 4px;
              cursor: pointer;

              &:hover {
                background-color: var(--secondary-color);
              }
            }
          }

          &_update {
          }
          input {
            display: none;
          }
        }
      }

      &_no_img {
        width: 82px;
      }

      &_img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &_info {
      display: flex;
      flex-direction: column;
      max-width: 186px;
      overflow: hidden;

      &_stats {
        font-family: var(--main-font-family);
        display: flex;
        gap: 16px;
        border: 1px solid var(--gray);
        border-radius: 20px;
        padding: 10px;

        &_item {
          color: var(--main-color);
          display: flex;
          flex-direction: column;
          align-items: center;

          &_name {
            font-size: 16px;
          }

          &_number {
            font-size: 18px;
            font-weight: 700;
          }
        }
      }
    }
  }
  &_post_section {
    min-height: 0;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: auto;
    grid-gap: 8px;
    overflow-y: auto;
    overflow-x: hidden;

    &_empty {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &_item {
      overflow: hidden;
      min-width: 0;
    }
  }

  &_post_section_text {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-auto-rows: auto;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
