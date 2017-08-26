<template lang="html">
  <div class="overlay top-0 left-0">
    <div class="lg-col-6 md-col-8 sm-col-10 mx-auto">
      <h1 class="overlay-title font-light">Background</h1>
      <input type="file" class="hide" ref="input" @change="onFileSelect" />
      <a class="big-link text-decoration-none font-light mt3"
        href="#"
        @click.prevent="onSelectClick">
        <template v-if="showSelectButton">
          Select image
        </template>
        <template v-else-if="showAcceptButton">
          Select other image
        </template>
      </a>
      <div class="preview py2">
        <img class="fit" :src="previewUrl" v-if="showPreview" ref="preview" />
      </div>
      <a class="big-link text-decoration-none font-light mt3"
        href="#"
        v-if="showAcceptButton"
        @click.prevent="onSet">Looks Good</a>
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import wallpaperManager from '../wallpaper-manager';

export default {
  data() {
    return {
      showPreview: false,
      previewUrl: ''
    };
  },
  computed: {
    showSelectButton() {
      return this.previewUrl.length === 0;
    },
    showAcceptButton() {
      return !this.showSelectButton;
    }
  },
  methods: {
    onSelectClick() {
      this.$refs.input.click();
    },
    onFileSelect(e) {
      const [file, ...rest] = e.target.files;
      if (!file) { return; }

      this.showPreview = true;
      this.previewUrl = URL.createObjectURL(file);
    },
    onSet() {
      const { width, height } = window.screen;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();

      image.width = width;
      image.height = height;
      image.src = this.previewUrl;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);

      const dataURL = canvas.toDataURL('image/webp');
      const wallpaper = `url(${dataURL})`;

      wallpaperManager.save(wallpaper);
    }
  }
};
</script>

<style lang="css">
</style>
