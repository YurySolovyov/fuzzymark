<template lang="html">
  <tile-link
    :href="bookmark.valid ? bookmark.url : '#'"
    :invalid="!bookmark.valid">
    <bookmark-surface
      class="flex h-full flex-col gap-2 px-3 pt-4 pb-1"
      :class="bookmark.valid ? 'group-hover/tile:border-transparent' : 'opacity-65'"
      :tint-color="faviconColor">
      <favicon
        classes="mb-2 block size-6 shrink-0"
        :url="bookmark.favicon"
        @gotColor="onFaviconColor" />
      <div class="min-h-0 flex-1 wrap-break-word">
        {{ bookmark.title }}
      </div>
      <div
        class="mt-2 text-sm text-(--theme-selected-start)"
        v-if="!bookmark.valid">
        Invalid URL
      </div>
      <tile-controls
        :dragging="dragging"
        :move-handle-ref="dragHandleRef"
        @delete="onDelete"
        @edit="onEdit" />
    </bookmark-surface>
  </tile-link>
</template>

<script>
import TileLink from './TileLink.vue';
import TileControls from './TileControls.vue';
import Favicon from './Favicon.vue';
import BookmarkSurface from './BookmarkSurface.vue';

export default {
  components: {
    TileLink,
    TileControls,
    Favicon,
    BookmarkSurface,
  },
  props: {
    bookmark: {
      type: Object,
      required: true,
    },
    dragHandleRef: {
      type: [Function, Object],
      default: undefined,
    },
    dragging: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      faviconColor: null,
    };
  },
  methods: {
    onFaviconColor(color) {
      this.faviconColor = color;
    },
    onDelete() {
      this.$router.push({
        name: 'delete-tile',
        params: { id: this.bookmark.id },
      });
    },
    onEdit() {
      this.$router.push({
        name: 'edit-tile',
        params: { id: this.bookmark.id },
      });
    },
  },
};
</script>
