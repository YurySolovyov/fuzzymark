<template lang="html">
  <div
    class="mx-auto my-6 w-5/6"
    v-if="hasBookmarks"
    @wheel="onScroll">
    <div
      class="mb-4 flex flex-wrap items-center justify-center gap-2"
      v-if="needsPagedGrid">
      <button
        type="button"
        class="flex size-8 items-center justify-center border-2 border-transparent bg-(--container-bg-color) font-inherit text-(--input-text-color) font-thin transition-[border-color,color] duration-300 hover:border-(--theme-selected-start) hover:text-(--theme-selected-start)"
        :class="{
          'border-(--theme-selected-start) text-(--theme-selected-start)': currentPage + 1 === page,
        }"
        v-for="page in pagesCount"
        :key="page"
        @click="onPageClick(page)">
        {{ page }}
      </button>
    </div>
    <drag-drop-provider @dragEnd="onDragEnd">
      <div class="grid grid-cols-3 gap-4 xl:grid-cols-4 2xl:grid-cols-5">
        <sortable-bookmark-tile
          v-for="(bookmark, index) in pageBookmarks"
          :key="bookmark.id"
          :bookmark="bookmark"
          :index="index" />
      </div>
    </drag-drop-provider>
  </div>
  <div
    v-else
    class="mx-auto w-5/6 pt-12 text-center text-(--input-text-color)">
    <h1 class="page-title">
      No pinned tiles yet, try adding one by clicking plus icon on the left
    </h1>
  </div>
</template>

<script>
import { DragDropProvider } from '@dnd-kit/vue';
import { isSortable } from '@dnd-kit/vue/sortable';
import { move } from '@dnd-kit/helpers';
import { computed, ref, watch } from 'vue';

import SortableBookmarkTile from './SortableBookmarkTile.vue';
import { chunk } from 'lodash'; // TODO: write our chunk
import { useAppStore } from '../stores/app';

const tilesPerPage = 12;

export default {
  components: {
    DragDropProvider,
    SortableBookmarkTile,
  },
  props: {
    bookmarks: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const appStore = useAppStore();
    const currentPage = ref(0);
    const hasBookmarks = computed(() => props.bookmarks.length > 0);
    const needsPagedGrid = computed(() => props.bookmarks.length > tilesPerPage);
    const bookmarksPaged = computed(() => chunk(props.bookmarks, tilesPerPage));
    const pagesCount = computed(() => bookmarksPaged.value.length);
    const pageBookmarks = ref([]);

    const bookmarksPage = computed(() => bookmarksPaged.value[currentPage.value] || []);

    const onDragEnd = (event) => {
      if (event.canceled) {
        return;
      }

      const { source } = event.operation;

      if (!isSortable(source) || source.initialIndex === source.index) {
        return;
      }

      const pageOffset = currentPage.value * tilesPerPage;

      pageBookmarks.value = move(pageBookmarks.value, event);
      appStore.saveMovedTiles({
        oldIndex: pageOffset + source.initialIndex,
        newIndex: pageOffset + source.index,
      });
    };

    watch(
      bookmarksPage,
      (value) => {
        pageBookmarks.value = [...value];
      },
      { immediate: true },
    );

    watch(pagesCount, (value) => {
      if (value <= currentPage.value && currentPage.value !== 0) {
        currentPage.value = Math.max(0, value - 1);
      }
    });

    return {
      currentPage,
      hasBookmarks,
      needsPagedGrid,
      onDragEnd,
      pageBookmarks,
      pagesCount,
    };
  },
  methods: {
    onScroll(e) {
      if (e.deltaY > 0) {
        this.currentPage = Math.min(this.pagesCount - 1, this.currentPage + 1);
      } else {
        this.currentPage = Math.max(0, this.currentPage - 1);
      }
    },
    onPageClick(page) {
      this.currentPage = page - 1;
    },
  },
};
</script>
