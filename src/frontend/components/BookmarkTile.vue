<template lang="html">
  <div class="bookmark-tile col-3 left overflow-hidden border-box my1">
    <a :href="bookmark.url" class="block bookmark-tile-cell mx1 text-decoration-underline">
      <div class="grid-item-wrapper container-background px1 py2 border-box overflow-hidden flex flex-column"
        :style="{ 'border-color': color }">
        <img class="block mb1 bookmark-tile-icon"
          height="16"
          width="16"
          ref="image"
          :src="favicon"
          @load="maybeSetColor"/>
        <div>{{ bookmark.title }}</div>
        <tile-controls
          @delete="onDelete"
          @edit="onEdit"></tile-controls>
      </div>
    </a>
  </div>
</template>

<script>

import TileControls from './TileControls.vue';

import * as Vibrant from 'node-vibrant';

const getColors = function(image) {
  return new Promise(function(resolve, reject) {
    const vib = new Vibrant(image);
    vib.getPalette(function(err, pal) {
      if (err) { reject(err) }
      resolve(pal);
    });
  });
};

export default {
  data() {
    return {
      favicon: '',
      color: null
    };
  },
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
    maybeSetColor() {
      if (this.faviconValid()) {
        this.setColor();
      } else {
        this.favicon = 'chrome://favicon/http://localhost/';
      }
    },
    async setColor() {
      const palettes = await getColors(this.$refs.image);
      const palette = palettes.Muted ||
                      palettes.Vibrant ||
                      palettes.LightVibrant ||
                      palettes.LightMuted ||
                      palettes.DarkMuted ||
                      palettes.DarkVibrant;
      const color = palette.getHex();
      this.color = color;
    },
    faviconValid() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = this.$refs.image;
      ctx.drawImage(img, 0, 0);
      // valid non-empty icons have some pixel values > 0
      return ctx.getImageData(0, 0, 16, 16).data.some(val => val > 0);
    }
  },
  mounted() {
    this.favicon = this.bookmark.favicon;
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
  border-color: transparent!important;
}

.grid-item-wrapper {
  transition: 0.3s;
  height: calc(100% - 0.25em);
  border-top: 2px transparent solid;
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
