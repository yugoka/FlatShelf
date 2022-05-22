<template>
  <v-container class="viewer" :fluid="magnifyMode">
    <v-btn v-if="!magnifyMode" fixed icon large @click="back" class="back-button">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <div class="viewport-wrapper">
      <ImageViewer v-if="contentType === 'image'" :content="content" @toggle-magnify-mode="toggleMagnifyMode" />
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
      magnifyMode: false
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

    async getContentData() {
      const result = await this.$contents.getData(this.contentID)
      this.content = result[0]
    },

    toggleMagnifyMode(bool) {
      this.magnifyMode = bool
    }
  },

  async mounted() {
    await this.getContentData()
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
