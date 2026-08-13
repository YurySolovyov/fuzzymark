<template lang="html">
  <div
    class="flex items-center gap-2 text-[11px] leading-none text-(--theme-bookmark-link-color)"
    v-if="formattedDate">
    <span class="uppercase tracking-[0.08em] opacity-55">{{ dateLabel }}</span>
    <span class="h-3 w-px bg-(--theme-bookmark-divider-color)" />
    <time
      class="font-medium tabular-nums opacity-80"
      :datetime="dateTime">
      {{ formattedDate }}
    </time>
  </div>
</template>

<script>
import { mapState } from 'pinia';

import formatShortDate, { formatDateTime } from '../date-formatter.js';
import { useAppStore } from '../stores/app';

const dateKeys = {
  created: 'dateAdded',
  lastUsed: 'dateLastUsed',
};

export default {
  props: {
    bookmark: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(useAppStore, ['showDate']),
    dateLabel() {
      return this.showDate === 'lastUsed' ? 'Last used' : 'Created';
    },
    dateTime() {
      const value = this.bookmark[dateKeys[this.showDate]];
      return formatDateTime(value);
    },
    formattedDate() {
      const value = this.bookmark[dateKeys[this.showDate]];
      return formatShortDate(value);
    },
  },
};
</script>
