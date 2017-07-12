import Vue from 'vue';
import Vuex from 'vuex';

import settings from './settings';
import bookmarksCollection from './bookmarks/collection';
import matchedBookmarks from './bookmarks/matched';
import recentBookmarks from './bookmarks/recent';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bookmarks: [],
    inputValue: '',
    settings: {},
    selectedIndex: 0,
  },
  getters: {
    bookmarks(state, getters) {
      if (state.inputValue === '') {
        return recentBookmarks.filter(state.bookmarks, getters.settings);
      } else {
        return matchedBookmarks.filter(state.bookmarks, state.inputValue, getters.settings);
      }
    },
    settings(state) {
      return Object.assign({}, state.settings, {
        selectedIndex: state.selectedIndex
      });
    },
    maxResults: function(state) {
      return state.settings.maxResults;
    }
  },
  mutations: {
    updateSettings(state, payload) {
      state.settings = payload;
    },
    setBookmarks(state, payload) {
      state.bookmarks = payload;
    },
    setInputValue(state, payload) {
      state.inputValue = payload;
    },
    setSelectedIndex(state, payload) {
      state.selectedIndex = payload;
    }
  },
  actions: {
    async loadBookmarks({ commit, state, getters }) {
      const result = await bookmarksCollection.load();
      const bookmarks = bookmarksCollection.transform(result, getters.settings);
      commit('setBookmarks', bookmarks);
    },
    updateInputValue({ commit, state }, value) {
      commit('setInputValue', value);
      commit('setSelectedIndex', 0);
    },
    updateSelectedIndex({ commit, state, getters }, delta) {
      const maybeIndex = Math.min(Math.max(state.selectedIndex + delta, 0), getters.maxResults - 1);
      const finalIndex = Number.isNaN(maybeIndex) ? 0 : maybeIndex;
      commit('setSelectedIndex', finalIndex);
    }
  }
});
