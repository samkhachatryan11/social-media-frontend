<script setup>
import { ref } from "vue";
import Avatar from "./Avatar.vue";
import Heading from "./Heading.vue";
import CommentCard from "./CommentCard.vue";
import router from "../router";
import TextArea from "./TextArea.vue";
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";

const hasComments = ref(true);
const commentContent = ref("");
const postStore = usePostStore();
const userStore = useUserStore();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  author: {
    type: Object,
  },
  post: {
    type: Object,
  },
});

const emit = defineEmits(["update:show"]);

async function closeModal() {
  emit("update:show", false);
  router.go(-1);
}

const sendComment = async () => {
  const postId = props.post.id;
  const content = commentContent.value;
  await postStore.sendComment(postId, content, userStore.getUser);
  commentContent.value = "";
};

const postURL = import.meta.env.VITE_APP_POST_SERVICE_URL;
</script>

<template>
  <div v-if="show" class="modal_overlay">
    <div class="post__wrapper">
      <div @click="closeModal" class="post__wrapper_close"
        ><img src="../assets/svg/delete.svg" alt="close"
      /></div>
      <div class="post__wrapper_content">
        <div class="post__wrapper_content_image" v-if="post.image">
          <img :src="`${postURL}/uploads/${post.image}`" alt="" />
        </div>
        <div class="post__wrapper_content_text" v-else
          ><p>{{ post.text }}</p></div
        >
      </div>
      <div class="post__wrapper_info">
        <div class="post__wrapper_info_description">
          <div class="post__wrapper_info_description_author">
            <Avatar :image="props.author.avatar" />
            <Heading size="sm">{{ props.author.username }}</Heading>
          </div>
          <div v-if="!post.image" class="post__wrapper_info_description_main">
            <p>{{ post.text }}</p>
          </div>
        </div>
        <div class="post__wrapper_info_comments">
          <div class="post__wrapper_info_comments_title">
            <Heading size="sm"
              >Comments <span>({{ post.comments.length }})</span></Heading
            >
          </div>
          <div class="post__wrapper_info_comments_section">
            <div
              v-if="post.comments.length < 1"
              class="post__wrapper_info_comments_section_empty"
            >
              <Heading>No Comments</Heading>
            </div>
            <div v-else class="post__wrapper_info_comments_section_main">
              <CommentCard
                v-for="comment in post.comments"
                :key="comment"
                :comment="comment"
              />
            </div>
            <TextArea
              class="post__wrapper_info_comments_section_textarea"
              :maxLength="230"
              v-model="commentContent"
              :placeholder="'Type Something...'"
              name="content"
              id="content"
              :send="sendComment"
              @input="notifyTyping"
            ></TextArea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1;
}

.post__wrapper {
  font-family: var(--main-font-family);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  height: 100%;
  max-height: 900px;
  width: 100%;
  max-width: 1050px;
  background-color: var(--card-color);
  border-radius: 30px;

  &_close {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    padding: 4px;
    cursor: pointer;
    right: -40%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      background-color: var(--card-color);
      border-radius: 14px;
    }
  }

  &_content {
    display: flex;
    width: 50%;
    height: 100%;

    &_image {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 20px 0px 0px 20px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &_text {
      font-family: var(--secondary-font-family);
      padding: 14px;

      p {
        font-size: 24px;
        color: #ffffff;
      }
    }
  }

  &_info {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 14px;

    &_description {
      padding: 10px;
      background-color: var(--secondary-color);
      border-radius: 16px;
      margin-bottom: 15px;

      &_author {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
      }

      &_main {
        font-family: var(--secondary-font-family);
        color: var(--main-color);
      }
    }

    &_comments {
      padding: 10px;
      border-radius: 16px;
      height: 100%;
      background-color: var(--secondary-color);

      &_section {
        height: 93%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100dvh - 250px);

        &_empty {
          max-height: 100%;
          min-height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &_main {
          overflow: auto;

          &::-webkit-scrollbar {
            width: 8px;
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
      }

      &_title {
        height: 7%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--gray);

        span {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
