<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "../stores/postStore";
import Avatar from "./Avatar.vue";
import formatNumber from "../helpers/formatNumber";
import router from "../router";
import { useUserStore } from "../stores/userStore";

const emit = defineEmits(["onPostOpen"]);
const postStore = usePostStore();
const userStore = useUserStore();
const route = useRoute();

const props = defineProps({
  text: {
    type: String,
  },
  like_count: {
    type: [String, Number],
  },
  post: {
    type: Object,
  },
  author: {
    type: Object,
  },
  likeIcon: {
    type: String,
  },
});

const postURL = import.meta.env.VITE_APP_POST_SERVICE_URL;

function putLike() {
  const likes = props.post.likes;

  for (let i = 0; i < likes.length; i++) {
    if (likes[i].liker_id === userStore.getUser.id) {
      return "/src/assets/svg/heart-active.svg";
    }
  }
  return "/src/assets/svg/heart.svg";
}

async function likePost() {
  try {
    await postStore.toggleLike(props.post.id, userStore.getUser.id); // Use toggleLike method
  } catch (error) {
    console.error("Error liking post:", error);
  }
}

async function openPost() {
  emit("onPostOpen", props.post.id);
  if (route.name === "Profile") {
    router.push({
      name: "Profile",
      query: {
        post: props.post.id,
      },
    });
  } else if (route.name === "Home") {
    router.push({
      name: "Home",
      query: {
        post: props.post.id,
      },
    });
  }
}
</script>

<template>
  <div class="post__card_wrapper">
    <div class="post__card_wrapper_info">
      <div class="post__card_wrapper_info_main">
        <Avatar :image="props.author.avatar" :width="'36px'" :height="'36px'" />
        <p>{{ props.author.username }}</p>
      </div>
    </div>
    <div @click="openPost" class="post__card_wrapper_content">
      <div v-if="props.post.image" class="post__card_wrapper_content_image">
        <img :src="`${postURL}/uploads/resized/${props.post.image}`" />
      </div>
      <div v-else class="post__card_wrapper_content_text">
        <p>{{ props.post.text }}</p>
      </div>
    </div>
    <div class="post__card_wrapper_description">
      <div class="post__card_wrapper_description_menu">
        <img @click="likePost(props.post.id)" :src="putLike()" alt="like" />
        <span v-if="props.post.like_count > 0">{{
          formatNumber(props.post.like_count)
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post__card_wrapper {
  display: flex;
  flex-direction: column;
  background-color: var(--card-color);
  border-radius: 16px;

  &_info {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;

    &_main {
      display: flex;
      align-items: center;
      gap: 8px;

      p {
        font-family: var(--main-font-family);
        color: var(--main-color);
        font-weight: 600;
      }
    }
  }
  &_content {
    display: flex;
    height: 250px;

    &_image {
      justify-content: center;
      width: 100%;
      overflow: hidden;

      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        cursor: pointer;

        &:hover {
          -webkit-filter: brightness(75%);
          -webkit-transition: all 0.6s ease;
          transition: all 0.6s ease;
        }
      }
    }

    &_text {
      width: 100%;
      height: 250px;
      margin-bottom: 20px;
      padding: 0px 8px;
      cursor: pointer;

      p {
        font-family: var(--secondary-font-family);
        color: #dddddd;
        font-size: 16px;
        overflow: hidden;
      }

      &:hover {
        -webkit-filter: brightness(75%);
        -webkit-transition: all 0.6s ease;
        transition: all 0.6s ease;
      }
    }
  }

  &_description {
    display: flex;
    flex-direction: column;
    padding: 10px;

    &_menu {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 3px;

      img {
        cursor: pointer;
      }

      span {
        font-size: 15px;
        font-weight: 600;
        font-family: var(--main-font-family);
        color: var(--main-color);
      }
    }
  }
}
</style>
