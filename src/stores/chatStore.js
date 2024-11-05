import { defineStore } from "pinia";
import axios from "axios";
import { chatInstance } from "../axios";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [],
    typingUser: "",
    typingUsers: new Set(),
    firstMember: null,
    secondMember: null,
  }),

  actions: {
    addMessage(message) {
      this.messages.push(message);
    },

    setTypingUser(user) {
      this.typingUser = user;
    },

    clearTypingUser() {
      this.typingUser = "";
    },

    async fetchMessages(userId, friendId) {
      try {
        const { data } = await chatInstance.get(`/api/get-chat-messages`, {
          params: { userId: userId, friendId: friendId },
        });

        if (data.length > 0) {
          this.firstMember = userId;
          this.secondMember = friendId;
          this.messages = data;
        } else {
          this.firstMember = userId;
          this.secondMember = friendId;
          this.messages = [];
        }
      } catch (error) {
        console.log(error);
      }
    },

    async sendMessage(content, socket) {
      if (!content?.content?.trim()) return;

      const message = {
        sender_id: this.firstMember,
        content,
      };

      this.addMessage(message);
    },
  },

  getters: {
    getMessages(state) {
      return state.messages;
    },
    getFirstMember(state) {
      return state.firstMember;
    },
    getSecondMember(state) {
      return state.secondMember;
    },
  },
});
