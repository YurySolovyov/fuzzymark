<template lang="html">
  <component
    :is="tag"
    :to="to"
    :disabled="disabled"
    class="appearance-none cursor-pointer border-0 bg-transparent p-0 font-inherit text-2xl font-thin leading-tight no-underline"
    :class="[
      active ? 'text-(--theme-selected-start)' : 'text-(--theme-bookmark-link-color)',
      disabled
        ? 'cursor-not-allowed text-(--theme-bookmark-divider-color) opacity-55'
        : 'hover:text-(--theme-bookmark-link-hover-color)',
    ]"
    @click="onClick">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'router-link'].includes(value),
    },
    to: {
      type: [String, Object],
      default: undefined,
    },
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  methods: {
    onClick(event) {
      if (!this.disabled) {
        this.$emit('click', event);
      }
    },
  },
};
</script>
