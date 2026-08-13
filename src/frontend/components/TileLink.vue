<template lang="html">
  <a
    :href="href"
    :aria-disabled="ariaDisabled"
    class="group/tile block h-full border-4 border-transparent p-0 text-base text-(--theme-bookmark-link-color) no-underline transition-border-color duration-200 ease-out"
    :class="[
      invalid
        ? 'cursor-default opacity-65 hover:border-transparent'
        : 'cursor-pointer hover:border-(--bookmark-accent-color)',
    ]"
    @click="onClick">
    <slot />
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: '#',
    },
    invalid: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ariaDisabled() {
      return this.invalid ? 'true' : 'false';
    },
  },
  methods: {
    onClick(event) {
      if (this.invalid) {
        event.preventDefault();
      }
    },
  },
};
</script>
