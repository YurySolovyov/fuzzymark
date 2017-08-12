<template lang="html">
  <div class="bookmark-tile col-3 left overflow-hidden border-box my1">
    <a :href="bookmark.url" class="block bookmark-tile-cell mx1 text-decoration-underline">
      <div class="grid-item-wrapper container-background px1 py2 border-box overflow-hidden">
        <img class="block mb1" :src="bookmark.favicon" />
        <span>{{ bookmark.title }}</span>
        <tile-controls
          @delete="onDelete"
          @edit="onEdit"></tile-controls>
      </div>
    </a>
  </div>
</template>

<script>

import TileControls from './TileControls.vue';

export default {
  components: {
    TileControls
  },
  props: ['bookmark'],
  methods: {
    onDelete() {
      this.$router.push({
        name: 'delete-tile',
        params: { id: this.bookmark.id }
      });
    },
    onEdit() {
      this.$router.push({
        name: 'edit-tile',
        params: { id: this.bookmark.id }
      });
    },
  }
}
</script>

<style lang="css">

.bookmark-tile {
  height: 200px;
}

.bookmark-tile-cell {
  padding: 2px;
  font-size: 16px;
  height: 100%;
  color: var(--theme-bookmark-link-color);
}

.bookmark-tile-cell:hover {
  background-image: linear-gradient(to right, var(--theme-selected-start) 0%,var(--theme-selected-end) 100%);
}
.bookmark-tile-cell:hover .grid-item-wrapper {
  background-color: var(--theme-selected-bg-color);
}

.grid-item-wrapper {
  transition: 0.3s;
  height: calc(100% - 0.25em);
}

.grid-item-deleting button {
  background: transparent;
  font-size: 16px;
  color: var(--theme-bookmark-link-color);
}

.grid-item-deleting button:hover {
  text-decoration: underline;
}

</style>
