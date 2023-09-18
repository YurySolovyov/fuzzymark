<template lang="html">
  <section class="overflow-hidden col-6 left mb2">
    <h3 class="m0">
      {{ title }}
    </h3>
    <span
      class="select big-link font-light mr1" v-for="(value, index) in values"
      :key="index"
      :class="{ active: isActiveSetting(name, value) }"
      @click="onClick(name, value)">{{ valueLabels[index] }}</span>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    values: {
      type: Array,
      required: true,
    },
    valueLabels: {
      type: Array,
      required: true,
    },
    activeValue: {
      type: [String, Number, Boolean],
      required: true,
    }
  },
  methods: {
    isActiveSetting(key, value) {
      return this.activeValue === value;
    },
    onClick(name, value) {
      this.$emit('save', name, value);
    }
  }
};
</script>
