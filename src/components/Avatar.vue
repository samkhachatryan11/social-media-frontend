<script setup>
const props = defineProps({
  image: {
    type: [String, null],
  },
  width: {
    type: String,
    default: "70px",
  },
  height: {
    type: String,
    default: "70px",
  },
});

const authURL = import.meta.env.VITE_APP_AUTH_SERVICE_URL;
</script>

<template>
  <div class="avatar__wrapper">
    <img
      v-if="image"
      class="avatar__wrapper_image"
      :src="
        image.startsWith('blob')
          ? image
          : image.startsWith('https')
          ? image
          : `${authURL}/${image}`
      "
      alt="image"
    />
    <img
      v-else
      class="avatar__wrapper_no_image"
      src="../assets/svg/user.svg"
      alt="image"
    />
  </div>
</template>

<style scoped lang="scss">
.avatar__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--gray);
  border-radius: 50%;
  overflow: hidden;
  width: v-bind(width);
  height: v-bind(height);

  &_image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &_no_image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
