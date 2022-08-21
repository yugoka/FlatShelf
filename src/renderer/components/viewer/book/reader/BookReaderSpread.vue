<template>
  <div class="reader-wrapper">
    <div class="image-area">
      <div class="go-next" @click="next" />
      <div class="go-prev" @click="prev" />

      <v-row no-gutters>
        <v-col :cols="12 / pageSpread" v-for="page in viewPage" :key="page">
          <div class="image-wrapper" v-if="page != -1">
            <BookReaderPage :book="book" :isPDF="isPDF" :page="page" />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import BookReaderPage from "./BookReaderPage.vue"
export default {
  components: { BookReaderPage },
  props: {
    folderInfo: Object,
    book: Object,
    page: Number,
    isPDF: Boolean,
  },

  data() {
    return {
      //一度に表示するページ数
      pageSpread: 2,
      //1ページ分ずらすかどうか
      pageInversion: true,
    }
  },

  computed: {
    pageCount() {
      if (this.isPDF) {
        return 10
      } else if (this.book) {
        return this.book.images.length
      } else {
        return 10
      }
    },

    isLastPage() {
      if (!this.pageInversion) {
        return this.pageCount <= this.page + this.pageSpread
      } else {
        return this.pageCount <= this.page + this.pageSpread - 1
      }
    },

    isFirstPage() {
      return this.page === 0
    },

    // -----------------
    // 現在開いているページ一覧
    // pageSpread=1,2に対応
    // -----------------
    currentPages() {
      if (this.pageSpread == 1) {
        return [this.page]
      }

      // -----------------
      // ページ反転がある場合
      // -----------------
      if (this.pageInversion && this.pageSpread == 2) {
        if (this.isFirstPage) {
          //最初のページは１枚
          return [0]
        } else if (this.isLastPage) {
          //最後のページは１枚の場合がある
          const pages = [this.page - 1, this.page + this.pageSpread - 2]

          if (pages[1] >= this.pageCount) {
            return [pages[0], -1]
          } else {
            return pages
          }
        } else {
          //中間ページ
          return [this.page - 1, this.page + this.pageSpread - 2]
        }
      }

      // -----------------
      // ページ反転がない場合
      // -----------------

      //最終ページ
      if (this.isLastPage && this.pageCount > this.page) {
        const pages = [this.page, this.pageCount]

        //画像が足りない場合
        if (pages[1] >= this.pageCount) {
          return [pages[0], -1]
        } else {
          return pages
        }

        //最初のページ
      } else if (this.isFirstPage) {
        return [0, 1]

        //それ以外(中間ページ)
      } else {
        return [this.page, this.page + this.pageSpread - 1]
      }
    },

    //閲覧ページ
    viewPage() {
      return this.currentPages.slice().reverse()
    },
  },

  watch: {
    currentPages() {},
  },

  methods: {
    next() {
      if (this.isLastPage) {
        this.$emit("back")
        return
      }
      this.$emit("setPage", this.page + this.pageSpread)
    },

    prev() {
      if (!this.isFirstPage) {
        this.$emit("setPage", this.page - this.pageSpread)
      }
    },

    showPage(page) {
      if (this.pageInversion) {
        const newPage =
          Math.floor((page + 1) / this.pageSpread) * this.pageSpread
        this.$emit("setPage", newPage)
      } else {
        const newPage = Math.floor(page / this.pageSpread) * this.pageSpread
        this.$emit("setPage", newPage)
      }
    },
  },

  created() {},
}
</script>

<style scoped>
.reader-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.image-area {
  position: relative;
  user-select: none;
}

.go-next {
  position: absolute;
  height: 100%;
  width: 50%;
}

.go-prev {
  position: absolute;
  height: 100%;
  width: 50%;
  left: 50%;
}

.image-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
}
</style>
