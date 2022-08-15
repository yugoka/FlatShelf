<template>
  <div class="book-viewer">
    <BookFolderBackButton
      v-if="!viewMode"
      @click="back"
      :highlight="folderInfo.isSubDirectory"
      class="mt-10"
    />

    <BookReader
      ref="reader"
      v-if="viewMode"
      :folderInfo="folderInfo"
      @back="back"
    />

    <v-row v-else justify="center" no-gutters class="mt-3">
      <v-col cols="10">
        <BookTop
          :folderInfo="folderInfo"
          :content="content"
          @view="viewFolder(0)"
        />

        <v-divider
          class="my-4"
          v-if="folderInfo.folders && folderInfo.folders.length"
        />

        <BookViewerFolders
          :folderInfo="folderInfo"
          @onClickFolder="changeCurrentFolder"
          @onClickPDF="viewPDF"
        />

        <v-divider
          class="my-5 pb-6"
          v-if="folderInfo.images && folderInfo.images.length"
        />

        <BookViewerThumbnails :images="folderInfo.images" @view="viewFolder" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BookViewerFolders from "./subs/BookViewerSubs.vue"
import BookViewerThumbnails from "./BookViewerThumbnails.vue"
import BookFolderBackButton from "./BookFolderBackButton.vue"
import BookTop from "./BookTop.vue"
import BookReader from "./reader/BookReader.vue"

export default {
  name: "book-viewer",

  props: {
    content: Object,
  },
  components: {
    BookViewerFolders,
    BookViewerThumbnails,
    BookFolderBackButton,
    BookTop,
    BookReader,
  },

  data() {
    return {
      folderInfo: {},
      //現在が閲覧モードかどうか
      viewMode: false,
      //閲覧時にpdfとして扱うかどうか
      pdfMode: false,
      //閲覧モードから戻ってきた時にサイドバーを元に戻す
      isSideMenuTemporarilyClosed: null,
    }
  },

  computed: {},

  methods: {
    async getFolderInfo(directory) {
      const result = await window.ipc.getBookFolderInfo(
        directory,
        this.content.folderPath
      )
      return result
    },

    async changeCurrentFolder(folder) {
      this.folderInfo = await this.getFolderInfo(folder.dir)
    },

    async back() {
      //閲覧モードの場合
      if (this.viewMode) {
        this.viewMode = false
        return
      }

      //ブック内最上層フォルダから戻ろうとした場合
      if (this.folderInfo.dir === this.content.folderPath) {
        this.$search.redirect()
        return
      }

      this.folderInfo = await window.ipc.bookFolderBack(
        this.content.folderPath,
        this.folderInfo.dir
      )
    },

    //フォルダ閲覧モードに切り替える
    viewFolder(page) {
      this.viewMode = true
      this.$nextTick(() => {
        this.$refs.reader.setFolder(this.folderInfo)
        this.$refs.reader.showPage(page)
      })
    },

    async viewPDF(pdf) {
      this.viewMode = true
    },
  },

  watch: {
    viewMode() {
      this.$emit("toggle-magnify-mode", this.viewMode)
      if (this.viewMode) {
        this.isSideMenuTemporarilyClosed = this.$store.state.isSideMenuShown
        this.$store.dispatch("toggleSideMenu", false)
      } else {
        if (this.isSideMenuTemporarilyClosed) {
          this.$store.dispatch("toggleSideMenu", true)
        }
      }
    },
  },

  async created() {
    this.folderInfo = await this.getFolderInfo(this.content.folderPath)
    console.log(this.folderInfo)
  },
}
</script>

<style scoped>
.book-viewer {
  height: 100%;
}
</style>
