<template lang="html">
  <div class="p0 lg-col-6 md-col-8 sm-col-10 mx-auto container-background" id="results">
    <template v-if="hasBookmarks">
      <search-item v-for="bookmark in bookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"></search-item>
    </template>
    <h1 class="font-light overlay-title px2" v-else>No matches found</h1>
  </div>
</template>

<script>
import SearchItem from './SearchItem.vue';
import viewportWatcher from '../viewport-watcher';

export default {
  components: {
    SearchItem
  },
  computed: {
    hasBookmarks() {
      return this.bookmarks.length > 0;
    }
  },
  props: ['bookmarks'],
  updated() {
    const selected = this.$el.querySelector('.selected');
    if (selected !== null) {
      viewportWatcher.ensureInViewport(this.$el, selected);
    }
  }
}
</script>


<style lang="css">

#results {
  max-height: calc(100% - 80px);
  overflow-y: scroll;
  will-change: transform;
}

#results h1 {
  color: var(--input-text-color);
}

</style>
