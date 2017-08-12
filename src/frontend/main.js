import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import Settings from './components/Settings.vue';
import GettingStarted from './components/GettingStarted.vue';
import TileForm from './components/TileForm.vue';
import DeleteTile from './components/DeleteTile.vue';

import store from './store';
import css from 'styles/style.css';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'root',
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/getting-started',
      name: 'getting-started',
      component: GettingStarted
    },
    {
      path: '/new-tile',
      name: 'new-tile',
      component: TileForm
    },
    {
      path: '/edit-tile/:id',
      name: 'edit-tile',
      component: TileForm
    },
    {
      path: '/delete-tile/:id',
      name: 'delete-tile',
      component: DeleteTile
    }
  ]
});

const app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});

export default app;
