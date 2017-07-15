<template lang="html">
  <div class="overlay">
    <div class="col-xs-8 col-xs-offset-2">
      <h1>Settings</h1>
      <section>
        <h2>Theme</h2>
        <span class="select"
          :class="{ active: isActiveSetting('theme', 'light') }"
          @click="setTheme('light')">Light</span>
        <span class="select"
          :class="{ active: isActiveSetting('theme', 'dark') }"
          @click="setTheme('dark')">Dark</span>
      </section>
      <section>
        <h2>Max Results</h2>
        <span class="select"
          :class="{ active: isActiveSetting('maxResults', 10) }"
          @click="saveSetting('maxResults', 10)">10</span>
        <span class="select"
          :class="{ active: isActiveSetting('maxResults', 20) }"
          @click="saveSetting('maxResults', 20)">20</span>
        <span class="select"
          :class="{ active: isActiveSetting('maxResults', 30) }"
          @click="saveSetting('maxResults', 30)">30</span>
      </section>
      <section>
        <h2>Match Bookmarks By</h2>
        <span class="select"
          :class="{ active: isActiveSetting('propertyKey', 'title') }"
          @click="saveSetting('propertyKey', 'title')">Title</span>
        <span class="select"
          :class="{ active: isActiveSetting('propertyKey', 'url') }"
          @click="saveSetting('propertyKey', 'url')">URL</span>
      </section>
      <section>
        <h2>Open In The New Tab</h2>
        <span class="select"
          :class="{ active: isActiveSetting('openNew', true) }"
          @click="saveSetting('openNew', true)">Yes</span>
        <span class="select"
          :class="{ active: isActiveSetting('openNew', false) }"
          @click="saveSetting('openNew', false)">No</span>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

const getters = mapGetters(['maxResults', 'propertyKey', 'openNew']);
const state = mapState(['theme']);

export default {
  computed: Object.assign({}, getters, state),
  methods: {
    isActiveSetting(key, value) {
      return this[key] === value;
    },
    saveSetting(key, value) {
      this.$store.dispatch('saveSetting', { key, value });
    },
    setTheme(name) {
      this.$store.dispatch('setTheme', name);
    }
  }
}
</script>

<style lang="css">
section {
  border-bottom: 1px var(--container-bg-color) solid;
  padding: 10px 0;
}

.select {
  cursor: pointer;
  padding: 5px;
  display: inline-block;
  min-width: 64px;
  text-align: center;
  background-color: var(--theme-selected-bg-color);
}
.select.active {
  background-color: var(--theme-selected-start);
}
</style>
