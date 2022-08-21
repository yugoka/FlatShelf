<template>
  <div v-if="ready" class="img-wrapper">
    <ResponsivePDFPage v-if="isPDF" :pdf="pdf" :pageNum="page + 1" />
    <v-img v-else :src="`file://${book.images[page].dir}`" />
  </div>
</template>

<script>
//======
// pdf, フォルダビューどっちも対応する画像表示
//======

import ResponsivePDFPage from "./ResponsivePDFPage.vue"
export default {
  components: { ResponsivePDFPage },
  props: {
    book: Object,
    page: Number,
    isPDF: Boolean,
    pdf: Object,
  },

  computed: {
    ready() {
      return this.book && ((this.isPDF && this.pdf) || !this.isPDF)
    },
  },
}
</script>

<style scoped>
.img-wrapper {
  width: 100%;
}
</style>
