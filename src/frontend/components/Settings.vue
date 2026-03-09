<template lang="html">
  <div class="overlay-page">
    <div class="overlay-container">
      <h1 class="page-title">Settings</h1>

      <section class="mt-10">
        <h2 class="section-title mb-6">Appearance</h2>
        <div class="flex flex-wrap">
          <settings-section
            title="Theme"
            @save="setTheme"
            name="theme"
            :active-value="theme"
            :values="['light', 'dark', 'system']"
            :value-labels="['Light', 'Dark', 'System']" />

          <settings-section
            title="Accent"
            @save="saveSetting"
            name="accent"
            :active-value="accent"
            :values="['blue', 'red', 'purple']"
            :value-labels="['Blue', 'Red', 'Purple']" />

          <settings-section
            title="Bookmark Background"
            @save="saveSetting"
            name="bookmarkSurfaceStyle"
            :active-value="bookmarkSurfaceStyle"
            :values="['solid', 'blurred']"
            :value-labels="['Solid', 'Blurred']" />
        </div>
      </section>

      <section class="mt-8">
        <h2 class="section-title mb-6">Behavior</h2>
        <div class="flex flex-wrap">
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
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import SettingsSection from './SettingsSection.vue';
import { useAppStore } from '../stores/app';

export default {
  components: {
    SettingsSection,
  },
  computed: {
    ...mapState(useAppStore, [
      'maxResults',
      'propertyKey',
      'openNew',
      'showChromeUrls',
      'accent',
      'bookmarkSurfaceStyle',
      'initialComponent',
      'initialFocus',
      'theme',
    ]),
  },
  methods: {
    ...mapActions(useAppStore, {
      saveSettingAction: 'saveSetting',
      setThemeAction: 'setTheme',
    }),
    saveSetting(key, value) {
      this.saveSettingAction({ key, value });
    },
    setTheme(_key, name) {
      this.setThemeAction(name);
    },
  },
};
</script>
