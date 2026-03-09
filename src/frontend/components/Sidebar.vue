<template lang="html">
  <div
    id="sidebar"
    class="absolute left-0 top-0 z-30 m-2 flex w-6 flex-col gap-3">
    <router-link
      v-if="!isRootRoute"
      class="sidebar-link"
      title="Close"
      to="/">
      <x />
    </router-link>
    <router-link
      v-if="isRootRoute"
      class="sidebar-link"
      title="Settings"
      to="/settings">
      <menu-lines />
    </router-link>
    <router-link
      v-if="isRootRoute && showGrid"
      class="sidebar-link"
      title="New tile"
      to="/new-tile">
      <plus />
    </router-link>
    <router-link
      v-if="isRootRoute"
      class="sidebar-link"
      title="Set background"
      to="/background">
      <mountain />
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'pinia';

import Plus from './icons/Plus.vue';
import MenuLines from './icons/MenuLines.vue';
import Mountain from './icons/Mountain.vue';
import X from './icons/X.vue';
import { useAppStore } from '../stores/app';

export default {
  components: {
    Plus,
    MenuLines,
    Mountain,
    X,
  },
  computed: {
    isRootRoute() {
      return this.$route.name === 'root';
    },
    ...mapState(useAppStore, ['showGrid']),
  },
};
</script>
