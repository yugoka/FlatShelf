<template>
  <div>
    <ImageViewer v-if="contentType === 'image'" :content="content" />
  </div>
</template>

<script>
import ImageViewer from "../components/viewer/image/ImageViewer.vue"

export default {
  name: "viewer",

  components: { ImageViewer },

  data() {
    return {
      content: null,
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
    async getContentData() {
      const result = await this.$contents.getData(this.contentID)
      this.content = result[0]
    },
  },

  async mounted() {
    await this.getContentData()
  },
}
</script>
