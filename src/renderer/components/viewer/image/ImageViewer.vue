<template>
  <div class="viewer-wrapper mt-3" ref="viewer">
    <v-row justify="center" class="image-row" no-gutters>
      <v-col cols="10" class="image-col">
        <div class="image-buttons">
          <v-btn icon block>
            <v-icon>mdi-magnify-plus</v-icon>
          </v-btn>
          <v-btn icon block @click="edit">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon block>
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </div>

        <div class="image-wrapper" ref="imageWrapper">
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
            クリックまたは下にスクロールで展開
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
import debounce from "lodash.debounce"

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
      imageResizeObserver: null,
      alwaysShowContentData: false,
    }
  },

  computed: {
    showContentData() {
      return this.alwaysShowContentData || this.expandContentData
    },
    imageMaxHeight() {
      return null
    },
    editMode() {
      return this.$store.state.editMode
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

    onResizeImage: throttle(function (entry) {
      const imageHeight = entry[0].contentRect.height

      if (!imageHeight || !this.$refs.imageWrapper) return

      const wrapperHeight = this.$refs.imageWrapper.clientHeight
      const heightDiff = wrapperHeight - imageHeight

      if (heightDiff > 250) {
        this.toggleAlwaysShowContentData(true)
      } else if (heightDiff < 70) {
        this.toggleAlwaysShowContentData(false)
      }
    }, 50),

    toggleAlwaysShowContentData: debounce(function (bool) {
      this.alwaysShowContentData = bool
    }, 150),

    toggleExpandData() {
      this.expandContentData = !this.showContentData
    },

    edit() {
      if (this.editMode) {
        this.$store.dispatch("endSelectMode")
      } else {
        this.$store.dispatch("setSelectedItems", this.content.contentID)
        this.$store.commit("setEditMode", true)
      }
    },
  },

  mounted() {
    this.$refs.viewer.onmousewheel = this.onWheel

    this.imageResizeObserver = new ResizeObserver(this.onResizeImage).observe(
      this.$refs.imageWrapper.firstChild
    )
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

.image-buttons {
  position: absolute;
  right: -40px;
  transition: 0.3s;
  opacity: 0;
}

.image-col:hover .image-buttons {
  opacity: 1;
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
