<template lang="html">
  <li
    class="group mb-1.25 mr-1.25 list-none p-0.5 text-base"
    :class="
      bookmark.selected
        ? 'selected bg-linear-to-r from-(--theme-selected-start) to-(--theme-selected-end)'
        : ''
    ">
    <bookmark-surface
      :active="bookmark.selected"
      class="p-2 [&_b]:font-inherit [&_b]:text-(--theme-selected-start)"
      :class="{ 'opacity-80': !bookmark.valid }">
      <div class="flex items-center gap-4 p-2 text-(--theme-header-color)">
        <span class="text-(--theme-selected-start)">{{ bookmark.score }}</span>
        <span
          class="h-6 min-w-0 flex-1 truncate"
          v-html="bookmark.wrappedTitle" />
        <span
          class="hidden max-w-[40%] shrink-0 truncate text-sm text-(--theme-bookmark-link-color) sm:block">
          {{ bookmark.path }}
        </span>
      </div>
      <div
        class="flex items-center gap-2 border-t border-(--theme-bookmark-divider-color) p-2 text-(--theme-bookmark-link-color)">
        <favicon
          classes="mr-1 size-4 shrink-0"
          :url="bookmark.favicon" />
        <a
          class="h-6 min-w-0 flex-1 truncate"
          :class="
            bookmark.valid
              ? 'hover:text-(--theme-bookmark-link-hover-color) hover:underline'
              : 'line-through'
          "
          :href="bookmark.valid ? bookmark.url : '#'"
          :aria-disabled="bookmark.valid ? 'false' : 'true'"
          @click="onUrlClick"
          v-html="bookmark.wrappedUrl" />
        <span
          class="mr-1 shrink-0 text-xs text-(--theme-selected-start)"
          v-if="!bookmark.valid">
          Invalid URL
        </span>
        <span class="shrink-0 cursor-pointer">
          <span
            title="Add to the New Tab page"
            class="transition-opacity duration-300"
            :class="!bookmark.valid ? 'cursor-not-allowed opacity-40' : ''"
            @click="onAddClick">
            <plus />
          </span>
        </span>
      </div>
    </bookmark-surface>
  </li>
</template>

<script>
import { mapActions } from 'pinia';

import { v4 as uuid } from 'uuid';
import Plus from './icons/Plus.vue';
import Favicon from './Favicon.vue';
import BookmarkSurface from './BookmarkSurface.vue';
import { useAppStore } from '../stores/app';

export default {
  components: {
    Favicon,
    Plus,
    BookmarkSurface,
  },
  props: {
    bookmark: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions(useAppStore, ['resetInput', 'saveNewTile']),
    onUrlClick(event) {
      if (!this.bookmark.valid) {
        event.preventDefault();
      }
    },
    onAddClick() {
      if (!this.bookmark.valid) {
        return;
      }

      this.resetInput();
      this.saveNewTile({
        id: uuid(),
        tile: {
          title: this.bookmark.title,
          url: this.bookmark.url,
        },
      });
    },
  },
};
</script>
