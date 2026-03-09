<template lang="html">
  <div
    class="overlay-page flex items-center justify-center"
    :class="splashClasses"
    id="splash">
    <h1 class="page-title flex items-center gap-3">
      <span>Loading your</span>
      <svg
        class="size-6 text-(--theme-bookmark-link-color) animate-[splash-spin_3s_linear_1]"
        viewBox="0 0 24 24">
        <path
          d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
      </svg>
      <span>stuff...</span>
    </h1>
  </div>
</template>

<script>
import { mapState } from 'pinia';

import { useAppStore } from '../stores/app';

export default {
  computed: {
    ...mapState(useAppStore, ['effectiveTheme']),
    splashClasses() {
      return {
        'theme-dark': this.effectiveTheme === 'dark',
        'theme-light': this.effectiveTheme === 'light',
      };
    },
  },
};
</script>
