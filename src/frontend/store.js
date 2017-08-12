import Vue from 'vue';
import Vuex from 'vuex';

import settings from './settings';
import bookmarksCollection from './bookmarks/collection';
import matchedBookmarks from './bookmarks/matched';
import recentBookmarks from './bookmarks/recent';
import tileBookmarks from './bookmarks/tiles';
import messageService from './message-service';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    theme: 'light',
    bookmarks: [],
    tiles: [],
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

      if (state.settings.initialComponent === 'my') {
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
    initialComponent(state) {
      return state.settings.initialComponent;
    },
    shouldDisplayBookmarksList(state, getters) {
      return state.settings.initialComponent === 'recent' || getters.hasInputValue;
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
      state.bookmarks = bookmarks;
    },
    setTiles(state, tiles) {
      state.tiles = tiles;
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
    async loadApp({ commit, state, dispatch }) {
      const settingsAll = await settings.fetchAll();
      dispatch('updateSettings', settingsAll);
      dispatch('loadBookmarks');
    },
    async loadBookmarks({ commit, state, getters }) {
      const result = await bookmarksCollection.load();
      const bookmarks = bookmarksCollection.transform(result, getters.settings);
      commit('setBookmarks', bookmarks);

      const tiles = await tileBookmarks.fetchAll();
      commit('setTiles', tiles);
    },
    updateInputValue({ commit, state }, value) {
      commit('setInputValue', value);
      commit('setSelectedIndex', 0);
    },
    updateSelectedIndex({ commit, state, getters }, delta) {
      const maybeIndex = Math.min(Math.max(state.selectedIndex + delta, 0), getters.maxResults - 1);
      const finalIndex = Number.isNaN(maybeIndex) ? 0 : maybeIndex;
      commit('setSelectedIndex', finalIndex);
    },
    updateSettings({ commit, state }, settings) {
      commit('updateSettings', settings);

      const themeNormalized = settings.activeTheme === 'default' ? 'light' : settings.activeTheme;
      commit('setTheme', themeNormalized);
    },
    async saveSetting({ commit }, { key, value }) {
      const type = 'set_setting';
      await messageService.send({ type, key, value });
      commit('setSetting', { key, value });
    },
    async setTheme({ commit, dispatch }, theme) {
      await dispatch('saveSetting', { key: 'activeTheme', value: theme });
      commit('setTheme', theme);
    },
    async addNewTile({ dispatch }, { id, tile }) {
      await tileBookmarks.save(id, tile);
      dispatch('loadBookmarks');
    }
  }
});
