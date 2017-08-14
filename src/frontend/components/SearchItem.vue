<template lang="html">
  <li class="bookmark overflow-hidden border-box list-style-none"
    :class="{ selected: bookmark.selected }">
    <div class="bookmark-wrapper p1 container-background">
      <div class="bookmark-header p1 overflow-hidden nowrap">
        <span class="bookmark-score">{{ bookmark.score }}</span>
        <span class="bookmark-title" v-html="bookmark.wrappedTitle"></span>
        <span class="bookmark-path right">{{ bookmark.path }}</span>
      </div>
      <div class="bookmark-footer p1 overflow-hidden nowrap">
        <img class="bookmark-favicon inline-block" :src="bookmark.favicon" />
        <a :href="bookmark.url" class="bookmark-url" v-html="bookmark.wrappedUrl"></a>
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

.bookmark.selected .bookmark-wrapper {
  background-color: var(--theme-selected-bg-color);
}

.bookmark-wrapper {
  transition: 0.3s;
}

.bookmark-header, .bookmark-footer {
  font-size: 16px;
  text-overflow: ellipsis;
}

.bookmark-header {
  color: var(--theme-header-color);
}

.bookmark-header b {
  color: var(--theme-selected-start);
}

.bookmark-footer {
  border-top: 1px var(--theme-bookmark-divider-color) solid;
}

.bookmark-path {
  color: var(--theme-bookmark-link-color);
  font-size: 14px;
}

.bookmark-score {
  color: var(--theme-selected-start);
  margin-right: 16px;
}

.bookmark-url {
  color: var(--theme-bookmark-link-color);
}

.bookmark-url:hover {
  color: var(--theme-bookmark-link-hover-color);
  text-decoration: underline;
}

.bookmark-favicon {
  width: 16px;
  height: 16px;
  margin: -4px 4px 0 -4px;
}

</style>
