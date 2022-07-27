<template>
  <div class="reader-wrapper">
    <div class="image-area">
      <div class="go-next" @click="next" />
      <div class="go-prev" @click="prev" />

      <v-row no-gutters>
        <v-col
          :cols="12 / pageSpread"
          v-for="image in currentPage"
          :key="image.dir"
        >
          <div class="image-wrapper" v-if="!image.isDummy">
            <img :src="`file://${image.dir}`" />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    folderInfo: Object,
    page: Number,
  },

  data() {
    return {
      //一度に表示するページ数
      pageSpread: 2,
      //1ページ分ずらすかどうか
      pageInversion: true,
      //非表示画像
      dummyImg: { dir: "dummy", isDummy: true },
    }
  },

  computed: {
    images() {
      if (!Array.isArray(this.folderInfo.images)) return []
      return this.folderInfo.images
    },

    isLastPage() {
      if (!this.pageInversion) {
        return this.images.length <= this.page + this.pageSpread
      } else {
        return this.images.length <= this.page + this.pageSpread - 1
      }
    },

    isFirstPage() {
      return this.page === 0
    },

    currentPage() {
      // -----------------
      // ページ反転がある場合
      // -----------------
      if (this.pageInversion && this.pageSpread == 2) {
        if (this.isFirstPage) {
          //最初のページは１枚
          return [this.images[0]]
        } else if (this.isLastPage) {
          //最後のページは１枚の場合がある
          const images = this.images
            .slice(this.page - 1, this.page + this.pageSpread - 1)
            .reverse()

          if (images.length === 1) {
            return [this.dummyImg, ...images]
          } else {
            return images
          }
        } else {
          //中間ページ
          return this.images
            .slice(this.page - 1, this.page + this.pageSpread - 1)
            .reverse()
        }
      }

      // -----------------
      // ページ反転がない場合
      // -----------------
      if (!this.isLastPage) {
        //通常時
        return this.images
          .slice(this.page, this.page + this.pageSpread)
          .reverse()
      } else if (this.images.length > this.page) {
        //最後のページ。個々の処理はとりあえず2枚の場合だけ対応
        const images = this.images.slice(this.page).reverse()

        //画像が足りない場合
        if (images.length < this.pageSpread) {
          return [this.dummyImg, ...images]
        } else {
          return images
        }
      } else {
        //通常ではありえないけど存在する以上のページを読み込もうとした場合
        console.error(`ページ読み込みエラー： ${this.page}`)
        return []
      }
    },
  },

  watch: {},

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
