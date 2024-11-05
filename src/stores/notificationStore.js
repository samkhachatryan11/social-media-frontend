import { defineStore } from "pinia";
import axios from "axios";
import { notificationInstance } from "../axios"; // Adjust to your axios instance for notifications

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    notifications: [],
  }),

  actions: {
    addNotification(notification) {
      this.notifications.unshift(notification); // Add new notification to the top
    },

    async fetchNotifications(userId) {
      try {
        const { data } = await notificationInstance.get(
          `/api/get-notifications/${userId}`
        );
        this.notifications = data; // Set notifications state
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
  },

  getters: {
    getNotifications(state) {
      return state.notifications;
    },
  },
});
