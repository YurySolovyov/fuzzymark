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
    settings: {}
  },
  getters: {
    bookmarks(state) {
      if (state.inputValue === '') {
        return recentBookmarks.filter(state.bookmarks, state.settings);
      } else {
        return matchedBookmarks.filter(state.bookmarks, state.inputValue, state.settings);
      }
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
    }
  },
  actions: {
    async loadBookmarks({ commit, state }) {
      const result = await bookmarksCollection.load();
      const bookmarks = bookmarksCollection.transform(result, state.settings);
      commit('setBookmarks', bookmarks);
      console.log(bookmarks);
    },
    updateInputValue({ commit }, value) {
      commit('setInputValue', value);
    }
  }
});
