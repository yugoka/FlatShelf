<template>
  <div class="slider-wrapper">
    <v-slider
      dense
      height="30"
      min="80"
      max="400"
      v-model="value"
      @input="onSlide"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  name: 'SystemBarSlider',

  data() {
    return {
      value: this.$config.renderer().search.itemSize
    }
  },

  methods: {
    onSlide: debounce(function() {
      this.$config.set("renderer.search.itemSize", this.value)
    }, 200)
  }
}
</script>


<style scoped>
.slider-wrapper {
  margin-left: 10px;
  height: 30px;
  width: 100px;
}
</style>