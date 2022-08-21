<template>
  <v-slide-y-transition>
    <v-card class="toolbar pa-1" elevation="10" v-show="show">
      <div>
        <v-btn icon large @click="back" color="primary">
          <v-icon>mdi-arrow-u-left-bottom</v-icon>
        </v-btn>
      </div>
      <div class="slider-wrapper">
        <v-slider
          dense
          height="45"
          min="1"
          :max="pageCount"
          v-model="page"
          @change="onSlide"
          hide-details
          thumb-label
          thumb-size="22"
        />
      </div>
      <div>
        <v-btn icon large>
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-slide-y-transition>
</template>

<script>
import debounce from "lodash.debounce"

export default {
  props: {
    folderInfo: Object,
    show: Boolean,
    currentPage: Number,
    pageCount: Number,
  },

  data() {
    return {
      page: this.currentPage,
    }
  },

  methods: {
    back() {
      this.$emit("back")
    },

    onSlide: debounce(function () {
      this.$emit("showPage", this.page - 1)
    }, 300),
  },

  watch: {
    currentPage() {
      this.page = this.currentPage
    },
  },

  computed: {},
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
}

.slider-wrapper {
  width: 80%;
}
</style>
