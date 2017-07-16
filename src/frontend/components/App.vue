<template lang="html">
  <div id="app" :class="`theme-${theme}`">
    <div id="container" class="col-xs-8 col-xs-offset-2">
      <search-field></search-field>
      <items-list :bookmarks="bookmarks"></items-list>
    </div>
    <router-view></router-view>
    <router-link exact
      to="/settings"
      class="overlay-control menu">
      <svg viewBox="0 0 24 24">
        <path fill="#6F6F6F" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path>
      </svg>
    </router-link>
    <router-link exact
      to="/"
      class="overlay-control"
      active-class="hidden">
      <svg viewBox="0 0 24 24">
        <path fill="#6F6F6F" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
      </svg>
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import SearchField from './SearchField.vue';
import ItemsList from './ItemsList.vue';

const getters = mapGetters(['bookmarks']);
const state = mapState(['theme']);

export default {
  components: {
    SearchField,
    ItemsList
  },
  computed: Object.assign({}, getters, state),
  mounted() {
    this.$store.dispatch('loadApp');
  }
};
</script>

<style lang="css">
</style>
