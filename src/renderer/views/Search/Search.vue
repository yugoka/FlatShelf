<template>
  <div
    class="main-browser-wrapper"
    @dragenter.prevent
    @dragover.prevent="onDragOver"
    @dragleave="fileDropSnackBar = false"
    @drop="onDrop"
  >
    <!-- 検索画面本体 -->
    <SearchContents
      ref="contents"
    />

    <!-- ファイルドロップ用スナックバー -->
    <v-snackbar
      v-model="fileDropSnackBar"
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
  import SearchContents from "./components/contents/Contents"

  export default {

    name:"Search",

    components: {
      SearchContents
    },

    data() {
      return {
        fileDropSnackBar: false,
        isDraggingFile: false
      }
    },

    methods: {
      //ファイルをドラッグしてマウスオーバーした時の処理
      onDragOver(event) {
        if (!event.dataTransfer.types.includes("Files")) return
        this.fileDropSnackBar = true
      },

      //ファイルドロップ時の処理
      async onDrop(event) {
        this.fileDropSnackBar = false
        if (!event.dataTransfer.types.includes("Files")) return

        await this.$contents.createMany({
          files: event.dataTransfer.files,
          folderID: 1
        })
        
        //検索結果をリロードする
        this.$refs.contents.loadContents()

      }
    }


  }

</script>

<style scoped>
.main-browser-wrapper {
  min-height: calc(100vh - 30px);
}

</style>