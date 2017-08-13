<template lang="html">
  <div id="grid" class="col-10 mx-auto my4" v-if="hasBookmarks">
    <draggable :list="bookmarks" @change="onSort" :options="{ handle: '.move' }">
      <bookmark-tile v-for="bookmark in bookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"></bookmark-tile>
    </draggable>
  </div>
  <div v-else class="no-tiles-message center pt4">
    <h1 class="font-light">No pinned tiles yet, try adding one by clicking plus icon on the left</h1>
  </div>
</template>

<script>

import BookmarkTile from './BookmarkTile.vue';
import draggable from 'vuedraggable';

export default {
  components: {
    BookmarkTile,
    draggable
  },
  computed: {
    hasBookmarks() {
      return this.bookmarks.length > 0;
    }
  },
  props: ['bookmarks'],
  methods: {
    onSort() {
      this.$store.dispatch('saveTileIds');
    }
  }
}
</script>

<style lang="css">

.no-tiles-message h1 {
  font-size: 32px;
  color: var(--input-text-color);
}

</style>
