<template lang="html">
  <div class="overlay top-0 left-0 flex flex-column"
    :class="`theme-${theme}`"
    id="splash">
    <h1 class="font-light overlay-title">
      <span>Loading your</span>
      <svg id="splash-star" viewBox="0 0 24 24">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
      </svg>
      <span>stuff...</span>
    </h1>
  </div>
</template>

<script>
import { mapState } from 'vuex';
const state = mapState(['theme']);

export default {
  computed: state
}
</script>

<style lang="css">

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(720deg);
  }
}

#splash {
  background-color: var(--main-bg-color);
  justify-content: center;
  align-items: center;
}

#splash-star {
  vertical-align: middle;
  width: 24px;
  height: 24px;
  animation: rotate 3s;
  animation-iteration-count: 1;
}
#splash-star path {
  fill: var(--theme-bookmark-link-color);
}

</style>
