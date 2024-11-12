<script setup>
import MainLayout from "../layouts/MainLayout.vue";
import Heading from "../components/Heading.vue";
import FriendCard from "../components/FriendCard.vue";
import { authInstance } from "../axios";
import { onMounted, ref } from "vue";
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";
import PostCard from "../components/PostCard.vue";
import PostModal from "../components/PostModal.vue";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();
const postStore = usePostStore();
const isPostModalOpen = ref(false);
const selectedPost = ref("");
const author = ref("");
const postId = ref("");
const randUsers = ref([]);
const friendsIds = ref([]);
const page = ref(1);
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const friends = userStore.getUserFriends;

  for (let i = 0; i < friends.length; i++) {
    friendsIds.value.push(friends[i].id);
  }

  await postStore.fetchFriendsPosts(friendsIds.value.toString(), page.value);

  if (route.query.post) {
    router.go(-1);
  }

  async function randomUsers() {
    try {
      const { data } = await authInstance.get("/api/random-users");
      randUsers.value = data;
    } catch (error) {
      console.log(error);
    }
  }

  randomUsers();
});

function openModal(openPostId) {
  postId.value = openPostId;
  isPostModalOpen.value = true;
  const posts = postStore.getFriendsPosts;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === openPostId) {
      selectedPost.value = posts[i];
      author.value = posts[i].publisher;
    }
  }
}
</script>

<template>
  <MainLayout>
    <div>
      <div class="home__wrapper">
        <div
          v-if="userStore.getUserFriends.length < 1"
          class="home__wrapper_no_friends"
        >
          <div class="home__wrapper_no_friends_heading">
            <Heading class="home__wrapper_no_friends_heading_main" size="md"
              >Make friends to see their posts!</Heading
            >
            <img src="../assets/svg/add-friend.svg" alt="add friends" />
          </div>
          <div
            v-if="randUsers.length >= 3"
            class="home__wrapper_no_friends_recommendations"
          >
            <Heading
              class="home__wrapper_no_friends_recommendations_heading"
              size="sm"
              >You Might Know</Heading
            >
            <div class="home__wrapper_no_friends_recommendations_items">
              <FriendCard
                v-for="user in randUsers"
                :key="user"
                :avatar="user.avatar"
                >{{ user.username }}</FriendCard
              >
            </div>
          </div>
        </div>
        <div
          v-else-if="
            userStore.getUserFriends.length > 0 &&
            postStore.getFriendsPosts.length < 1
          "
          class="home__wrapper_no_friends"
        >
          <div class="home__wrapper_no_friends_heading">
            <Heading class="home__wrapper_no_friends_heading_main" size="md"
              >Your feed is empty!</Heading
            >
          </div>
        </div>
        <div v-else class="home__wrapper_main">
          <PostCard
            v-for="post in postStore.getFriendsPosts"
            :key="post"
            :post="post"
            :author="post.publisher"
            @onPostOpen="openModal"
            class="profile__wrapper_post_section_item"
          />
        </div>
      </div>
    </div>
    <PostModal
      v-model:show="isPostModalOpen"
      :post="selectedPost"
      :author="author"
    />
  </MainLayout>
</template>

<style scoped lang="scss">
.home__wrapper {
  display: flex;
  flex-direction: column;
  background-color: var(--secondary-color);
  border-radius: 20px;
  padding: 14px;

  &_no_friends {
    height: 700px;

    &_heading {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 55%;
    }
    &_recommendations {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 45%;
      gap: 10px;

      &_heading {
        text-align: center;
      }

      &_items {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: 220px;
        gap: 20px;
      }
    }
  }

  &_main {
    align-self: center;
    width: 260px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
