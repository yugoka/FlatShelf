<template>
  <div class="reader-wrapper">
    <div class="reader-toolbar-area" @mousemove="showToolbar">
      <BookReaderToolbar
        class="toolbar"
        :folderInfo="folderInfo"
        :show="toolbar"
        :currentPage="page"
        @back="back"
        @showPage="showPage"
      />
    </div>

    <BookReaderSpread
      ref="spread"
      class="reader"
      v-if="currentViewMode === 'spread'"
      :isPDF="isPDF"
      :folderInfo="folderInfo"
      :book="book"
      :page="page"
      @back="back"
      @setPage="setPage"
    />
  </div>
</template>

<script>
import BookReaderSpread from "./BookReaderSpread.vue"
import BookReaderToolbar from "./BookReaderToolbar.vue"
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
    }
  },

  computed: {
    //this.bookがpdfならtrue, 違うならfalse
    isPDF() {
      if (!this.book) return false
      return this.book.dir.toLowerCase().endsWith(".pdf")
    },
  },

  methods: {
    setBook(book) {
      this.book = book
    },

    back() {
      this.$emit("back")
    },

    setPage(page) {
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
  },
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
