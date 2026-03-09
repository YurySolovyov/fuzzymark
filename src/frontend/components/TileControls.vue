<template lang="html">
  <div class="relative flex flex-1">
    <div
      class="absolute right-0 bottom-0 z-10 flex flex-col items-end gap-2"
      @click.prevent.stop>
      <button
        type="button"
        class="icon-button"
        v-if="expanded"
        @click="onEdit"
        title="Edit Tile">
        <edit />
      </button>
      <button
        type="button"
        class="icon-button"
        v-if="expanded"
        @click="onDelete"
        title="Delete Tile">
        <trash />
      </button>
      <div
        class="icon-button"
        :class="dragging ? 'cursor-grabbing' : 'cursor-grab touch-none'"
        v-show="expanded"
        :ref="moveHandleRef"
        title="Move Tile">
        <move />
      </div>
      <button
        type="button"
        class="icon-button opacity-60 transition-[color,opacity] hover:opacity-100"
        @click="toggle">
        <dots />
      </button>
    </div>
  </div>
</template>

<script>
import Dots from './icons/Dots.vue';
import Move from './icons/Move.vue';
import Trash from './icons/Trash.vue';
import Edit from './icons/Edit.vue';

export default {
  props: {
    dragging: {
      type: Boolean,
      default: false,
    },
    moveHandleRef: {
      type: [Function, Object],
      default: undefined,
    },
  },
  components: {
    Dots,
    Move,
    Trash,
    Edit,
  },
  data() {
    return {
      expanded: false,
    };
  },
  mounted() {
    document.addEventListener('pointerdown', this.onDocumentPointerDown);
  },
  beforeUnmount() {
    document.removeEventListener('pointerdown', this.onDocumentPointerDown);
  },
  methods: {
    collapse() {
      this.expanded = false;
    },
    onDocumentPointerDown(event) {
      if (!this.expanded || this.$el.contains(event.target)) {
        return;
      }

      this.collapse();
    },
    toggle() {
      this.expanded = !this.expanded;
    },
    onEdit() {
      this.collapse();
      this.$emit('edit');
    },
    onDelete() {
      this.collapse();
      this.$emit('delete');
    },
  },
};
</script>
