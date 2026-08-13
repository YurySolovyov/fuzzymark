<template lang="html">
  <div
    ref="element"
    class="min-h-44 overflow-hidden"
    :class="{ 'opacity-50': isDragging }">
    <bookmark-tile
      :bookmark="bookmark"
      :drag-handle-ref="setHandle"
      :dragging="isDragging" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useSortable } from '@dnd-kit/vue/sortable';

import BookmarkTile from './BookmarkTile.vue';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const element = ref(null);
const handle = ref(null);

const setHandle = (handleElement) => {
  handle.value = handleElement ?? null;
};

const { isDragging } = useSortable({
  id: computed(() => props.bookmark.id),
  index: computed(() => props.index),
  element,
  handle,
  transition: {
    duration: 180,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
});
</script>
