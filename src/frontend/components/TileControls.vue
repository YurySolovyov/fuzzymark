<template lang="html">
  <div class="tile-controls right" @click.prevent.stop>
    <div class="dots">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#6F6F6F" d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
      </svg>
    </div>
    <div class="edit" @click.stop.prevent="onEdit" title="Edit Tile">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#6F6F6F" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
      </svg>
    </div>
    <div class="delete" @click.stop.prevent="onDelete" title="Delete Tile">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#6F6F6F" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expanded: false
    };
  },
  methods: {
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
}
</script>

<style lang="css">

.bookmark-tile:hover .tile-controls{
  opacity: 1;
}

.tile-controls {
  margin-top: -28px;
  transition: 0.3s;
  opacity: 0;
  cursor: pointer;
}

.tile-controls .delete,
.tile-controls .edit {
  display: none;
}

.tile-controls:hover .delete,
.tile-controls:hover .edit {
  display: block;
}

</style>
