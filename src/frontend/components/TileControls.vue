<template lang="html">
  <div class="tile-controls flex flex-column" @click.prevent.stop @mouseleave="collapse">
    <div class="edit" v-if="expanded" @click="onEdit" title="Edit Tile">
      <edit />
    </div>
    <div class="delete" v-if="expanded" @click="onDelete" title="Delete Tile">
      <trash />
    </div>
    <div class="move" v-if="expanded" title="Move Tile">
      <move />
    </div>
    <div class="dots" @click="toggle">
      <dots />
    </div>
  </div>
</template>

<script>

import Dots from './icons/Dots.vue';
import Move from './icons/Move.vue';
import Trash from './icons/Trash.vue';
import Edit from './icons/Edit.vue';

export default {
  components: {
    Dots,
    Move,
    Trash,
    Edit,
  },
  data() {
    return {
      expanded: false
    };
  },
  methods: {
    collapse() {
      this.expanded = false;
    },
    toggle() {
      this.expanded = !this.expanded;
    },
    onEdit() {
      this.$emit('edit');
    },
    onDelete() {
      this.$emit('delete');
    }
  }
};
</script>

<style lang="css">

.bookmark-tile:hover .tile-controls{
  opacity: 1;
}

.tile-controls {
  transition: 0.3s;
  opacity: 0;
  cursor: pointer;
  flex: 1;
  align-self: flex-end;
  justify-content: flex-end;
  margin-bottom: -16px;
}

</style>
