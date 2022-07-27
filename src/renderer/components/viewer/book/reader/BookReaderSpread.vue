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
          <div class="image-wrapper">
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
  },

  data() {
    return {
      //現在の始点ページ
      page: 0,
      //一度に表示するページ数
      pageSpread: 2,
    }
  },

  computed: {
    images() {
      if (!Array.isArray(this.folderInfo.images)) return []
      return this.folderInfo.images
    },

    isLastPage() {
      return this.images.length <= this.page + this.pageSpread
    },

    isFirstPage() {
      return this.page === 0
    },

    currentPage() {
      if (!this.isLastPage) {
        return this.images
          .slice(this.page, this.page + this.pageSpread)
          .reverse()
      } else if (this.images.length > this.page) {
        return this.images.slice(this.page).reverse()

        //通常ではありえないけど存在する以上のページを読み込もうとした場合
      } else {
        return []
      }
    },
  },

  methods: {
    next() {
      if (this.isLastPage) {
        this.$emit("back")
        return
      }
      this.page += this.pageSpread
    },

    prev() {
      if (!this.isFirstPage) {
        this.page -= this.pageSpread
      }
    },
  },
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
