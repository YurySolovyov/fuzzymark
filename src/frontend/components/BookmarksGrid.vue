<template lang="html">
  <div id="grid" class="col-10 mx-auto my4" v-if="hasBookmarks">
    <bookmark-tile v-for="bookmark in bookmarks"
      :key="bookmark.id"
      :bookmark="bookmark"></bookmark-tile>
  </div>
  <div v-else class="no-tiles-message center pt4">
    <h1>No pinned tiles yet, try adding one by clicking plus icon on the left</h1>
  </div>
</template>

<script>

import BookmarkTile from './BookmarkTile.vue';

export default {
  components: {
    BookmarkTile
  },
  computed: {
    hasBookmarks() {
      return this.bookmarks.length > 0;
    }
  },
  props: ['bookmarks']
}
</script>

<style lang="css">

.no-tiles-message h1 {
  font-weight: 100;
  font-size: 32px;
  color: var(--input-text-color);
}

</style>
