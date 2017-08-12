<template lang="html">
  <div class="overlay top-0 left-0">
    <div class="lg-col-6 md-col-8 sm-col-10 mx-auto" v-if="currentTile">
      <h1 class="overlay-title font-light">{{ formTitle }}</h1>
      <input class="col-8 my2 p1 block border-none font-family-inherit container-background input font-light"
        type="text"
        v-model="currentTile.title"
        placeholder="Title" />
      <input class="col-8 my2 p1 block border-none font-family-inherit container-background input font-light"
        type="text"
        v-model="currentTile.url"
        placeholder="Url" />
      <a class="big-link text-decoration-none font-light inline-block mt3"
        href="#"
        @click.prevent="onSubmit">Looks Good</a>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid/v4';
import { mapState } from 'vuex';

const state = mapState(['tiles']);

export default {
  data() {
    return {
      newTileStub: {
        title: '',
        url: ''
      }
    };
  },
  computed: Object.assign({
    currentTile() {
      if (this.newTile) {
        return this.newTileStub;
      } else {
        const id = this.$route.params.id;
        return this.tiles.find(t => t.id === id);
      }
    },
    id() {
      if (this.newTile) {
        return uuid();
      } else {
        return this.currentTile.id;
      }
    },
    submitEvent() {
      return this.newTile ? 'saveNewTile' : 'saveTile';
    },
    newTile() {
      return this.$route.name === 'new-tile';
    },
    formTitle() {
      return this.newTile ? 'New Tile' : 'Edit Tile';
    },
  }, state),
  methods: {
    onSubmit() {
      this.$store.dispatch(this.submitEvent, {
        id: this.id,
        tile: {
          title: this.currentTile.title,
          url: this.currentTile.url,
        }
      });

      this.$router.push({ name: 'root' });
    }
  }
}
</script>
