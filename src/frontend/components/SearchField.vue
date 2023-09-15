<template lang="html">
  <div id="inputWrapper" class="lg-col-6 md-col-8 sm-col-10 mx-auto pt2">
    <input class="col-12 border-box border-none font-family-inherit font-light container-background input px2"
      id="input"
      type="text"
      placeholder="Type to search for bookmarks..."
      spellcheck="false"
      :value="inputValue"
      @input="onInput"
      @keydown.down.prevent="onSelect('next')"
      @keydown.up.prevent="onSelect('prev')"
      @keydown.enter="onOpen"
      @keydown.esc="onReset"/>
  </div>
</template>

<script>
import messageService from '../message-service';
import { mapState, mapGetters } from 'vuex';

const state = mapState(['inputValue']);
const getters = mapGetters(['selectedBookmark', 'openNew']);

export default {
  computed: { ...getters, ...state },
  methods: {
    onInput(e) {
      this.$store.dispatch('updateInputValue', e.target.value);
    },
    onSelect(direction) {
      const delta = direction === 'next' ? 1 : -1;
      this.$store.dispatch('updateSelectedIndex', delta);
    },
    onOpen() {
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
      this.$store.dispatch('resetInput');
    },
    onFocus() {
      this.$el.querySelector('input').focus();
    }
  },
  mounted() {
    this.onFocus();
    window.onfocus = () => this.onFocus();
    messageService.on('focus', () => this.onFocus());
  }
};
</script>
