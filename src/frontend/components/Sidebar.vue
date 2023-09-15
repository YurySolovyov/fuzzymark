<template lang="html">
  <div id="sidebar" class="absolute left-0 top-0 m2">
    <router-link class="overlay-control root"
      title="Close"
      to="/"
      :class="buttonClass">
      <x></x>
    </router-link>
    <router-link class="overlay-control settings"
      title="Settings"
      to="/settings"
      :class="buttonClass">
      <menu-lines></menu-lines>
    </router-link>
    <router-link class="overlay-control new-tile"
      title="New tile"
      v-if="showGrid"
      to="/new-tile"
      :class="buttonClass">
      <plus></plus>
    </router-link>
    <router-link class="overlay-control background"
      title="Set background"
      to="/background"
      :class="buttonClass">
      <mountain></mountain>
    </router-link>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import Plus from './icons/Plus.vue';
import MenuLines from './icons/MenuLines.vue';
import Mountain from './icons/Mountain.vue';
import X from './icons/X.vue';

const getters = mapGetters(['showGrid']);

export default {
  components: {
    Plus,
    MenuLines,
    Mountain,
    X,
  },
  computed: {
    buttonClass() {
      return this.$route.name === 'root' ? 'is-root': 'non-root';
    },
    ...getters
  }
};
</script>

<style lang="css">

#sidebar {
  z-index: 10;
  width: 24px;
}

.overlay-control {
  color: var(--theme-bookmark-link-color);
  display: none;
}

.root.non-root {
  display: block;
}

.settings.is-root {
  display: block;
}

.new-tile.is-root {
  display: block;
}

.background.is-root {
  display: block;
}

</style>
