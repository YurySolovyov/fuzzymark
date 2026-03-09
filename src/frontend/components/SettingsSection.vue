<template lang="html">
  <section class="mb-6 w-full pr-0 md:w-1/2 md:pr-6">
    <h3 class="mb-3 text-base font-thin">
      {{ title }}
    </h3>
    <div class="flex flex-wrap gap-x-4 gap-y-3">
      <metro-button
        type="button"
        v-for="(value, index) in values"
        :key="index"
        :active="isActiveSetting(name, value)"
        @click="onClick(name, value)">
        {{ valueLabels[index] }}
      </metro-button>
    </div>
  </section>
</template>

<script>
import MetroButton from './MetroButton.vue';

export default {
  components: {
    MetroButton,
  },
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
    },
  },
  methods: {
    isActiveSetting(key, value) {
      return this.activeValue === value;
    },
    onClick(name, value) {
      this.$emit('save', name, value);
    },
  },
};
</script>
