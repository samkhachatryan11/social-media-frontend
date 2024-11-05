import axios from "axios";

import router from "../router";

const authInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_AUTH_SERVICE_URL,
  timeout: 10000,
});

const postInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_POST_SERVICE_URL,
});

const chatInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_CHAT_SERVICE_URL,
});

const notificationInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_NOTIFICATION_SERVICE_URL,
});

authInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      router.push("/");
    }
    return Promise.reject(error);
  }
);

export { authInstance, postInstance, chatInstance, notificationInstance };
