<template>
  <div class="viewer-wrapper mt-3" ref="viewer">
    <v-row justify="center" class="image-row" no-gutters>
      <v-col cols="10" class="image-col">
        <div class="image-wrapper">
          <v-img
            contain
            :src="`file://${content.mainFilePath}`"
            class="image"
            :max-height="imageMaxHeight"
          />
          <div class="text-body-2 text-center my-1">
            {{ content.name }}
          </div>
        </div>
      </v-col>
    </v-row>

    <div class="content-data">
      <v-expand-transition>
        <div v-show="showContentData">
          <v-divider />
          <div class="text-center" :class="{ 'mb-3': alwaysShowContentData }">
            <v-btn
              v-show="!alwaysShowContentData"
              icon
              small
              @click="toggleExpandData"
            >
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </div>
          <ContentData :content="content" class="mx-3 mb-5" />
        </div>
      </v-expand-transition>

      <v-expand-transition>
        <div v-show="!showContentData" class="data-expand-button text-center">
          <div class="data-expand-button-info text-caption secondary--text">
            スクロールで展開
          </div>
          <v-btn icon large @click="toggleExpandData">
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </div>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
import ContentData from "../ContentData.vue"
import throttle from "lodash.throttle"

export default {
  components: { ContentData },
  name: "image-viewer",

  props: {
    content: Object,
  },

  data() {
    return {
      expandContentData: false,
      viewerWidth: 0,
    }
  },

  computed: {
    alwaysShowContentData() {
      return false
    },

    showContentData() {
      return this.alwaysShowContentData || this.expandContentData
    },
    imageMaxHeight() {
      return null
    },
  },

  methods: {
    onWheel: throttle(function (e) {
      if (this.alwaysShowContentData) return

      if (e.deltaY > 0) {
        this.expandContentData = true
      } else {
        this.expandContentData = false
      }
    }, 10),

    toggleExpandData() {
      this.expandContentData = !this.showContentData
    },
  },

  mounted() {
    this.$refs.viewer.onmousewheel = this.onWheel
  },
}
</script>

<style scoped>
.viewer-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.image-row {
  flex-shrink: 1;
  flex-grow: 1;
}

.content-data {
  flex-shrink: 0;
  flex-grow: 0;
  transition: 1s;
}

.image-col {
  height: 100%;
  position: relative;
}

.image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: calc(100% - 50px);
}

.data-expand-button-info {
  opacity: 0;
  transition: 0.3s;
}

.data-expand-button:hover .data-expand-button-info {
  opacity: 1;
  transition-delay: 0.5s;
  pointer-events: none;
}
</style>
