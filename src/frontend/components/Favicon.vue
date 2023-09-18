<template lang="html">
  <img
    alt="Favicon"
    height="16"
    width="16"
    ref="image"
    :src="iconUrl"
    :class="classes"
    @load="onLoaded"
    @error="onError">
</template>

<script>
import Vibrant from 'node-vibrant';

// Yellow star
const fallbackColor = '#FDD835';
const fallbackUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAkFBMVEUAAAD//wD//wD/zDP/2yT/4zn/zDP/2zf/1Dn/2zH/2zf/3DX/1DP/2jj/2Tb/1zX71zf71zb82TT81zT82TT81zT92TT91zT91zb92DX91zb92DX92DX92Tb92DX92DX91zX+2Db+2DX+2TX81zX82TX92DX92DX92DX92DX92Db92DX92DX92DX92DX92DX1S+NVAAAAL3RSTlMAAQIFBwkKDhIVHB0eKT0/RkdKU1hZa2xtb4CDkZOkpaersrPBx9PX2drg4fL1/WPUesYAAAB8SURBVHjajc3ZDoIwEIXhQRAQBaGVRXBlc4Xz/m8HSbElNTH+N5P5bg79yHG+KEt1MW6PhUYREGpUAaV8bD/gSdEDfZHwwLdHcmvMalY0Zp2VXJfTWv6Rg1o9TkKqi6DTjF6Cnko2wD3atsBaUtzlFpG5f+8kMU9cj9HfDTChD+RtCZhuAAAAAElFTkSuQmCC';

export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    classes: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iconUrl: this.url,
      fetchedValidIcon: false
    };
  },
  methods: {
    onError() {
      this.iconUrl = fallbackUrl;
      this.onLoaded();
    },
    async onLoaded() {
      const needsColorExtraction = this.iconUrl !== fallbackUrl && this.isValid();
      const color = needsColorExtraction ? await this.selectPaletteColor() : fallbackColor;
      this.fetchedValidIcon = color !== undefined;
      this.emitColor(this.fetchedValidIcon ? color : fallbackColor);
    },
    async selectPaletteColor() {
      const palette = await Vibrant.from(this.$refs.image).getPalette();
      
      return (palette.Vibrant ||
              palette.LightVibrant ||
              palette.Muted ||
              palette.LightMuted ||
              palette.DarkMuted ||
              palette.DarkVibrant).getHex();
    },
    emitColor(color) {
      this.$emit('gotColor', color);
    },
    isValid() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = this.$refs.image;

      if (!img) {
        return false;
      }
      
      ctx.drawImage(img, 0, 0);
      // valid non-empty icons have some pixel values > 0
      return ctx.getImageData(0, 0, 16, 16).data.some(val => val > 0);
    }
  },
  mounted() {
    if (this.iconUrl === fallbackUrl) {
      this.iconUrl = this.url;
    }
  }
};
</script>
