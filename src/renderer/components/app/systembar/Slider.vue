<template>
  <div
    v-show="$route.name === 'Search' && $vuetify.breakpoint.width > 700"
    class="slider-wrapper"
  >
    <v-slider
      dense
      height="30"
      min="80"
      max="400"
      v-model="value"
      @input="onSlide"
      hide-details
    />
  </div>
</template>

<script>
import debounce from "lodash.debounce"

export default {
  name: "SystemBarSlider",

  data() {
    return {
      value: this.$config.renderer().search.itemSize,
    }
  },

  methods: {
    //大きさを更新するたびに検索処理が走ってる疑惑ある
    onSlide: debounce(function () {
      this.$config.set("renderer.search.itemSize", this.value)
    }, 200),
  },
}
</script>

<style scoped>
.slider-wrapper {
  margin-left: 10px;
  height: 30px;
  width: 100px;
  overflow: hidden;
}
.slider-wrapper:hover {
  overflow: visible;
}
</style>
