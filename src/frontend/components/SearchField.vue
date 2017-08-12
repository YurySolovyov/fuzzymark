<template lang="html">
  <div id="inputWrapper" class="lg-col-6 md-col-8 sm-col-10 mx-auto">
    <input id="input" type="text" class="col-12 border-box border-none font-family-inherit container-background"
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
  computed: Object.assign({}, getters, state),
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
      if (this.openNew) {
        messageService.send({ type: 'open_tab', url: url });
      } else {
        window.location.assign(url);
      }
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

#input {
  color: var(--input-text-color);
  padding: 0 15px;
  font-size: 24px;
  height: 80px;
  line-height: 80px;
  font-weight: 100;
  outline: none;
  border-color: var(--theme-selected-start);
}

#input:focus {
  outline: none;
}

</style>
