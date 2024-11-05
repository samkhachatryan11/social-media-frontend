import { io } from "socket.io-client";

const chatServiceUrl = import.meta.env.VITE_APP_CHAT_SERVICE_SOCKET_URL;
const notificationServiceUrl = import.meta.env
  .VITE_APP_NOTIFICATION_SERVICE_SOCKET_URL;

const chatSocket = io(chatServiceUrl);
const notificationSocket = io(notificationServiceUrl);

export { chatSocket, notificationSocket };
