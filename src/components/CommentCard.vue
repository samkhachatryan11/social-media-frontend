<script setup>
import Avatar from "./Avatar.vue";
import Heading from "./Heading.vue";

const props = defineProps({
  comment: {
    type: Object,
  },
});
</script>
<template>
  <div class="comment__wrapper">
    <div class="comment__wrapper_avatar">
      <Avatar
        :image="props.comment.commenter.avatar"
        :width="'56px'"
        :height="'56px'"
      />
    </div>
    <div class="comment__wrapper_main">
      <p
        ><Heading class="comment__wrapper_main_username" size="xs">{{
          props.comment.commenter.username
        }}</Heading
        >{{ props.comment.comment_text }}</p
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment__wrapper {
  display: flex;
  gap: 8px;
  padding: 10px;

  &_main {
    background-color: var(--card-color);
    padding: 0px 8px 8px;
    border-radius: 14px;

    ::v-deep(.heading__xs) {
      display: inline;
      margin-right: 4px;
    }

    p {
      font-size: 14px;
      color: #dddddd;
      font-family: var(--secondary-font-family);
    }
  }
}
</style>
