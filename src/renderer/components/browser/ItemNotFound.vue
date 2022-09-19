<template>
  <div class="mt-10 text-center">
    <DummyFileInput ref="fileInput" />

    <div class="pt-10 text-body-1 secondary--text">
      ここにはまだアイテムがないようです。
    </div>
    <div class="mt-2 text-caption secondary--text">
      <v-icon small class="mb-1">mdi-file-plus</v-icon>
      ファイルをドラッグ＆ドロップするか、
      <a href="#" class="primary--text" @click="fileInput">ここをクリック</a>
      してアイテムを追加
    </div>

    <div class="text-caption secondary--text">
      対応ファイル形式：
      <v-icon x-small>mdi-folder-zip</v-icon>zip,
      <v-icon x-small>mdi-image</v-icon>png,
      <v-icon x-small>mdi-image</v-icon>jpg,
      <v-icon x-small>mdi-image</v-icon>webpなど
    </div>
  </div>
</template>

<script>
import DummyFileInput from "../app/miniparts/DummyFileInput.vue"
export default {
  components: { DummyFileInput },
  methods: {
    fileInput() {
      this.$refs.fileInput.activate()
    },
  },
}
</script>

<style scoped>
.wrapper {
  background-color: aquamarine;
}
</style>
