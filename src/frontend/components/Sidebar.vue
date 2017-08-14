<template lang="html">
  <div id="sidebar" class="absolute left-0 top-0 m2">
    <router-link class="overlay-control root"
      to="/"
      :class="buttonClass">
      <svg viewBox="0 0 24 24">
        <path fill="#6F6F6F" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
      </svg>
    </router-link>
    <router-link class="overlay-control settings"
      to="/settings"
      :class="buttonClass">
      <svg viewBox="0 0 24 24">
        <path fill="#6F6F6F" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path>
      </svg>
    </router-link>
    <router-link class="overlay-control new-tile"
      to="/new-tile"
      :class="buttonClass">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#6F6F6F" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </svg>
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    buttonClass() {
      return this.$route.name === 'root' ? 'is-root': 'non-root';
    }
  }
}
</script>

<style lang="css">

#sidebar {
  z-index: 10;
  width: 24px;
}

.overlay-control {
  color: var(--theme-bookmark-link-color);
  display: none;
}

.overlay-control:hover {
  color: var(--theme-bookmark-link-hover-color);
}

.root.non-root {
  display: block;
}

.settings.is-root {
  display: block;
}

.new-tile.is-root {
  display: block;
}

</style>
