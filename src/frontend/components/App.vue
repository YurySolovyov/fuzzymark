<template lang="html">
  <div id="app" :class="`theme-${theme} accent-${accent}`" v-if="appLoaded">
    <div class="absolute"
      id="wallpaper"
      :style="{ background: wallpaper }"></div>
    <div id="container" class="absolute">
      <search-field></search-field>
      <items-list v-if="shouldDisplayBookmarksList"
        :bookmarks="bookmarks"></items-list>
      <bookmarks-grid v-else
        :bookmarks="bookmarks"></bookmarks-grid>
    </div>
    <router-view></router-view>
    <sidebar></sidebar>
  </div>
  <splash v-else></splash>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import SearchField from './SearchField.vue';
import ItemsList from './ItemsList.vue';
import BookmarksGrid from './BookmarksGrid.vue';
import Sidebar from './Sidebar.vue';
import Splash from './Splash.vue';

import wallpaperManager from '../wallpaper-manager';

const getters = mapGetters([
  'bookmarks',
  'accent',
  'shouldDisplayBookmarksList',
  'appLoaded'
]);
const state = mapState(['theme']);

export default {
  data() {
    return {
      wallpaper: null
    };
  },
  components: {
    SearchField,
    ItemsList,
    BookmarksGrid,
    Sidebar,
    Splash,
  },
  computed: Object.assign({}, getters, state),
  methods: {
    async fetchWallpaper() {
      const wallpaper = await wallpaperManager.get();
      if (wallpaper) {
        this.wallpaper = wallpaper;
      }
    }
  },
  async mounted() {
    this.$store.dispatch('loadApp');
    await this.fetchWallpaper();
  }
};
</script>

<style lang="css">

#app {
  height: 100vh;
  width: 100vw;
  background: var(--main-bg-color);
}

#container {
  height: 100vh;
  width: 100vw;
}

#wallpaper {
  width: 100vw;
  height: 100vh;
  opacity: 0.25;
}

</style>
