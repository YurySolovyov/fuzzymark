import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import Settings from './components/Settings.vue';
import GettingStarted from './components/GettingStarted.vue';

import store from './store';
import css from 'styles/style.css';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/settings', component: Settings },
    { path: '/getting-started', component: GettingStarted }
  ]
});

const app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});

export default app;
