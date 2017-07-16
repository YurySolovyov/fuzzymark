<template lang="html">
  <div id="results" class="p0">
    <search-item v-for="bookmark in bookmarks"
                 :key="bookmark.id"
                 :bookmark="bookmark"></search-item>
  </div>
</template>

<script>
import SearchItem from './SearchItem.vue';
import viewportWatcher from '../viewport-watcher';

export default {
  components: {
    SearchItem
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
</style>
