<template lang="html">
  <section class="overflow-hidden col-4 left">
    <h3 class="m0 mb1">{{ title }}</h3>
    <span class="select p1 inline-block center" v-for="(value, index) in values"
      :class="{ active: isActiveSetting(name, value) }"
      @click="onClick(name, value)">{{ valueLabels[index] }}</span>
  </section>
</template>

<script>
export default {
  props: [
    'title',
    'name',
    'active-value',
    'values',
    'value-labels'
  ],
  methods: {
    isActiveSetting(key, value) {
      return this.activeValue === value;
    },
    onClick(name, value) {
      this.$emit('save', name, value);
    }
  }
}
</script>

<style lang="css">

.select {
  cursor: pointer;
  min-width: 64px;
  background-color: var(--theme-selected-bg-color);
}

.select.active {
  background-color: var(--theme-selected-start);
}

</style>
