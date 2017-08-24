<template lang="html">
  <li class="bookmark overflow-hidden border-box list-style-none"
    :class="{ selected: bookmark.selected }">
    <div class="bookmark-wrapper p1 container-background">
      <div class="bookmark-header p1 flex">
        <span class="bookmark-score">{{ bookmark.score }}</span>
        <span class="bookmark-title truncate" v-html="bookmark.wrappedTitle"></span>
        <span class="bookmark-path right">{{ bookmark.path }}</span>
      </div>
      <div class="bookmark-footer p1 flex">
        <img class="bookmark-favicon mr1" :src="bookmark.favicon" />
        <a class="truncate bookmark-url"
          :href="bookmark.url"
          v-html="bookmark.wrappedUrl"></a>
        <span class="item-controls">
          <span title="Add to the New Tab page" @click="onAddClick">
            <plus></plus>
          </span>
        </span>
      </div>
    </div>
  </li>
</template>

<script>
import uuid from 'uuid/v4';
import Plus from './icons/Plus.vue';

export default {
  components: {
    Plus
  },
  props: ['bookmark'],
  methods: {
    onAddClick() {
      this.$store.dispatch('resetInput');
      this.$store.dispatch('saveNewTile', {
        id: uuid(),
        tile: {
          title: this.bookmark.title,
          url: this.bookmark.url
        }
      });
    }
  }
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

.bookmark.selected .item-controls,
.bookmark:hover .item-controls {
  visibility: visible;
}

.bookmark-wrapper {
  transition: 0.3s;
}

.bookmark-header {
  align-items: center;
  color: var(--theme-header-color);
}

.bookmark-header b {
  color: var(--theme-selected-start);
}

.bookmark-footer {
  align-items: center;
  border-top: 1px var(--theme-bookmark-divider-color) solid;
  color: var(--theme-bookmark-link-color);
}

.bookmark-path {
  color: var(--theme-bookmark-link-color);
  font-size: 14px;
}

.bookmark-score {
  color: var(--theme-selected-start);
  margin-right: 16px;
}

.bookmark-title,
.bookmark-url {
  flex: 1;
  height: 24px;
}

.bookmark-url:hover {
  color: var(--theme-bookmark-link-hover-color);
  text-decoration: underline;
}

.bookmark-favicon {
  width: 16px;
  height: 16px;
}

.item-controls {
  visibility: hidden;
  cursor: pointer;
}

</style>
