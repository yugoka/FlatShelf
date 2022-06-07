<template>
  <div class="viewer-wrapper mt-3" ref="viewer">
    <v-row justify="center" class="image-overview" no-gutters>
      <v-col :cols="magnify ? 12 : 10" class="image-col">
        <div v-show="!magnify" class="image-buttons">
          <v-btn
            icon
            block
            :color="magnify ? 'info' : null"
            @click="toggleMagnify"
          >
            <v-icon>{{
              magnify ? "mdi-magnify-minus" : "mdi-magnify-plus"
            }}</v-icon>
          </v-btn>
          <v-btn
            icon
            block
            :color="$store.state.edit.editMode ? 'info' : null"
            @click="toggleEditMode"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            block
            :color="expandContentData ? 'info' : null"
            v-if="!alwaysShowContentData"
            @click="toggleExpandData"
          >
            <v-icon>mdi-information</v-icon>
          </v-btn>
        </div>

        <div
          class="image-wrapper"
          :class="{ magnify: magnify }"
          ref="imageWrapper"
        >
          <v-img
            contain
            eager
            :src="`file://${content.mainFilePath}`"
            :key="content.contentID"
            class="image"
            @click="toggleMagnify"
            @load="imageLoaded = true"
          />

          <div v-show="imageLoaded" class="text-body-2 text-center my-1">
            {{ content.name }}
          </div>
        </div>

        <div v-show="!magnify">
          <div class="page-button button-next" v-if="isItemExists.next">
            <v-btn icon x-large @click="changeContent(1)">
              <v-icon large>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
          <div class="page-button button-prev" v-if="isItemExists.prev">
            <v-btn icon x-large @click="changeContent(-1)">
              <v-icon large>mdi-chevron-left</v-icon>
            </v-btn>
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
    isItemExists: Object,
  },

  data() {
    return {
      expandContentData: false,
      viewerWidth: 0,
      imageResizeObserver: null,
      alwaysShowContentData: false,
      magnify: false,
      imageLoaded: false,
    }
  },

  computed: {
    showContentData() {
      return this.alwaysShowContentData || this.expandContentData
    },
    editMode() {
      return this.$store.state.edit.editMode
    },
  },

  watch: {
    content() {
      this.imageLoaded = false
      this.registerImageObserver()
    },
  },

  methods: {
    onWheel: throttle(function (e) {
      if (this.alwaysShowContentData || this.magnify) return

      if (e.deltaY > 0) {
        this.expandContentData = true
      } else {
        this.expandContentData = false
      }
    }, 10),

    //画像の横幅が変更された時、画像データの開閉をするかどうかの処理が走る
    onResizeImage: throttle(function (entry) {
      if (this.magnify) return

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

    toggleEditMode() {
      if (this.editMode) {
        this.$store.dispatch("endEditMode")
      } else {
        this.$store.dispatch("setSelectedItems", this.content.contentID)
        this.$store.commit("setEditMode", true)
      }
    },

    toggleMagnify() {
      this.magnify = !this.magnify
      this.$emit("toggle-magnify-mode", this.magnify)
      if (this.magnify) {
        this.alwaysShowContentData = true
      }
    },

    //relativeIndex分だけ、検索結果で次のコンテンツに移動する。マイナスならその逆
    changeContent(relativeIndex) {
      this.$emit("change-content", relativeIndex)
    },

    unObserveImage() {
      if (this.imageResizeObserver) {
        this.imageResizeObserver.unobserve(this.$refs.imageResizeObserver)
      }
    },

    registerImageObserver() {
      this.unObserveImage()
      this.$nextTick(() => {
        this.imageResizeObserver = new ResizeObserver(
          this.onResizeImage
        ).observe(this.$refs.imageWrapper.firstChild)
      })
    },
  },

  mounted() {
    this.$refs.viewer.onmousewheel = this.onWheel
    this.registerImageObserver()
  },

  beforeDestroy() {
    this.unObserveImage()
  },
}
</script>

<style scoped>
.viewer-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.image-overview {
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

.image-wrapper.magnify {
  position: static;
  height: unset;
}

.image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: calc(100% - 50px);
  cursor: zoom-in;
}

.magnify .image {
  cursor: zoom-out;
}

.image-buttons {
  position: absolute;
  right: -40px;
  transition: 0.3s;
  opacity: 0;
}

.page-button {
  display: flex;
  position: absolute;
  top: 30vh;
}

.button-next {
  right: -60px;
}
.button-prev {
  left: -60px;
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
