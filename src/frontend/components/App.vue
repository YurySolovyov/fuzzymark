<template lang="html">
  <div id="app" :class="theme">
    <div id="container" class="col-xs-8 col-xs-offset-2">
      <search-field></search-field>
      <div id="results" class="col-xs-12">
        <search-item v-for="bookmark in bookmarks"
                     :key="bookmark.id"
                     :bookmark="bookmark"></search-item>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SearchField from './SearchField.vue';
import SearchItem from './SearchItem.vue';
import settings from '../settings';

const mappedGetters = mapGetters(['bookmarks', 'theme']);

export default {
  components: {
    SearchField,
    SearchItem
  },
  computed: Object.assign({}, mappedGetters),
  async mounted() {
    const settingsAll = await settings.fetchAll();
    this.$store.commit('updateSettings', settingsAll);
    this.$store.dispatch('loadBookmarks');
  }
};
</script>

<style lang="css">
</style>
