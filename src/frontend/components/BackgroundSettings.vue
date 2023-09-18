<template lang="html">
  <div class="overlay top-0 left-0 overflow-scroll">
    <div class="lg-col-6 md-col-8 sm-col-10 mx-auto">
      <h1 class="overlay-title font-light">
        Background
      </h1>
      <input type="file" class="hide" ref="input" @change="onFileSelect">
      <a
        class="big-link text-decoration-none font-light mt3"
        href="#"
        @click.prevent="onSelectClick">
        <template v-if="showSelectButton">
          Select image
        </template>
        <template v-else-if="showAcceptButton">
          Select other image
        </template>
      </a>
      <div class="opacity-control" v-if="showAcceptButton">
        <h2 class="font-light">
          Opacity:
          <span :class="{ active: opacity === 0.1 }" @click="setOpacity(0.1)">0.1</span>
          <span :class="{ active: opacity === 0.25 }" @click="setOpacity(0.25)">0.25</span>
          <span :class="{ active: opacity === 0.5 }" @click="setOpacity(0.5)">0.5</span>
          <span :class="{ active: opacity === 0.75 }" @click="setOpacity(0.75)">0.75</span>
          <span :class="{ active: opacity === 1 }" @click="setOpacity(1)">opaque</span>
        </h2>
      </div>
      <div class="preview py2" :style="{ opacity }">
        <img class="fit" :src="previewUrl" v-if="showPreview" ref="preview">
      </div>
      <a
        class="big-link text-decoration-none font-light mt3"
        href="#"
        v-if="showAcceptButton"
        @click.prevent="onSet">Looks Good</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      opacity: 0.75,
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
    setOpacity(value) {
      this.opacity = value;
    },
    onSelectClick() {
      this.$refs.input.click();
    },
    onFileSelect(e) {
      const [file, ..._rest] = e.target.files;
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

      this.$store.dispatch('saveWallpaper', wallpaper);
      this.$store.dispatch('saveWallpaperOpacity', this.opacity);
      this.$router.push({ name: 'root' });
    }
  }
};
</script>

<style lang="css">

.preview {
  transition: opacity 0.3s;
  will-change: opacity;
}

.opacity-control span {
  color: var(--theme-bookmark-link-color);
  cursor: pointer;
}

.opacity-control .active {
  color: var(--theme-selected-start);
}
</style>
