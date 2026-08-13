<template lang="html">
  <div
    class="relative isolate overflow-hidden border border-transparent bg-(--bookmark-surface-solid-bg) shadow-none transition-[border-color,box-shadow,backdrop-filter,-webkit-backdrop-filter] duration-300 solid-active:bg-(--theme-selected-bg-color) blurred:border-(--bookmark-surface-blur-border) blurred:bg-(--bookmark-surface-blur-bg) blurred:shadow-[0_18px_44px_var(--bookmark-surface-shadow)] blurred:[backdrop-filter:blur(24px)_saturate(1.35)] blurred:[-webkit-backdrop-filter:blur(24px)_saturate(1.35)] blurred-active:border-(--bookmark-surface-blur-active-border) blurred-active:bg-(--bookmark-surface-blur-active-bg) blurred-active:[backdrop-filter:blur(32px)_saturate(1.45)] blurred-active:[-webkit-backdrop-filter:blur(32px)_saturate(1.45)]"
    :class="{ blurred: isBlurred, active }">
    <div
      class="-z-10 absolute inset-x-0 top-0 h-0.5"
      :style="{ backgroundColor: tintColor }" />
    <div
      class="-z-10 pointer-events-none absolute inset-0 bg-(--bookmark-surface-text-gradient) opacity-0 transition-opacity duration-300 in-blurred:opacity-100" />
    <slot />
  </div>
</template>

<script>
import { mapState } from 'pinia';

import { useAppStore } from '../stores/app';

export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    tintColor: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapState(useAppStore, ['bookmarkSurfaceStyle']),
    isBlurred() {
      return this.bookmarkSurfaceStyle === 'blurred';
    },
  },
};
</script>
