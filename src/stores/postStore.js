import { defineStore } from "pinia";
import { postInstance } from "../axios";

export const usePostStore = defineStore("posts", {
  state: () => ({
    postAuthor: {},
    posts: [],
    friendsPosts: [],
    likes: null,
    likedPosts: [], // <-- Add this to store liked post IDs
    status: "idle",
    error: null,
  }),

  actions: {
    async fetchPostData(userId, page) {
      this.status = "loading";
      try {
        const { data } = await postInstance.get("/api/posts", {
          params: { userId: userId, page: page },
        });
        this.status = "succeeded";

        this.posts = data.posts;
        this.postAuthor = data.user;
        this.likes = data.like_count || 0;
      } catch (error) {
        this.error = error;
        this.status = "failed";
      }
    },
    async toggleLike(postId, likerId) {
      const post = this.posts.find(({ id }) => id == postId);
      const friendPost = this.friendsPosts.find(({ id }) => id == postId);

      if (post) {
        const postLikeIndex = post.likes.findIndex(
          ({ liker_id }) => liker_id === likerId
        );
        if (postLikeIndex === -1) {
          post.likes.push({
            author_id: post.publisher_id,
            liker_id: likerId,
            postId,
          });
        } else {
          post.likes = post.likes.filter(
            ({ liker_id }) => liker_id !== likerId
          );
        }
      } else {
        const friendPostLikeIndex = friendPost.likes.findIndex(
          ({ liker_id }) => liker_id === likerId
        );
        if (friendPostLikeIndex === -1) {
          friendPost.likes.push({
            author_id: friendPost.publisher_id,
            liker_id: likerId,
            postId,
          });
        } else {
          friendPost.likes = friendPost.likes.filter(
            ({ liker_id }) => liker_id !== likerId
          );
        }
      }

      try {
        const response = await postInstance.post(`/api/post/like/${postId}`);

        this.likedPosts.push(postId);
      } catch (error) {
        console.error("Error toggling like:", error);
        if (isLiked) {
          this.likedPosts.push(postId);
        } else {
          this.likedPosts = this.likedPosts.filter((id) => id !== postId);
        }
      }
    },
    async sendComment(postId, commentText, commenter) {
      const post = this.posts.find(({ id }) => id == postId);
      const friendPost = this.friendsPosts.find(({ id }) => id == postId);

      if (post) {
        post.comments.push({
          author_id: post.publisher_id,
          comment_text: commentText,
          commenter: {
            avatar: commenter.avatar,
            email: commenter.email,
            id: commenter.id,
            username: commenter.username,
          },
          commenter_id: commenter.id,
          postId,
        });
      } else if (friendPost) {
        friendPost.comments.push({
          author_id: friendPost.publisher_id,
          comment_text: commentText,
          commenter: {
            avatar: commenter.avatar,
            email: commenter.email,
            id: commenter.id,
            username: commenter.username,
          },
          commenter_id: commenter.id,
          postId,
        });
      } else {
        console.error(
          `Post with id ${postId} not found in either posts or friends' posts.`
        );
      }

      this.status = "loading";
      try {
        await postInstance.post(`/api/post/comment/${postId}`, {
          commentText: commentText,
        });

        await this.fetchPostData(postId);
      } catch (error) {
        console.error("Error sending comment:", error);
        this.error = error;
        this.status = "failed"; // Update status on failure
      } finally {
        this.status = "idle"; // Reset status regardless of outcome
      }
    },
    async loadMorePosts(userId, page) {
      this.status = "loading";
      try {
        const { data } = await postInstance.get("/api/posts", {
          params: { userId: userId, page: page },
        });
        this.posts.push(...data.posts);
        this.status = "succeeded";
      } catch (error) {
        this.error = error;
        this.status = "failed";
      }
    },

    async fetchFriendsPosts(friendsIds, page) {
      this.status = "loading";
      try {
        const { data } = await postInstance.get("/api/friends-posts", {
          params: { friendsIds: friendsIds, page: page },
        });
        this.status = "succeeded";
        this.friendsPosts = data;
      } catch (error) {
        this.error = error;
        this.status = "failed";
      }
    },

    async loadMoreFriendsPosts(friendsIds, page) {
      this.status = "loading";
      try {
        const { data } = await postInstance.get("/api/friends-posts", {
          params: { friendsIds, page },
        });
        this.status = "succeeded";
        this.friendsPosts.push(...data);
      } catch (error) {
        this.error = error;
        this.status = "failed";
      }
    },
  },
  getters: {
    getPostsQuantity(state) {
      return state.posts.length;
    },
    getPosts(state) {
      return state.posts;
    },
    getFriendsPosts(state) {
      return state.friendsPosts;
    },
    getAuthor(state) {
      return state.postAuthor;
    },
    getStatus(state) {
      return state.status;
    },
    getLikesQuantity(state) {
      return state.likes;
    },
  },
});
