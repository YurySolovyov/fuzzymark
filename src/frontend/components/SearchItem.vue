<template lang="html">
  <li class="bookmark" :class="{ selected: bookmark.selected }">
      <span class="bookmarkHeader">
          <span class="bookmarkScore">{{ bookmark.score }}</span>
          <span class="bookmarkTitle" v-html="bookmark.wrappedTitle"></span>
          <span class="bookmarkPath">{{ bookmark.path }}</span>
      </span>
      <span class="bookmarkFooter">
          <img class="bookmarkFavicon" :src="bookmark.favicon" />
          <a :href="bookmark.url" class="bookmarkUrl" v-html="bookmark.wrappedUrl"></a>
      </span>
  </li>
</template>

<script>
export default {
  props: ['bookmark']
}
</script>

<style lang="css">
</style>
