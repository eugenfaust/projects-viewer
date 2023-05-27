<script>
import DashboardVue from './wallet/DashboardView.vue';
import Api from '../services/Api';

export default {
  data() {
    return {
      username: '',
    };
  },
  methods: {
    hideDrawer() {
      this.$store.commit('setDrawer', false);
    },
    goTo(path) {
      this.$router.push(path);
      this.$store.commit('setDrawer', false);
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    async getUserInfo() {
      const user = await Api.getMe();
      if (user) {
        this.username = user.username.charAt(0).toUpperCase() + user.username.slice(1);
      } else {
        this.$router.push('/login');
      }
    },
  },
  computed: {
    showDrawer() {
      return this.$store.state.showDrawer;
    },
    currentView() {
      return this.$route.path.split('/')[1];
    },
    address() {
      return this.$store.state.address;
    },
  },
  watch: {
    address(newVal) {
      if (!newVal) {
        this.goTo('/');
      }
    },
  },
  mounted() {
    this.$store.commit('setDrawer', false);
    this.getUserInfo();
  },
  components: {
    DashboardVue,
  },
};
</script>
<template>
  <div class="flex flex-row w-full h-screen justify-center">
    <!-- Drawer menu -->
    <div
      :class="{ 'max-xl:-translate-x-full': !showDrawer }"
      class="flex flex-row z-20 w-full h-screen xl:max-w-sm absolute top-16 transition-all
      xl:relative xl:top-0"
    >
      <div class="flex flex-col bg-base-100 max-w-sm">
        <span class="text-xl font-bold w-80 text-center mt-5">{{
          username
        }}</span>
        <ul class="menu p-4 w-80 text-base-content">
          <li>
            <a
              :class="{
                'active bg-opacity-50':
                  currentView === 'dashboard' || currentView === '',
              }"
              @click="goTo('dashboard')"
              >Clients</a
            >
          </li>
          <li>
            <a @click="logout">Log Out</a>
          </li>
        </ul>
      </div>
      <div class="xl:hidden w-full h-full bg-base-100 bg-opacity-50" @click="hideDrawer"></div>
    </div>
    <!-- Main content -->
    <div class="flex-grow w-full">
      <DashboardVue />
    </div>
  </div>
</template>
<style></style>
