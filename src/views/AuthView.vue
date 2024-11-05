<script setup>
import Btn from "../components/Btn.vue";
import Heading from "../components/Heading.vue";
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

const wrongPassword = ref(false);
const emptyFields = ref(false);
const isLoginPage = ref(false);
const username = ref("");
const email = ref("");
const password = ref("");

const AUTH_SERVICE_URL = import.meta.env.VITE_APP_AUTH_SERVICE_URL;

async function submit() {
  const axiosUrl = this.isLoginPage
    ? `${AUTH_SERVICE_URL}/api/login`
    : `${AUTH_SERVICE_URL}/api/registration`;
  const payload = this.isLoginPage
    ? { email: this.email, password: this.password }
    : {
        username: this.username,
        email: this.email,
        password: this.password,
      };
  try {
    await axios.post(axiosUrl, payload, { withCredentials: true });
    this.email = "";
    this.password = "";
    router.push("/home");
  } catch (err) {
    if (this.email === "" || this.password === "") {
      console.error(err);
      this.emptyFields = true;
      this.wrongPassword = false;
    } else {
      this.password = "";
      this.emptyFields = false;
      this.wrongPassword = true;
    }
  }
  if (!this.isLoginPage) {
    this.username = "";
  }
}

async function authWithGoogle() {}

const connectItems = [
  { icon: "/src/assets/svg/google-logo.svg", action: authWithGoogle() },
];
</script>

<template>
  <Heading size="lg">MyFriends</Heading>
  <div class="container">
    <div class="main" v-if="isLoginPage">
      <div class="main__heading">
        <h2>Log In</h2>
        <div class="main__heading_switch">
          <p>Don't have an account?</p>
          <h3 @click="isLoginPage = !isLoginPage">Create one!</h3></div
        >
        <div class="main__heading_connect">
          <div
            class="main__heading_connect_item"
            v-for="item in connectItems"
            :key="item"
            :action="item.action"
            ><img :src="item.icon" alt=""
          /></div>
        </div>
      </div>
      <div class="main__form_wrapper">
        <form class="main__form">
          <input
            v-model="email"
            type="email"
            id="email"
            class="main__form_input"
            placeholder="Email"
          />
          <input
            v-model="password"
            type="password"
            id="password"
            class="main__form_input"
            placeholder="Password"
          />
          <div class="validation_error" v-if="isLoginPage && wrongPassword"
            ><span>Wrong Email or Password!</span></div
          >
          <div class="validation_error" v-if="isLoginPage && emptyFields"
            ><span>Email and Password fields are required!</span></div
          >
          <Btn @click.prevent="submit()" size="md" color="gray">Log In</Btn>
        </form>
      </div>
    </div>
    <div class="main" v-if="!isLoginPage">
      <div class="main__heading">
        <h2>Sign Up</h2>
        <div class="main__heading_switch">
          <p>Already have an account?</p>
          <h3 @click="isLoginPage = !isLoginPage">Log In!</h3></div
        >
      </div>
      <div class="main__form_wrapper">
        <form class="main__form">
          <input
            v-model="username"
            type="text"
            id="username"
            class="main__form_input"
            placeholder="Username"
          />
          <input
            v-model="email"
            type="email"
            id="email"
            class="main__form_input"
            placeholder="Email"
          />
          <input
            v-model="password"
            type="password"
            id="password"
            class="main__form_input"
            placeholder="Password"
          /><Btn size="md" color="gray" @click.prevent="submit()">Sign Up</Btn>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  font-family: var(--main-font-family);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 50px;
  background-color: var(--main-color);
  display: flex;
  border-radius: 28px;
  gap: 32px;

  &__heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    gap: 12px;

    h2 {
      font-weight: 900;
      font-size: 48px;
      color: var(--secondary-color);
    }

    &_switch {
      color: var(--secondary-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 20px;
      gap: 8px;
    }

    h3 {
      cursor: pointer;
      transition: 0.2s;
    }

    h3:hover {
      color: #ddd;
    }

    &_connect {
      display: flex;
      gap: 6px;

      &_item {
        display: flex;
        padding: 7px;
        background-color: var(--card-color);
        border-radius: 50%;
        cursor: pointer;

        &:hover {
          -webkit-filter: brightness(85%);
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }
      }
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    width: 250px;
    gap: 14px;

    &_wrapper {
      display: flex;
      flex-direction: column;
      width: 50%;
    }

    &_input {
      padding: 0px 12px 0px 12px;
      height: 55px;
      border: 1px solid var(--secondary-color);
      border-radius: 15px;
      background: none;
    }

    ::placeholder {
      color: var(--secondary-color);
    }
  }

  textarea:focus,
  input:focus {
    outline: none;
  }

  .validation_error {
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--red);
    padding: 5px 0px;
    border: none;
    border-radius: 8px;
    color: #fff;
  }
}
</style>
