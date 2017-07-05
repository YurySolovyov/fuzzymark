import Vue from 'vue';
import Vuex from 'vuex';

import settings from './settings';
import bookmarksCollection  from './bookmarks/collection';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bookmarks: []
  },
  mutations: {
    setBookmarks(state, payload) {
      state.bookmarks = payload;
    }
  },
  actions: {
    async loadBookmarks(context) {
      const result = await bookmarksCollection.load();
      const bookmarks = bookmarksCollection.transform(result, () => settings);
      context.commit('setBookmarks', bookmarks);
      console.log(bookmarks);
    }
  }
});
