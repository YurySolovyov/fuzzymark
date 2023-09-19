<template lang="html">
  <div id="grid" class="col-10 mx-auto my2" v-if="hasBookmarks" @mousewheel="onScroll">
    <div id="grid-pager" class="flex flex-column" v-if="needsPagedGrid">
      <div
        class="pager-button center my1"
        :class="{ current: currentPage + 1 === page }"
        v-for="page in pagesCount"
        :key="page"
        @click="onPageClick(page)">
        {{ page }}
      </div>
    </div>
    <draggable :list="bookmarksPage" @change="onSort" :options="{ handle: '.move' }" item-key="id">
      <template #item="{element}">
        <bookmark-tile :bookmark="element" />
      </template>
    </draggable>
  </div>
  <div v-else class="no-tiles-message center pt4">
    <h1 class="font-light">
      No pinned tiles yet, try adding one by clicking plus icon on the left
    </h1>
  </div>
</template>

<script>

import BookmarkTile from './BookmarkTile.vue';
import draggable from 'vuedraggable';
import { chunk } from 'lodash'; // TODO: write our chunk
const tilesPerPage = 12;

export default {
  components: {
    BookmarkTile,
    draggable
  },
  props: {
    bookmarks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentPage: 0
    };
  },
  computed: {
    hasBookmarks() {
      return this.bookmarks.length > 0;
    },
    needsPagedGrid() {
      return this.bookmarks.length > tilesPerPage;
    },
    bookmarksPaged() {
      return chunk(this.bookmarks, tilesPerPage);
    },
    pagesCount() {
      return this.bookmarksPaged.length;
    },
    bookmarksPage() {
      return this.bookmarksPaged[this.currentPage];
    }
  },
  methods: {
    onSort({ moved }) {
      this.$store.dispatch('saveMovedTiles', moved);
    },
    onScroll(e) {
      if (e.deltaY > 0) {
        this.currentPage = Math.min(this.pagesCount - 1, this.currentPage + 1);
      } else {
        this.currentPage = Math.max(0, this.currentPage - 1);
      }
    },
    onPageClick(page) {
      this.currentPage = page - 1;
    }
  },
  updated() {
    if (this.pagesCount <= this.currentPage && this.currentPage !== 0) {
      this.currentPage = this.pagesCount - 1;
    }
  }
};
</script>

<style lang="css">

#grid {
  height: calc(200px * 3 + 4em);
  overflow-y: hidden;
}

#grid-pager {
  position: absolute;
  left: 92%;
  height: calc(200px * 3 + 4em);
  justify-content: center;
}

#grid-pager .pager-button {
  color: var(--input-text-color);
  height: 32px;
  width: 32px;
  line-height: 32px;
  cursor: pointer;
  border: 2px transparent solid;
  border-radius: 100%;
  font-size: 16px;
  transition: border-color 0.3s;
  background-color: var(--container-bg-color);
}


#grid-pager .pager-button.current {
  border-color: var(--theme-selected-start);
  color: var(--theme-selected-start);
}

#grid-pager .pager-button:hover {
  border-color: var(--theme-selected-start);
}

.no-tiles-message h1 {
  font-size: 32px;
  color: var(--input-text-color);
}

</style>
