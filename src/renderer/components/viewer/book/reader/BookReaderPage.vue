<template>
  <div v-if="book" class="img-wrapper">
    <v-img v-if="!isPDF" :src="`file://${book.images[page].dir}`" />
    <ResponsivePDFPage v-else :pdfPath="book.dir" :pageNum="page + 1" />
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
  },
}
</script>

<style scoped>
.img-wrapper {
  width: 100%;
}
</style>
