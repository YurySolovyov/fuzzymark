<template lang="html">
  <div class="overlay-page">
    <div class="overlay-container">
      <h1 class="page-title">Background</h1>
      <input
        type="file"
        class="hidden"
        ref="input"
        @change="onFileSelect" />
      <metro-button
        type="button"
        class="mt-6 inline-flex items-center"
        v-if="showCurrentWallpaper"
        @click="onClear">
        Clear current image
      </metro-button>
      <metro-button
        type="button"
        class="mt-6 inline-flex items-center"
        v-else
        @click="onSelectClick">
        <template v-if="showSelectButton"> Select image </template>
        <template v-else-if="showAcceptButton"> Select other image </template>
      </metro-button>
      <div
        class="mt-6 grid grid-cols-2 gap-6"
        v-if="showAcceptButton || showCurrentWallpaper">
        <div>
          <h2 class="section-title mb-3">Opacity</h2>
          <div class="flex flex-wrap gap-x-4 gap-y-3">
            <metro-button
              type="button"
              v-for="option in opacityOptions"
              :key="option.value"
              :active="opacity === option.value"
              @click="setOpacity(option.value)">
              {{ option.label }}
            </metro-button>
          </div>
        </div>
        <div>
          <h2 class="section-title mb-3">Fit</h2>
          <div class="flex flex-wrap gap-x-4 gap-y-3">
            <metro-button
              type="button"
              v-for="option in fitModeOptions"
              :key="option.value"
              :active="fitMode === option.value"
              @click="setFitMode(option.value)">
              {{ option.label }}
            </metro-button>
          </div>
        </div>
      </div>
      <div
        v-if="showCurrentWallpaper"
        class="mt-6 py-2"
        :style="{ opacity: wallpaperOpacity }">
        <img
          class="block h-auto w-full"
          :src="currentWallpaperUrl" />
      </div>
      <div
        v-if="showPreview"
        class="mt-6 py-2 transition-opacity duration-300 will-change-[opacity]"
        :style="{ opacity }">
        <img
          class="block h-auto w-full"
          :src="previewUrl"
          ref="preview" />
      </div>
      <metro-button
        type="button"
        class="mt-6 inline-flex items-center"
        v-if="showAcceptButton"
        @click="onSet">
        Looks Good
      </metro-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import MetroButton from './MetroButton.vue';
import { useAppStore } from '../stores/app';

const opacityOptions = [
  { value: 0.1, label: '0.1' },
  { value: 0.25, label: '0.25' },
  { value: 0.5, label: '0.5' },
  { value: 0.75, label: '0.75' },
  { value: 1, label: 'opaque' },
];

const fitModeOptions = [
  { value: 'center', label: 'Center' },
  { value: 'fill', label: 'Fill' },
  { value: 'fit', label: 'Fit' },
  { value: 'tile', label: 'Tile' },
];

export default {
  components: {
    MetroButton,
  },
  data() {
    return {
      opacityOptions,
      fitModeOptions,
      opacity: 0.75,
      fitMode: 'fill',
      showPreview: false,
      previewUrl: '',
    };
  },
  computed: {
    ...mapState(useAppStore, ['hasWallpaper', 'wallpaper', 'wallpaperOpacity', 'wallpaperFitMode']),
    currentWallpaperUrl() {
      if (!this.wallpaper) return '';
      return this.wallpaper.replace(/^url\(/, '').replace(/\)$/, '');
    },
    showCurrentWallpaper() {
      return this.hasWallpaper && !this.showPreview;
    },
    showSelectButton() {
      return this.previewUrl.length === 0;
    },
    showAcceptButton() {
      return !this.showSelectButton;
    },
  },
  created() {
    if (this.wallpaperFitMode) {
      this.fitMode = this.wallpaperFitMode;
    }
    if (this.wallpaperOpacity) {
      this.opacity = this.wallpaperOpacity;
    }
  },
  beforeUnmount() {
    this.revokePreviewUrl();
  },
  methods: {
    ...mapActions(useAppStore, [
      'saveWallpaper',
      'saveWallpaperOpacity',
      'saveWallpaperFitMode',
      'clearWallpaper',
    ]),
    loadImage(url) {
      return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Failed to load selected image.'));
        image.src = url;
      });
    },
    revokePreviewUrl() {
      if (this.previewUrl !== '') {
        URL.revokeObjectURL(this.previewUrl);
      }
    },
    setOpacity(value) {
      this.opacity = value;
      if (this.hasWallpaper && !this.showPreview) {
        this.saveWallpaperOpacity(value);
      }
    },
    setFitMode(value) {
      this.fitMode = value;
      if (this.hasWallpaper && !this.showPreview) {
        this.saveWallpaperFitMode(value);
      }
    },
    onSelectClick() {
      this.$refs.input.click();
    },
    onFileSelect(e) {
      const [file, ..._rest] = e.target.files;
      if (!file) {
        return;
      }

      this.revokePreviewUrl();
      this.showPreview = true;
      this.previewUrl = URL.createObjectURL(file);
    },
    async onClear() {
      await this.clearWallpaper();
    },
    async onSet() {
      if (this.previewUrl === '') {
        return;
      }

      const { width, height } = window.screen;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      canvas.width = width;
      canvas.height = height;

      const image = await this.loadImage(this.previewUrl);

      ctx.drawImage(image, 0, 0, width, height);

      const dataURL = canvas.toDataURL('image/webp');
      const wallpaper = `url(${dataURL})`;

      await Promise.all([
        this.saveWallpaper(wallpaper),
        this.saveWallpaperOpacity(this.opacity),
        this.saveWallpaperFitMode(this.fitMode),
      ]);
      this.revokePreviewUrl();
      this.previewUrl = '';
      this.showPreview = false;
      this.$router.push({ name: 'root' });
    },
  },
};
</script>
