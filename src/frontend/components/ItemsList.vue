<template lang="html">
  <ul
    v-if="hasBookmarks"
    class="mx-auto m-0 min-h-0 w-5/6 flex-1 list-none overflow-y-auto bg-(--container-bg-color) p-0 md:w-2/3 lg:w-1/2"
    id="results">
    <search-item
      v-for="bookmark in bookmarks"
      :key="bookmark.id"
      :bookmark="bookmark" />
  </ul>
  <div
    v-else
    class="mx-auto min-h-0 w-5/6 flex-1 overflow-y-auto bg-(--container-bg-color) md:w-2/3 lg:w-1/2"
    id="results">
    <h1 class="page-title px-4 text-(--input-text-color)">No matches found</h1>
  </div>
</template>

<script>
import SearchItem from './SearchItem.vue';
import ensureInViewport from '../viewport-watcher';

export default {
  components: {
    SearchItem,
  },
  computed: {
    hasBookmarks() {
      return this.bookmarks.length > 0;
    },
  },
  props: {
    bookmarks: {
      type: Array,
      required: true,
    },
  },
  updated() {
    const selected = this.$el.querySelector('.selected');

    if (selected !== null) {
      ensureInViewport(this.$el, selected);
    }
  },
};
</script>
