<template lang="html">
  <div class="overlay top-0 left-0">
    <div class="lg-col-6 md-col-8 sm-col-10 mx-auto">
      <h1>Add New Tile</h1>
      <div class="inputs">
        <input class="col-8 my2 p1 block border-none font-family-inherit container-background"
          type="text"
          v-model="title"
          placeholder="Title" />
        <input class="col-8 my2 p1 block border-none font-family-inherit container-background"
          type="text"
          v-model="url"
          placeholder="Url" />
        <button class="col-3 my2 p1 block border-none font-family-inherit container-background"
          @click="onAdd">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid/v4';

export default {
  data() {
    return {
      title: '',
      url: ''
    };
  },
  methods: {
    onAdd() {
      this.$store.dispatch('addNewTile', {
        id: uuid(),
        tile: {
          title: this.title,
          url: this.url,
        }
      });

      this.reset();
    },
    reset() {
      this.title = '';
      this.url = '';
    }
  }
}
</script>

<style lang="css">

.inputs input {
  height: 24px;
  outline: none;
}

.inputs button {
  outline: none;
  cursor: pointer;
}

</style>
