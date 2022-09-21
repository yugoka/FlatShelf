<template>
  <div class="book-viewer">
    <BookFolderBackButton v-if="!viewMode" @click="back" />
    <BookEditButton v-if="!viewMode" @click="toggleEditMode" />
    <BookReader
      ref="reader"
      v-if="viewMode"
      :folderInfo="folderInfo"
      @back="back"
    />

    <v-row v-else justify="center" no-gutters class="mt-3">
      <v-col cols="10">
        <BookTop :folderInfo="folderInfo" :content="content" @view="viewBook" />

        <v-divider
          class="my-4"
          v-if="folderInfo.folders && folderInfo.folders.length"
        />

        <BookViewerSubs
          :folderInfo="folderInfo"
          @onClickFolder="changeCurrentFolder"
          @onClickPDF="viewBook"
        />

        <v-divider
          class="my-5 pb-6"
          v-if="folderInfo.images && folderInfo.images.length"
        />

        <BookViewerThumbnails :folderInfo="folderInfo" @view="viewBook" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BookViewerSubs from "./subs/BookViewerSubs.vue"
import BookViewerThumbnails from "./BookViewerThumbnails.vue"
import BookFolderBackButton from "./BookFolderBackButton.vue"
import BookTop from "./BookTop.vue"
import BookReader from "./reader/BookReader.vue"
import BookEditButton from "./BookEditButton.vue"

export default {
  name: "book-viewer",

  props: {
    content: Object,
  },
  components: {
    BookViewerSubs,
    BookViewerThumbnails,
    BookFolderBackButton,
    BookTop,
    BookReader,
    BookEditButton,
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

      //戻った先のフォルダ情報。これ以上戻れないならfalseが帰ってくる
      const backFolder = await window.ipc.bookFolderBack(
        this.content.folderPath,
        this.folderInfo.dir
      )

      //戻った先がスキップフォルダを含めて最下層だった場合
      if (backFolder === false) {
        this.$search.redirect()
      } else {
        this.folderInfo = backFolder
      }
    },

    //編集モードの切り替え
    toggleEditMode() {
      if (!this.$store.state.edit.editMode) {
        this.$store.commit("setSelectedItems", [this.content])
      } else {
        this.$store.dispatch("endEditMode")
      }
    },

    //フォルダ閲覧モードに切り替える
    viewBook({ page = 0, target = this.folderInfo } = {}) {
      this.viewMode = true
      this.$nextTick(() => {
        this.$refs.reader.setBook(target)
        this.$refs.reader.showPage(page)
      })
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
  },
}
</script>

<style scoped>
.book-viewer {
  height: 100%;
}
</style>
