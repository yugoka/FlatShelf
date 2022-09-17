<template>
  <div class="page-wrapper">
    <ResponsivePDFPage
      v-if="isPDF"
      :pdf="pdf"
      :pageNum="page + 1"
      :pagePosition="pagePosition"
    />
    <img
      v-else
      :src="`file://${book.images[page].dir}`"
      class="img"
      :class="pagePosition"
    />
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
    pagePosition: String,
  },

  computed: {},
}
</script>

<style scoped>
.page-wrapper {
  height: 100%;
  width: 100%;
}

.img {
  width: 100%;
  height: calc(100vh - 50px);
  object-fit: contain;
}

.img.left {
  object-position: right;
}
.img.right {
  object-position: left;
}
</style>
