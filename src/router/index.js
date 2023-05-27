import { createWebHistory, createRouter } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  {
    path: '/home/:currentView?',
    name: 'home',
    component: HomeView,
    props: true,
  },
  {
    path: '/:currentView?',
    name: 'home',
    component: HomeView,
    props: true,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    props: true,
  },
];
const base = '/manager/';
const router = createRouter({
  history: createWebHistory(base),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
