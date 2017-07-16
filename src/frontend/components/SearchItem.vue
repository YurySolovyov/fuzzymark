<template lang="html">
  <li class="bookmark overflow-hidden border-box list-style-none"
    :class="{ selected: bookmark.selected }">
    <div class="bookmarkWrapper p1">
      <div class="bookmarkHeader p1 overflow-hidden nowrap">
        <span class="bookmarkScore">{{ bookmark.score }}</span>
        <span class="bookmarkTitle" v-html="bookmark.wrappedTitle"></span>
        <span class="bookmarkPath right">{{ bookmark.path }}</span>
      </div>
      <div class="bookmarkFooter p1 overflow-hidden nowrap">
        <img class="bookmarkFavicon inline-block" :src="bookmark.favicon" />
        <a :href="bookmark.url" class="bookmarkUrl" v-html="bookmark.wrappedUrl"></a>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ['bookmark']
}
</script>

<style lang="css">
</style>
