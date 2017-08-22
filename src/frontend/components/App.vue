<template lang="html">
  <div id="app" :class="`theme-${theme} accent-${accent}`" v-if="appLoaded">
    <div id="container">
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

const getters = mapGetters([
  'bookmarks',
  'accent',
  'shouldDisplayBookmarksList',
  'appLoaded'
]);
const state = mapState(['theme']);

export default {
  components: {
    SearchField,
    ItemsList,
    BookmarksGrid,
    Sidebar,
    Splash,
  },
  computed: Object.assign({}, getters, state),
  mounted() {
    this.$store.dispatch('loadApp');
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
  height: calc(100vh - 32px);
}

</style>
