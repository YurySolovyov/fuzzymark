<template lang="html">
  <div id="sidebar" class="absolute left-0 top-0 m2">
    <router-link class="overlay-control root"
      to="/"
      :class="buttonClass">
      <x></x>
    </router-link>
    <router-link class="overlay-control settings"
      to="/settings"
      :class="buttonClass">
      <menu-lines></menu-lines>
    </router-link>
    <router-link class="overlay-control new-tile"
      v-if="showGrid"
      to="/new-tile"
      :class="buttonClass">
      <plus></plus>
    </router-link>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import Plus from './icons/Plus.vue';
import MenuLines from './icons/MenuLines.vue';
import X from './icons/X.vue';

const getters = mapGetters(['showGrid']);

export default {
  components: {
    Plus,
    MenuLines,
    X,
  },
  computed: Object.assign({
    buttonClass() {
      return this.$route.name === 'root' ? 'is-root': 'non-root';
    }
  }, getters)
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

</style>
