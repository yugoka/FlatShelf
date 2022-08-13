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
      :folderInfo="folderInfo"
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
  data() {
    return {
      currentViewMode: "spread",
      toolbar: false,
      page: 0,
    }
  },

  props: {
    folderInfo: Object,
    pdfMode: Boolean,
    pdfPath: String,
  },

  methods: {
    back() {
      this.$emit("back")
    },

    setPage(page) {
      this.page = page
    },

    //そのページを含む状態で表示する
    showPage(page) {
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
