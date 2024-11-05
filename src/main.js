import router from "./router";
import "vuetify/styles";
import { createApp } from "vue";
import { createPinia } from "pinia";
import "virtual:svg-icons-register";
import vueDebounce from "vue-debounce";
import App from "./App.vue";
import GAuth from "vue3-google-oauth2";
import { GAuthOptions } from "./auth/GoogleAuth";

import "./assets/style.scss";

const app = createApp(App);

app
  .use(createPinia())
  .use(router)
  .directive("debounce", vueDebounce({ lock: true }))
  // .use(GAuth, GAuthOptions)
  .mount("#app");
