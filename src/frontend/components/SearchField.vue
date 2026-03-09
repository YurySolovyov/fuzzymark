<template lang="html">
  <div
    class="mx-auto w-5/6 pt-4 md:w-2/3 lg:w-1/2"
    id="inputWrapper">
    <input
      class="form-input h-20 leading-20"
      id="input"
      type="text"
      placeholder="Type to search for bookmarks..."
      spellcheck="false"
      :value="inputValue"
      @input="onInput"
      @keydown.down.prevent="onSelect('next')"
      @keydown.up.prevent="onSelect('prev')"
      @keydown.enter="onOpen"
      @keydown.esc="onReset" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import messageService from '../message-service';
import { useAppStore } from '../stores/app';

export default {
  computed: {
    ...mapState(useAppStore, ['inputValue', 'selectedBookmark', 'openNew', 'initialFocus']),
  },
  methods: {
    ...mapActions(useAppStore, ['updateInputValue', 'updateSelectedIndex', 'resetInput']),
    onInput(e) {
      this.updateInputValue(e.target.value);
    },
    onSelect(direction) {
      const delta = direction === 'next' ? 1 : -1;
      this.updateSelectedIndex(delta);
    },
    onOpen() {
      if (!this.selectedBookmark || !this.selectedBookmark.valid) {
        return;
      }

      const url = this.selectedBookmark.url;

      // chrome://* urls are new-tab only because of security
      if (this.openNew || url.startsWith('chrome://')) {
        messageService.send('open-tab', { url });
      } else {
        window.location.assign(url);
      }
      this.onReset();
    },
    onReset() {
      this.resetInput();
    },
    onFocus() {
      this.$el.querySelector('input').focus();
    },
  },
  mounted() {
    const search = new URLSearchParams(window.location.search);

    if (this.initialFocus === 'bookmarks') {
      if (search.get('bookmarks') === null) {
        window.location.search = '?bookmarks';
      } else {
        this.onFocus();
      }
    }

    window.addEventListener('focus', () => this.onFocus());
    messageService.on('focus', () => this.onFocus());
  },
};
</script>
