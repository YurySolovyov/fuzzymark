<template lang="html">
  <div
    id="app"
    :class="appClasses"
    :style="appStyle"
    class="relative h-screen w-screen overflow-hidden bg-(--main-bg-color) font-sans"
    v-if="appLoaded">
    <div
      class="absolute inset-0 transition-opacity duration-300 will-change-[opacity]"
      :class="wallpaperFitClasses"
      id="wallpaper"
      :style="wallpaperStyle" />
    <div
      id="container"
      class="absolute inset-0 flex flex-col">
      <search-field />
      <items-list
        v-if="shouldDisplayBookmarksList"
        :bookmarks="bookmarks" />
      <bookmarks-grid
        v-else
        :bookmarks="bookmarks" />
    </div>
    <router-view />
    <sidebar />
  </div>
  <splash v-else />
</template>

<script>
import { mapActions, mapState } from 'pinia';

import SearchField from './SearchField.vue';
import ItemsList from './ItemsList.vue';
import BookmarksGrid from './BookmarksGrid.vue';
import Sidebar from './Sidebar.vue';
import Splash from './Splash.vue';
import { useAppStore } from '../stores/app';

const accentVarsByName = Object.freeze({
  blue: {
    '--theme-selected-start': '#4dadf7',
    '--theme-selected-end': '#3bc9db',
    '--bookmark-accent-color': '#4dadf7',
  },
  red: {
    '--theme-selected-start': '#ff6b6b',
    '--theme-selected-end': '#f06595',
    '--bookmark-accent-color': '#ff6b6b',
  },
  purple: {
    '--theme-selected-start': '#cc5de8',
    '--theme-selected-end': '#f06595',
    '--bookmark-accent-color': '#cc5de8',
  },
});

export default {
  components: {
    SearchField,
    ItemsList,
    BookmarksGrid,
    Sidebar,
    Splash,
  },
  computed: {
    appClasses() {
      return {
        'theme-dark': this.effectiveTheme === 'dark',
        'theme-light': this.effectiveTheme === 'light',
      };
    },
    appStyle() {
      return accentVarsByName[this.accent] ?? accentVarsByName.blue;
    },
    wallpaperStyle() {
      return {
        backgroundImage: this.wallpaper,
        opacity: this.wallpaperOpacity,
      };
    },
    ...mapState(useAppStore, [
      'bookmarks',
      'accent',
      'effectiveTheme',
      'shouldDisplayBookmarksList',
      'appLoaded',
      'wallpaper',
      'wallpaperOpacity',
      'wallpaperFitClasses',
    ]),
  },
  methods: {
    ...mapActions(useAppStore, ['loadApp']),
  },
  mounted() {
    this.loadApp();
  },
};
</script>
