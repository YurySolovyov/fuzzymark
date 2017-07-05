<template lang="html">
  <div id="searchList">
    <search-field></search-field>
    <div id="results" class="col-xs-12">
      <search-item v-for="bookmark in bookmarks"
                   :key="bookmark.id"
                   :bookmark="bookmark"></search-item>
    </div>
  </div>
</template>

<script>
import SearchField from './SearchField.vue';
import SearchItem from './SearchItem.vue';
import { mapState } from 'vuex';

export default {
  computed: Object.assign({}, mapState(['bookmarks'])),

  components: {
    SearchItem,
    SearchField
  }
}
</script>

<style lang="css">
</style>
