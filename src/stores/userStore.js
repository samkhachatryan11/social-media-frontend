import { defineStore } from "pinia";
import { authInstance } from "../axios";
import { useLocalStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: useLocalStorage("authUser", "{}"),
    userFriends: [],
    friendRequests: [],
    sentFriendRequests: [],
    status: "idle",
    error: null,
  }),
  actions: {
    async fetchUserData(id) {
      this.status = "loading";
      try {
        if (id) {
          const { data } = await authInstance.get("/api/user", {
            params: { id },
          });
          this.user = JSON.stringify(data.user);
          this.status = "succeeded";
        } else {
          const { data } = await authInstance.get("/api/user");
          this.user = JSON.stringify(data.user);
          this.userFriends = data.friends;
          this.status = "succeeded";
        }
      } catch (error) {
        this.error = error;
        this.status = "failed";
      }
    },
    async fetchFriendRequests() {
      this.status = "loading";
      try {
        const response = await authInstance.get("/api/friends/friend-requests");

        this.userFriends = response.data;
        this.status = "succeeded";
      } catch (error) {
        this.error = error;
        this.status = "failed";
      }
    },
    async acceptFriendRequest(id) {
      this.status = "loading";
      try {
        await authInstance.put(`/api/friends/accept-friend-request/${id}`);
        this.status = "succeeded";
      } catch (error) {
        this.error = error;
        this.status = "failed";
      }
    },
    async sendFriendRequest(id) {
      this.status = "loading";
      this.sentFriendRequests.push(id);
      try {
        await authInstance.post(`/api/friends/send-friend-request/${id}`);
        this.status = "succeeded";
      } catch (error) {
        this.error = error;
        this.status = "failed";
      }
    },
  },
  getters: {
    getUser(state) {
      return JSON.parse(state.user);
    },
    getUserFriends(state) {
      return state.userFriends;
    },
  },
});
