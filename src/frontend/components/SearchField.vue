<template lang="html">
  <div id="inputWrapper" class="col-xs-12">
    <input id="input" type="text" class="col-xs-12" @input="onInput" />
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
    }
  }
};
</script>

<style lang="css">
</style>
