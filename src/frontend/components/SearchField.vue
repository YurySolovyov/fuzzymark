<template lang="html">
  <div id="inputWrapper" class="col-xs-12">
    <input id="input" type="text" class="col-xs-12"
      @input="onInput"
      @keydown.down.prevent="onSelect('next')"
      @keydown.up.prevent="onSelect('prev')" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

const mappedState = mapState(['inputValue']);

export default {
  computed: mappedState,
  methods: {
    onInput(e) {
      this.$store.dispatch('updateInputValue', e.target.value);
    },
    onSelect(direction) {
      const delta = direction === 'next' ? 1 : -1;
      this.$store.dispatch('updateSelectedIndex', delta);
    }
  }
};
</script>

<style lang="css">
</style>
