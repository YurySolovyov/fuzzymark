<template lang="html">
  <img :src="url" alt="" :class="customClass" height="16" width="16" ref="image" @load="onLoaded" />
</template>

<script>

import * as Vibrant from 'node-vibrant';

const getColors = function(image) {
  return new Promise(function(resolve, reject) {
    const vib = new Vibrant(image);
    vib.getPalette(function(err, pal) {
      if (err) { reject(err); return; }
      resolve(pal);
    });
  });
};

export default {
  props: {
    url: String,
    customClass: String
  },
  methods: {
    maybeSetColor() {
      // TODO: Fix this
      // if (this.faviconValid()) {
      //   this.setColor();
      // } else {
      //   this.favicon = 'chrome://favicon/http://localhost/';
      // }
    },
    onLoaded() {

    },
    selectPalette() {
      const palettes = await getColors(this.$refs.image);
      const palette = palettes.Muted ||
                      palettes.Vibrant ||
                      palettes.LightVibrant ||
                      palettes.LightMuted ||
                      palettes.DarkMuted ||
                      palettes.DarkVibrant;
      const color = palette.getHex();
    }
    whenColorReady() {
      this.$emit('gotColor');
    },
    isValid() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = this.$refs.image;
      ctx.drawImage(img, 0, 0);
      // valid non-empty icons have some pixel values > 0
      return ctx.getImageData(0, 0, 16, 16).data.some(val => val > 0);
    }
  }
};
</script>
