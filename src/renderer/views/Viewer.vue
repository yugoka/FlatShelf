<template>
  <v-container class="viewer" :fluid="magnifyMode">
    <BackToSearchButton v-if="!magnifyMode" />
    <PDFTest class="mx-10 my-10" />
    <div class="viewport-wrapper" v-if="false">
      <ImageViewer
        v-if="contentType === 'image'"
        :content="content"
        :isItemExists="isItemExists"
        @toggle-magnify-mode="toggleMagnifyMode"
        @change-content="changeContent"
      />
      <BookViewer
        v-if="contentType === 'book'"
        :content="content"
        @toggle-magnify-mode="toggleMagnifyMode"
      />
    </div>
  </v-container>
</template>

<script>
import BackToSearchButton from "../components/app/miniparts/BackToSearchButton.vue"
import ImageViewer from "../components/viewer/image/ImageViewer.vue"
import BookViewer from "../components/viewer/book/BookViewer.vue"
import PDFTest from "../components/viewer/book/reader/ResponsivePDFPage.vue"

export default {
  name: "viewer",

  components: { ImageViewer, BookViewer, BackToSearchButton, PDFTest },

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

    //検索コンテキストについて次, 前のアイテムが存在するかどうか
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
    //検索上でrelativeIndex分だけ次のアイテムに移動する
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

    //magnify-modeならバツボタン非表示, 横幅制限解除
    toggleMagnifyMode(bool) {
      this.magnifyMode = bool
    },
  },

  created() {
    //アイテムに更新があった場合更新
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
  overflow-y: scroll;
}
.viewport-wrapper {
  z-index: 1;
  height: 100%;
}

.back-button {
  z-index: 2;
}

.viewer::-webkit-scrollbar {
  overflow: visible;
  width: 6px;
}
.viewer::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}
</style>
