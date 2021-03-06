import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import Settings from './components/Settings.vue';
import TileForm from './components/TileForm.vue';
import DeleteTile from './components/DeleteTile.vue';
import BackgroundSettings from './components/BackgroundSettings.vue';

import store from './store';

require('styles/style.css');

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
    },
    {
      path: '/background',
      name: 'background',
      component: BackgroundSettings
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
