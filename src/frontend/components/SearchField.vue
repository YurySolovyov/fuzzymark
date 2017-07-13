<template lang="html">
  <div id="inputWrapper" class="col-xs-12">
    <input id="input" type="text" class="col-xs-12"
      placeholder="Type to search for bookmarks..."
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

const mappedState = mapState(['inputValue']);
const mappedGetters = mapGetters(['selectedBookmark']);

export default {
  computed: Object.assign({}, mappedState, mappedGetters),
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
      messageService.send({ type: 'open_tab', url: url });
    },
    onReset() {
      this.$store.dispatch('updateInputValue', '');
    },
    onFocus() {
      this.$el.querySelector('input').focus();
    }
  },
  mounted() {
    this.onFocus();
    window.onfocus = () => this.onFocus();
    messageService.listen({ focus: () => this.onFocus() });
  }
};
</script>

<style lang="css">
</style>
