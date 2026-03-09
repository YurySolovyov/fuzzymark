<template lang="html">
  <div class="overlay-page">
    <div class="overlay-container">
      <h1 class="page-title">Are You Sure?</h1>
      <metro-button
        type="button"
        class="mt-6 block text-left"
        @click="deleteSubmit">
        Yes
      </metro-button>
      <metro-button
        tag="router-link"
        class="mt-4 block"
        to="/">
        No
      </metro-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia';

import MetroButton from './MetroButton.vue';
import { useAppStore } from '../stores/app';

export default {
  components: {
    MetroButton,
  },
  methods: {
    ...mapActions(useAppStore, ['deleteTile']),
    async deleteSubmit() {
      await this.deleteTile({
        id: this.$route.params.id,
      });

      this.$router.push({ name: 'root' });
    },
  },
};
</script>
