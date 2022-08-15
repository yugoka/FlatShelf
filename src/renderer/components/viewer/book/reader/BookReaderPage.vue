<template>
  <v-img v-if="!isPDF" :src="`file://${target.images[page].dir}`" />
  <ResponsivePDFPage v-else :pdf="target" :pageNum="page" />
</template>

<script>
//======
// pdf, フォルダビューどっちも対応する画像表示
//======

import ResponsivePDFPage from "./ResponsivePDFPage.vue"
export default {
  components: { ResponsivePDFPage },
  props: {
    target: String,
    page: Number,
  },

  computed: {
    isPDF() {
      return target.name.endsWith(".pdf")
    },
  },
}
</script>
