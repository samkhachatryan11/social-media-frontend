import { createRouter, createWebHistory, useRoute } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { routes } from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

const route = useRoute();

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  userStore.fetchUserData();

  const isAuthenticated = userStore.getUser;

  if (to.meta.requiresAuth && Object.keys(isAuthenticated)?.length < 1) {
    next({ path: "/" });
  } else {
    next();
  }
});

export default router;
