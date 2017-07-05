<template lang="html">
  <div id="container" class="col-xs-8 col-xs-offset-2">
    <search-list></search-list>
  </div>
</template>

<script>
import SearchList from './SearchList.vue';
export default {
  components: {
    SearchList
  },
  mounted() {
    this.$store.dispatch('loadBookmarks');
  }
};
</script>

<style lang="css">
</style>
