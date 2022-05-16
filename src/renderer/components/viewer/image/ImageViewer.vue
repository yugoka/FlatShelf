<template>
  <div class="viewer-wrapper mt-3" ref="viewerWrapper">
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
        <div v-show="expandContentData">
          <v-divider class="mb-3" />
          <ContentData :content="content" class="mx-3" />
          <v-btn @click="showContentData = false">aaa</v-btn>
        </div>
      </v-expand-transition>

      <v-expand-transition>
        <div v-show="!expandContentData" class="my-5 text-center">
          <v-btn icon x-large>
            <v-icon x-large>mdi-chevron-down</v-icon>
          </v-btn>
        </div>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
import ContentData from "../ContentData.vue"
export default {
  components: { ContentData },
  name: "image-viewer",

  props: {
    content: Object,
  },

  data() {
    return {
      showContentData: true,
    }
  },

  computed: {
    expandContentData() {
      return this.showContentData
    },
    imageMaxHeight() {
      return null
    },
  },

  methods: {},

  mounted() {},
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
</style>
