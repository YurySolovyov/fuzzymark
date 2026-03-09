import { defineStore } from 'pinia';

import pinia from './index';
import settings from '../settings';
import bookmarksCollection from '../bookmarks/collection';
import matchedBookmarks from '../bookmarks/matched';
import recentBookmarks from '../bookmarks/recent';
import tileBookmarks from '../bookmarks/tiles';
import messageService from '../message-service';
import wallpaperManager from '../wallpaper-manager';

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light',
    systemTheme: getSystemTheme(),
    allBookmarks: null,
    tiles: null,
    inputValue: '',
    settings: {},
    selectedIndex: 0,
    wallpaper: '',
    wallpaperOpacity: 0,
    wallpaperFitMode: 'fill',
  }),
  getters: {
    hasInputValue: (state) => state.inputValue !== '',
    bookmarkSettings(state) {
      return {
        ...state.settings,
        selectedIndex: state.selectedIndex,
      };
    },
    bookmarks(state) {
      if (this.hasInputValue) {
        return matchedBookmarks.filter(state.allBookmarks, state.inputValue, this.bookmarkSettings);
      }

      if (this.showGrid) {
        return state.tiles;
      }

      return recentBookmarks.filter(state.allBookmarks, this.bookmarkSettings);
    },
    maxResults: (state) => state.settings.maxResults,
    propertyKey: (state) => state.settings.propertyKey,
    openNew: (state) => state.settings.openNew,
    showChromeUrls: (state) => state.settings.showChromeUrls,
    accent: (state) => state.settings.accent,
    bookmarkSurfaceStyle: (state) => state.settings.bookmarkSurfaceStyle,
    effectiveTheme(state) {
      if (state.theme === 'system') {
        return state.systemTheme;
      }

      return state.theme;
    },
    selectedBookmark(state) {
      return this.bookmarks[state.selectedIndex];
    },
    showGrid: (state) => state.settings.initialComponent === 'my',
    hasWallpaper: (state) => state.wallpaper !== '',
    wallpaperFitClasses(state) {
      const classes = {
        center: 'bg-auto bg-center bg-no-repeat',
        fill: 'bg-cover bg-center bg-no-repeat',
        fit: 'bg-contain bg-center bg-no-repeat',
        tile: 'bg-auto bg-left-top bg-repeat',
      };
      return classes[state.wallpaperFitMode] || classes.fill;
    },
    showRecent: (state) => state.settings.initialComponent === 'recent',
    initialComponent: (state) => state.settings.initialComponent,
    initialFocus: (state) => state.settings.initialFocus,
    shouldDisplayBookmarksList() {
      return this.showRecent || this.hasInputValue;
    },
    appLoaded: (state) => state.allBookmarks !== null && state.tiles !== null,
  },
  actions: {
    async loadApp() {
      await this.loadSettings();
      await Promise.all([this.loadBookmarks(), this.loadWallpaper()]);
    },
    async loadSettings() {
      const settingsAll = await settings.fetchAll();
      this.updateSettings(settingsAll);
    },
    async loadBookmarks() {
      const result = await bookmarksCollection.load();
      this.allBookmarks = bookmarksCollection.transform(result, this.bookmarkSettings) || [];
      this.tiles = (await tileBookmarks.fetchAll()) || [];
    },
    async loadWallpaper() {
      const [wallpaper, opacity, fitMode] = await Promise.all([
        wallpaperManager.get(),
        wallpaperManager.getOpacity(),
        wallpaperManager.getFitMode(),
      ]);

      if (wallpaper) {
        this.wallpaper = wallpaper;
        this.wallpaperOpacity = opacity;
        this.wallpaperFitMode = fitMode || 'fill';
      }
    },
    updateInputValue(value) {
      this.inputValue = value;
      this.selectedIndex = 0;
    },
    resetInput() {
      this.updateInputValue('');
    },
    updateSelectedIndex(delta) {
      const maybeIndex = Math.min(Math.max(this.selectedIndex + delta, 0), this.maxResults - 1);
      this.selectedIndex = Number.isNaN(maybeIndex) ? 0 : maybeIndex;
    },
    updateSettings(settingsValue) {
      this.settings = settingsValue;
      this.theme = settingsValue.activeTheme === 'default' ? 'light' : settingsValue.activeTheme;
    },
    async saveSetting({ key, value }) {
      await messageService.send('set-setting', { key, value });
      this.settings[key] = value;
    },
    async setTheme(theme) {
      await this.saveSetting({ key: 'activeTheme', value: theme });
      this.theme = theme;
    },
    async saveNewTile({ id, tile }) {
      const saved = await tileBookmarks.saveNewTile(id, tile);

      if (!saved) {
        return false;
      }

      await this.loadBookmarks();
      return true;
    },
    async saveTile({ id, tile }) {
      const saved = await tileBookmarks.saveTile(id, tile);

      if (!saved) {
        return false;
      }

      await this.loadBookmarks();
      return true;
    },
    async deleteTile({ id }) {
      await tileBookmarks.deleteTile(id);
      await this.loadBookmarks();
    },
    async saveMovedTiles({ oldIndex, newIndex }) {
      const ids = this.tiles.map((tile) => tile.id);
      const [movedId] = ids.splice(oldIndex, 1);

      ids.splice(newIndex, 0, movedId);

      await tileBookmarks.saveTileIds(ids);
    },
    async clearWallpaper() {
      await wallpaperManager.clear();
      this.wallpaper = '';
      this.wallpaperOpacity = 0;
      this.wallpaperFitMode = 'fill';
    },
    async saveWallpaper(wallpaper) {
      await wallpaperManager.save(wallpaper);
      this.wallpaper = wallpaper;
    },
    async saveWallpaperOpacity(value) {
      await wallpaperManager.setOpacity(value);
      this.wallpaperOpacity = value;
    },
    async saveWallpaperFitMode(value) {
      await wallpaperManager.setFitMode(value);
      this.wallpaperFitMode = value;
    },
    setSystemTheme(systemTheme) {
      this.systemTheme = systemTheme;
    },
  },
});

const appStore = useAppStore(pinia);

messageService.on('storage-changed', function (message) {
  const keys = message.keys || [];
  if (keys.includes('tiles')) {
    appStore.loadBookmarks();
  }
  appStore.loadSettings();
});

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkModeMediaQuery.addEventListener('change', (event) => {
  const matches =
    event?.matches ??
    event?.target?.matches ??
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  appStore.setSystemTheme(matches ? 'dark' : 'light');
});
