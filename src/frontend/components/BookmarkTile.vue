<template lang="html">
  <div class="bookmark-tile col-3 left overflow-hidden border-box my1">
    <a :href="bookmark.url" class="block bookmark-tile-cell mx1 text-decoration-underline">
      <div class="grid-item-wrapper container-background px1 py2 border-box">
        <img class="block mb1" :src="bookmark.favicon" />
        <span>{{ bookmark.title }}</span>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: ['bookmark']
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

</style>
