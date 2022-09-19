<template>
  <div class="reader-wrapper">
    <div class="reader-toolbar-area" @mousemove="showToolbar">
      <BookReaderToolbar
        class="toolbar"
        :folderInfo="folderInfo"
        :show="toolbar"
        :currentPage="page"
        :pageCount="pageCount"
        @back="back"
        @showPage="showPage"
      />
    </div>

    <BookReaderSpread
      ref="spread"
      class="reader"
      v-if="currentViewMode === 'spread'"
      :isPDF="isPDF"
      :pdf="pdf"
      :folderInfo="folderInfo"
      :book="book"
      :page="page"
      :pageCount="pageCount"
      @back="back"
      @setPage="setPage"
    />
  </div>
</template>

<script>
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.js"
const worker = new Worker(`${__static}/pdfjs/pdf.worker.min.js`)
pdfjs.GlobalWorkerOptions.workerPort = worker
import BookReaderSpread from "./BookReaderSpread.vue"
import BookReaderToolbar from "./toolbar/BookReaderToolbar.vue"
import debounce from "lodash.debounce"

export default {
  components: { BookReaderSpread, BookReaderToolbar },

  props: {
    folderInfo: Object,
  },

  data() {
    return {
      currentViewMode: "spread",
      toolbar: false,
      page: 0,
      book: null,
      pdf: null,
      //プリロードするページ数
      pageBuffer: 4,
      //ロード済みのページ
      loadedPages: [],
    }
  },

  computed: {
    //this.bookがpdfならtrue, 違うならfalse
    isPDF() {
      if (!this.book) return false
      return this.book.dir.toLowerCase().endsWith(".pdf")
    },

    pageCount() {
      if (this.isPDF) {
        if (!this.pdf) {
          return null
        } else {
          return this.pdf.numPages
        }
      } else if (this.book) {
        return this.book.images.length
      } else {
        return null
      }
    },
  },

  methods: {
    setBook(book) {
      this.book = book
    },

    back() {
      this.$emit("back")
    },

    async setPage(page) {
      if (typeof page != "number") return
      this.page = page
    },

    //そのページを含む状態で表示する
    showPage(page) {
      if (typeof page != "number") return

      this.$nextTick(() => {
        this.$refs[this.currentViewMode].showPage(page)
      })
    },

    showToolbar() {
      this.toolbar = true
      this.hideToolbar()
    },

    hideToolbar: debounce(function () {
      this.toolbar = false
    }, 1000),

    //対象のページをプリロードする。効果は未検証
    async preloadPage() {
      const start = Math.max(0, this.page - this.pageBuffer)
      const end = Math.min(this.pageCount - 1, this.page + this.pageBuffer)

      if (this.isPDF && this.pdf) {
        this.$nextTick(async () => {
          const canvas = new OffscreenCanvas(1, 1)
          const canvasContext = canvas.getContext("2d")

          //PDFプリロード
          for (let pageNum = start; pageNum <= end; pageNum++) {
            const pageInstance = await this.pdf.getPage(pageNum + 1)

            if (this.loadedPages[pageNum] === false) {
              console.log("preload", pageNum)
              this.loadedPages[pageNum] = true
              const viewport = pageInstance.getViewport()
              await pageInstance.render({
                canvasContext,
                transform: null,
                viewport,
              }).promise
            }
          }
        })
      } else {
        //画像プリロード
        const pages = this.book.images.slice(start, end)
        for (const page of pages) {
          const imgTag = new Image()
          imgTag.src = `file://${page.dir}`
        }
      }
    },
  },

  watch: {
    async book() {
      if (this.isPDF) {
        this.pdf = await pdfjs.getDocument({
          url: this.book.dir,
        }).promise
        await this.preloadPage()
      } else {
        this.pdf = null
        await this.preloadPage()
      }
      this.loadedPages = Array(this.pageCount).fill(false)
      console.log(this.loadedPages)
    },

    //ページが更新された時に画像をプリロードする(画像モードのみ)
    async page() {
      await this.preloadPage()
    },
  },

  mounted() {},
}
</script>

<style scoped>
.reader-wrapper {
  height: 100%;
  position: relative;
}

.reader-toolbar-area {
  position: absolute;
  width: 100%;
  height: 10%;
  min-height: 70px;
  z-index: 2;
}

.reader {
  z-index: 1;
}
</style>
