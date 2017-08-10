<template lang="html">
  <div id="grid" class="col-10 mx-auto my4">
    <bookmark-tile v-for="bookmark in bookmarks"
      :key="bookmark.id"
      :bookmark="bookmark"></bookmark-tile>
  </div>
</template>

<script>

import BookmarkTile from './BookmarkTile.vue';

export default {
  components: {
    BookmarkTile
  },
  props: ['bookmarks'],
  mounted() {
    console.log(this.bookmarks);
  }
}
</script>

<style lang="css">
</style>
