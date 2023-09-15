import { createRouter, createMemoryHistory } from 'vue-router'

import Settings from './components/Settings.vue';
import TileForm from './components/TileForm.vue';
import DeleteTile from './components/DeleteTile.vue';
import BackgroundSettings from './components/BackgroundSettings.vue';

const router = createRouter({
  history: createMemoryHistory(),
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

export default router;