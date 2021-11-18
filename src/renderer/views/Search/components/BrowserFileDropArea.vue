<template>
  <div 
    class="main-browser-file-drop-area"
    @dragenter="dragEnter"
    @dragleave="dragLeave"
  >
    <!-- フォルダ直接インポートもするならスナックバーの処理を分けることも考えるべき？ -->
    <v-snackbar
      v-model="snackbar"
      color="primary"
      content-class="text-center"
      timeout="-1"
      transition="slide-y-reverse-transition"
    >
      <div class="file-drop-import-snackbar">
        <v-icon large>mdi-import</v-icon>
      </div>
      ファイルをドロップしてインポート
    </v-snackbar>

  </div>
</template>

<script>

export default {
  name: "BrowserFileDropArea",

  data() {
    return {
      snackbar: false
    }
  },

  methods: {
    dragEnter(e) {
      this.snackbar = true
    },
    dragLeave(e) {
      this.snackbar = false
    }
  },

}
</script>

<style scoped>
.main-browser-file-drop-area {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

