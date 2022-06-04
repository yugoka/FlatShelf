<template>
  <v-container class="viewer" :fluid="magnifyMode">
    <BackToSearchButton v-if="!magnifyMode" />

    <div class="viewport-wrapper">
      <ImageViewer
        v-if="contentType === 'image'"
        :content="content"
        :isItemExists="isItemExists"
        @toggle-magnify-mode="toggleMagnifyMode"
        @change-content="changeContent"
      />
    </div>
  </v-container>
</template>

<script>
import BackToSearchButton from "../components/app/miniparts/BackToSearchButton.vue"
import ImageViewer from "../components/viewer/image/ImageViewer.vue"

export default {
  name: "viewer",

  components: { ImageViewer, BackToSearchButton },

  data() {
    return {
      content: null,
      magnifyMode: false,
    }
  },

  computed: {
    contentID() {
      return this.$route.params.contentID
    },
    contentType() {
      if (this.content) {
        return this.content.type.split("/")[0]
      } else {
        return null
      }
    },
    isItemExists() {
      return {
        next:
          this.$route.params.index !=
          this.$store.state.searchResultIDs.length - 1,
        prev: this.$route.params.index != 0,
      }
    },
  },

  watch: {
    async contentID() {
      await this.getContentData()
    },
  },

  methods: {
    changeContent(relativeIndex) {
      const newContentIndex = this.$route.params.index + relativeIndex
      const newContentID = this.$store.state.searchResultIDs[newContentIndex]

      if (typeof newContentID != "number") return

      this.$contents.view(newContentID, newContentIndex)
    },

    async getContentData() {
      const result = await this.$contents.getData(this.contentID)
      this.content = result[0]
    },

    toggleMagnifyMode(bool) {
      this.magnifyMode = bool
    },
  },

  created() {
    window.addEventListener("reloadContents", this.getContentData)
  },

  async mounted() {
    await this.getContentData()
  },

  beforeDestroy() {
    window.removeEventListener("reloadContents", this.getContentData, false)
  },
}
</script>

<style scoped>
.viewer {
  height: 100%;
}
.viewport-wrapper {
  z-index: 1;
  height: 100%;
}

.back-button {
  z-index: 2;
}
</style>
