<template lang="html">
  <div class="overlay top-0 left-0">
    <div class="lg-col-6 md-col-8 sm-col-10 mx-auto">
      <h1 class="overlay-title font-light">
        Settings
      </h1>
      <h2 class="left col-12 mt3">
        Appearance
      </h2>
      <settings-section
        title="Theme"
        @save="setTheme"
        name="theme"
        :active-value="theme"
        :values="['light', 'dark']"
        :value-labels="['Light', 'Dark']" />

      <settings-section
        title="Accent"
        @save="saveSetting"
        name="accent"
        :active-value="accent"
        :values="['blue', 'red', 'purple']"
        :value-labels="['Blue', 'Red', 'Purple']" />

      <h2 class="left col-12 mt3">
        Behavior
      </h2>
      <settings-section
        title="Max Results"
        @save="saveSetting"
        name="maxResults"
        :active-value="maxResults"
        :values="[10, 20, 30]"
        :value-labels="['10', '20', '30']" />

      <settings-section
        title="Match Bookmarks By"
        @save="saveSetting"
        name="propertyKey"
        :active-value="propertyKey"
        :values="['title', 'url']"
        :value-labels="['Title', 'URL']" />

      <settings-section
        title="On Launch Show"
        @save="saveSetting"
        name="initialComponent"
        :active-value="initialComponent"
        :values="['recent', 'my']"
        :value-labels="['Recent Bookmarks', 'My Bookmarks']" />

      <settings-section
        title="On New tab open"
        @save="saveSetting"
        name="initialFocus"
        :active-value="initialFocus"
        :values="['url', 'bookmarks']"
        :value-labels="['Browser URL', 'Bookmarks Filter']" />

      <settings-section
        title="Open In The New Tab"
        @save="saveSetting"
        name="openNew"
        :active-value="openNew"
        :values="[true, false]"
        :value-labels="['Yes', 'No']" />

      <settings-section
        title="Include Chrome Service URLs"
        @save="saveSetting"
        name="showChromeUrls"
        :active-value="showChromeUrls"
        :values="[true, false]"
        :value-labels="['Yes', 'No']" />
    </div>
  </div>
</template>

<script>
import SettingsSection from './SettingsSection.vue';
import { mapState, mapGetters } from 'vuex';

const getters = mapGetters([
  'maxResults',
  'propertyKey',
  'openNew',
  'showChromeUrls',
  'accent',
  'initialComponent',
  'initialFocus'
]);
const state = mapState(['theme']);

export default {
  components: {
    SettingsSection
  },
  computed: { ...getters, ...state },
  methods: {
    saveSetting(key, value) {
      this.$store.dispatch('saveSetting', { key, value });
    },
    setTheme(_key, name) {
      this.$store.dispatch('setTheme', name);
    },
  }
};
</script>
