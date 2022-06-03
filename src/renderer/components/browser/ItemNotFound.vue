<template>
  <div class="mt-10 text-center">
    <DummyFileInput ref="fileInput" />

    <div class="pt-10 text-body-1 secondary--text">
      ここにはまだアイテムがないようです。
    </div>
    <div class="text-caption secondary--text">
      <v-icon small class="mb-1">mdi-file-plus</v-icon>
      ファイルをドロップするか、
      <a href="#" class="primary--text" @click="fileInput">ここをクリック</a>
      してアイテムを追加
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
