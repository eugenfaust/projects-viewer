<script>
import Api from '../services/Api';

export default {
  data() {
    return {
      username: '',
      password: '',
      isLogging: false,
      invalidPassword: false,
      invalidUsername: false,
    };
  },
  methods: {
    async auth() {
      const format = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
      if (
        format.test(this.username)
        || this.username === ''
        || this.username.length < 4
      ) {
        this.invalidUsername = true;
        setTimeout(() => {
          this.invalidUsername = false;
        }, 2000);
        return;
      }
      if (this.password === '' || this.password.length < 5) {
        this.invalidPassword = true;
        setTimeout(() => {
          this.invalidPassword = false;
        }, 2000);
        return;
      }
      this.isLogging = true;
      const result = await Api.login(this.username, this.password);
      if (result.status === true) {
        this.isLogging = false;
        this.$router.push('/home');
      } else if (result.detail === 'Incorrect username or password') {
        this.isLogging = false;
        this.invalidUsername = true;
        this.invalidPassword = true;
        setTimeout(() => {
          this.invalidUsername = false;
          this.invalidPassword = false;
        }, 2000);
      } else {
        this.isLogging = false;
      }
    },
  },
};
</script>
<template>
  <div class="h-screen flex justify-center items-center">
    <div
      class="max-w-xs border-2 border-primary p-5 flex flex-col gap-2 items-center"
    >
      <span class="text-xl">Projects viewer</span>
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="mt-2 input input-bordered input-primary w-full"
        :class="{ 'input-error': invalidUsername }"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="input input-bordered input-primary w-full"
        :class="{ 'input-error': invalidPassword }"
      />
      <button
        @click="auth"
        class="btn btn-primary mt-2 w-[100%]"
        :class="{ 'btn-disabled loading': isLogging }"
      >
        Log in
      </button>
    </div>
  </div>
</template>
