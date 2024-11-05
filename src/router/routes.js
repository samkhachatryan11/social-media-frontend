export const routes = [
  {
    name: "Login",
    path: "/",
    component: () => import("../views/AuthView.vue"),
  },
  {
    name: "Home",
    path: "/home/:post?",
    component: () => import("../views/HomeView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "Profile",
    path: "/profile/:id",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    name: "Friends",
    path: "/friends",
    component: () => import("../views/FriendsView.vue"),
  },
  {
    name: "Messages",
    path: "/messages/:id?",
    component: () => import("../views/MessagesView.vue"),
  },
  {
    name: "Post",
    path: "/profile/post/:id",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    name: "Notifications",
    path: "/notifications",
    component: () => import("../views/NotificationsView.vue"),
  },
];
