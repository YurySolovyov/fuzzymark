<template lang="html">
  <div class="overlay top-0 left-0">
    <div class="lg-col-6 md-col-8 sm-col-10 mx-auto">
      <h1 class="font-light overlay-title">Are You Sure?</h1>
      <a class="big-link block text-decoration-none font-light mt3"
        href="#"
        @click.prevent="deleteSubmit">Yes</a>
      <router-link class="big-link block text-decoration-none font-light mt3"
        to="/">No</router-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async deleteSubmit() {
      await this.$store.dispatch('deleteTile', {
        id: this.$route.params.id
      });

      this.$router.push({ name: 'root' });
    }
  }
}
</script>

<style lang="css">
</style>
