<template>
  <v-container class="viewer" :fluid="magnifyMode">
    <v-btn
      v-if="!magnifyMode"
      fixed
      icon
      large
      @click="back"
      class="back-button"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <div class="viewport-wrapper">
      <ImageViewer
        v-if="contentType === 'image'"
        :content="content"
        :isItemExsists="isItemExsists"
        @toggle-magnify-mode="toggleMagnifyMode"
        @change-item="changeItem"
      />
    </div>
  </v-container>
</template>

<script>
import ImageViewer from "../components/viewer/image/ImageViewer.vue"

export default {
  name: "viewer",

  components: { ImageViewer },

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
    isItemExsists() {
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
    back() {
      this.$search.redirect()
    },

    changeItem(relativeIndex) {
      console.log(relativeIndex)
      const newItemIndex = this.$route.params.index + relativeIndex
      const newItemID = this.$store.state.searchResultIDs[newItemIndex]

      this.$contents.view(newItemID, newItemIndex)
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
  height: calc(100vh - 30px);
}
.viewport-wrapper {
  z-index: 1;
  height: 100%;
}

.back-button {
  z-index: 2;
}
</style>
