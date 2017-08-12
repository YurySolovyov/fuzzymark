<template lang="html">
  <li class="bookmark overflow-hidden border-box list-style-none"
    :class="{ selected: bookmark.selected }">
    <div class="bookmarkWrapper p1 container-background">
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

.bookmark {
  font-size: 16px;
  margin-bottom: 5px;
  margin-right: 5px;
  padding: 2px;
}

.bookmark.selected {
  background-image: linear-gradient(to right, var(--theme-selected-start) 0%,var(--theme-selected-end) 100%);
}

.bookmark.selected .bookmarkWrapper {
  background-color: var(--theme-selected-bg-color);
}

.bookmarkWrapper {
  transition: 0.3s;
}

.bookmarkHeader, .bookmarkFooter {
  font-size: 16px;
  text-overflow: ellipsis;
}

.bookmarkHeader {
  color: var(--theme-header-color);
}

.bookmarkHeader b {
  color: var(--theme-selected-start);
}

.bookmarkFooter {
  border-top: 1px var(--theme-bookmark-divider-color) solid;
}

.bookmarkPath {
  color: var(--theme-bookmark-link-color);
  font-size: 14px;
}

.bookmarkScore {
  color: var(--theme-selected-start);
  margin-right: 16px;
}

.bookmarkUrl {
  color: var(--theme-bookmark-link-color);
}

.bookmarkUrl:hover {
  color: var(--theme-bookmark-link-hover-color);
  text-decoration: underline;
}

.bookmarkFavicon {
  width: 16px;
  height: 16px;
  margin: -4px 4px 0 -4px;
}

</style>
