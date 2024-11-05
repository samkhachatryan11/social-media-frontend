<script setup>
import { ref } from "vue";
import Btn from "./Btn.vue";
import { postInstance } from "../axios";
import Loader from "./Loader.vue";

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:show"]);

const fileInput = ref(null);
const postContent = ref("");
const images = ref([]);
const originalImages = ref([]);
const isDisabled = ref(false);
const formData = new FormData();
const status = ref("finished");

async function closeModal() {
  emit("update:show", false);
}

const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (images.value.length < 6) {
    images.value.push(URL.createObjectURL(file));
    originalImages.value.push(file);
  }

  if (images.value.length >= 6) {
    isDisabled.value = true;
  }
};

async function postImages() {
  const imagesToUpload = originalImages.value;
  status.value = "loading";
  try {
    if (imagesToUpload.length > 0) {
      for (let i = 0; i < imagesToUpload.length; i++) {
        formData.append("images", imagesToUpload[i]);
      }
      await postInstance.post("/api/posts/upload", formData, {
        headers: {
          "Content-Type": "multipart/from-data",
        },
      });
    } else {
      await postInstance.post("/api/posts/upload", {
        text: postContent.value,
      });
    }
    status.value = "finished";
    closeModal();
  } catch (error) {
    status.value = "finished";
    console.log(error);
  }
}

async function removeImage(image) {
  return (images.value = images.value.filter((item) => item !== image));
}
</script>

<template>
  <div v-if="show" class="modal_overlay">
    <div class="post__modal">
      <div class="post__modal_header">
        <h4>Create new post</h4>
        <img @click="closeModal" src="../assets/svg/close.svg" alt="close" />
      </div>
      <div class="post__modal_text">
        <textarea
          v-model="postContent"
          maxlength="230"
          placeholder="Type Something..."
          name="content"
          id="content"
        ></textarea>
        <span>{{ postContent.length }}/230</span>
      </div>
      <div v-if="images.length > 0" class="post__modal_uploaded_images">
        <div
          v-for="image in images"
          :key="image"
          class="post__modal_uploaded_images_item"
        >
          <img
            class="post__modal_uploaded_images_item_img"
            :src="image"
            alt="image"
          />
          <div class="post__modal_uploaded_images_item_delete">
            <img
              src="../assets/svg/delete.svg"
              alt="delete"
              @click="removeImage(image)"
          /></div>
        </div>
      </div>
      <div class="post__modal_file_uploader">
        <div class="post__modal_file_uploader_main">
          <img
            :class="{ disable_input: isDisabled }"
            src="../assets/svg/upload.svg"
            alt="Upload Icon"
            class="upload-icon"
            @click="triggerFileUpload"
          />
          <span :class="{ disable_input: isDisabled }">Upload Image</span>
          <input
            :disabled="images.length === 6"
            type="file"
            ref="fileInput"
            accept="image/jpeg, image/png"
            multiple
            @change="handleFileUpload"
          />
        </div>
        <Btn
          v-if="status === 'finished'"
          @click.prevent="postImages"
          class="post__modal_file_uploader_btn"
          size="sm"
          color="green"
          >Publish</Btn
        >
        <Loader
          class="post__modal_file_uploader_loader"
          v-else-if="status === 'loading'"
          color="#5e8989"
          width="18px"
          height="18px"
        />
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

.post__modal {
  font-family: var(--main-font-family);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  padding: 10px 10px;
  border-radius: 20px;
  background-color: var(--secondary-color);
  display: flex;
  flex-direction: column;

  &_uploaded_images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: auto;
    gap: 5px;
    margin-bottom: 5px;

    &_item {
      display: flex;
      flex-direction: column;
      max-width: 120px;

      &_img {
        width: 100%;
        max-width: 100%;
        height: 160px;
        object-fit: cover;
      }

      &_delete {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28px;
        height: 28px;
        position: absolute;
        padding: 3px;
        margin: 3px 3px 0px 0px;
        align-self: flex-end;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:hover {
          background-color: var(--gray);
          border-radius: 40%;
        }
      }
    }
  }

  &_file_uploader {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &_main {
      display: flex;
      align-items: center;
      gap: 10px;

      span {
        color: var(--main-color);
        font-family: var(--main-font-family);
        font-weight: 600;
        font-size: 16px;
        margin-right: 120px;
      }

      input {
        display: none;
      }

      img {
        cursor: pointer;
      }
    }

    &_btn {
      align-self: flex-end;
    }

    &_loader {
      height: 44px;
      margin-right: 28px;
    }
  }

  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
      font-size: 20px;
      color: var(--main-color);
    }

    img {
      cursor: pointer;
    }
  }

  &_text {
    margin-top: 20px;
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
    background-color: var(--main-bg-color);
    border-radius: 10px;
    padding: 7px 0px 7px 7px;

    span {
      margin-top: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #dddddd;
      align-self: flex-end;
      margin-right: 10px;
    }

    textarea {
      font-family: var(--secondary-font-family);
      color: #fff;
      border: none;
      resize: none;
      min-width: 350px;
      height: 132px;

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
  }

  textarea:focus,
  input:focus {
    outline: none;
  }
}

.disable_input {
  cursor: default;
  opacity: 0.5;
}
</style>
