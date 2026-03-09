<template lang="html">
  <div class="overlay-page">
    <div
      class="overlay-container"
      v-if="currentTile">
      <h1 class="page-title">
        {{ formTitle }}
      </h1>
      <input
        class="form-input my-4 md:w-2/3"
        type="text"
        v-model="currentTile.title"
        placeholder="Title"
        name="title" />
      <input
        class="form-input my-4 md:w-2/3"
        type="text"
        v-model="currentTile.url"
        placeholder="Url"
        name="url" />
      <div
        class="mt-2 text-(--theme-selected-start)"
        v-if="currentTile.url && !isUrlValid">
        Enter a valid bookmark URL.
      </div>
      <metro-button
        type="button"
        class="mt-6 inline-flex items-center"
        :disabled="!isUrlValid"
        @click="onSubmit">
        Looks Good
      </metro-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import { v4 as uuid } from 'uuid';
import MetroButton from './MetroButton.vue';
import { useAppStore } from '../stores/app';
import { parseInputUrl } from '../../shared/bookmark-url.js';

export default {
  components: {
    MetroButton,
  },
  data() {
    return {
      newTileStub: {
        title: '',
        url: '',
      },
    };
  },

  computed: {
    currentTile() {
      if (this.newTile) {
        return this.newTileStub;
      } else {
        const id = this.$route.params.id;
        return this.tiles.find((t) => t.id === id);
      }
    },

    id() {
      if (this.newTile) {
        return uuid();
      } else {
        return this.currentTile.id;
      }
    },

    submitEvent() {
      return this.newTile ? 'saveNewTile' : 'saveTile';
    },

    newTile() {
      return this.$route.name === 'new-tile';
    },

    formTitle() {
      return this.newTile ? 'New Tile' : 'Edit Tile';
    },

    parsedUrl() {
      return parseInputUrl(this.currentTile?.url);
    },

    isUrlValid() {
      return this.parsedUrl[0];
    },

    ...mapState(useAppStore, ['tiles']),
  },

  methods: {
    ...mapActions(useAppStore, ['saveNewTile', 'saveTile']),
    async onSubmit() {
      if (!this.isUrlValid) {
        return;
      }

      const saved = await this[this.submitEvent]({
        id: this.id,
        tile: {
          title: this.currentTile.title,
          url: this.parsedUrl[1],
        },
      });

      if (saved !== false) {
        this.$router.push({ name: 'root' });
      }
    },
  },
};
</script>
