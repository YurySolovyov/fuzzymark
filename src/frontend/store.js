import Vue from 'vue';
import Vuex from 'vuex';

import settings from './settings';
import bookmarksCollection from './bookmarks/collection';
import matchedBookmarks from './bookmarks/matched';
import recentBookmarks from './bookmarks/recent';
import tileBookmarks from './bookmarks/tiles';
import messageService from './message-service';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    theme: 'light',
    bookmarks: null,
    tiles: null,
    inputValue: '',
    settings: {},
    selectedIndex: 0,
  },
  getters: {
    hasInputValue(state) {
      return state.inputValue !== '';
    },
    bookmarks(state, getters) {
      if (getters.hasInputValue) {
        return matchedBookmarks.filter(state.bookmarks, state.inputValue, getters.settings);
      }

      if (getters.showGrid) {
        return state.tiles;
      } else {
        return recentBookmarks.filter(state.bookmarks, getters.settings);
      }
    },
    settings(state) {
      return Object.assign({}, state.settings, {
        selectedIndex: state.selectedIndex
      });
    },
    maxResults(state) {
      return state.settings.maxResults;
    },
    propertyKey(state) {
      return state.settings.propertyKey;
    },
    openNew(state) {
      return state.settings.openNew;
    },
    accent(state) {
      return state.settings.accent;
    },
    selectedBookmark(state, getters) {
      return getters.bookmarks[state.selectedIndex];
    },
    showGrid(state) {
      return state.settings.initialComponent === 'my';
    },
    showRecent(state) {
      return state.settings.initialComponent === 'recent';
    },
    initialComponent(state) {
      return state.settings.initialComponent;
    },
    shouldDisplayBookmarksList(state, getters) {
      return getters.showRecent || getters.hasInputValue;
    },
    appLoaded(state) {
      return state.bookmarks !== null && state.tiles !== null;
    }
  },
  mutations: {
    updateSettings(state, settings) {
      state.settings = settings;
    },
    setSetting(state, { key, value }) {
      state.settings[key] = value;
    },
    setBookmarks(state, bookmarks) {
      state.bookmarks = bookmarks || [];
    },
    setTiles(state, tiles) {
      state.tiles = tiles || [];
    },
    setInputValue(state, value) {
      state.inputValue = value;
    },
    setSelectedIndex(state, index) {
      state.selectedIndex = index;
    },
    setTheme(state, theme) {
      state.theme = theme;
    }
  },
  actions: {
    async loadApp({ dispatch }) {
      const settingsAll = await settings.fetchAll();
      dispatch('updateSettings', settingsAll);
      dispatch('loadBookmarks');
    },
    async loadBookmarks({ commit, getters }) {
      const result = await bookmarksCollection.load();
      const bookmarks = bookmarksCollection.transform(result, getters.settings);
      commit('setBookmarks', bookmarks);

      const tiles = await tileBookmarks.fetchAll();
      commit('setTiles', tiles);
    },
    updateInputValue({ commit }, value) {
      commit('setInputValue', value);
      commit('setSelectedIndex', 0);
    },
    resetInput({ dispatch }) {
      dispatch('updateInputValue', '');
    },
    updateSelectedIndex({ commit, state, getters }, delta) {
      const maybeIndex = Math.min(Math.max(state.selectedIndex + delta, 0), getters.maxResults - 1);
      const finalIndex = Number.isNaN(maybeIndex) ? 0 : maybeIndex;
      commit('setSelectedIndex', finalIndex);
    },
    updateSettings({ commit }, settings) {
      commit('updateSettings', settings);

      const themeNormalized = settings.activeTheme === 'default' ? 'light' : settings.activeTheme;
      commit('setTheme', themeNormalized);
    },
    async saveSetting({ commit }, { key, value }) {
      await messageService.send('set-setting', { key, value });
      commit('setSetting', { key, value });
    },
    async setTheme({ commit, dispatch }, theme) {
      await dispatch('saveSetting', { key: 'activeTheme', value: theme });
      commit('setTheme', theme);
    },
    async saveNewTile({ dispatch }, { id, tile }) {
      await tileBookmarks.saveNewTile(id, tile);
      dispatch('loadBookmarks');
    },
    async saveTile({ dispatch }, { id, tile }) {
      await tileBookmarks.saveTile(id, tile);
      dispatch('loadBookmarks');
    },
    async deleteTile({ dispatch }, { id }) {
      await tileBookmarks.deleteTile(id);
      dispatch('loadBookmarks');
    },
    async saveTileIds({ state }) {
      const ids = state.tiles.map(t => t.id);
      await tileBookmarks.saveTileIds(ids);
    }
  }
});

messageService.on('storage-changed', function() {
  store.dispatch('loadBookmarks');
});

export default store;
