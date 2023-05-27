<script>
import NavbarVue from './components/NavBar.vue';
import FooterVue from './components/Footer.vue';

export default {
  data() {
    return {};
  },
  methods: {
  },
  computed: {
    theme() {
      return this.$store.state.theme === 'light' ? 'cupcake' : 'business';
    },
  },
  components: { NavbarVue, FooterVue },
  async mounted() {
    this.$store.commit('setTheme', localStorage.getItem('theme') || 'light');
  },
};
</script>

<template>
  <div :data-theme="theme">
    <NavbarVue />
    <div class="flex justify-center items-center pt-16">
      <router-view />
    </div>
    <FooterVue />
  </div>
</template>
