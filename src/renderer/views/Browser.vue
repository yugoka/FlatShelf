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
      <div>
        <v-icon large>mdi-import</v-icon>
      </div>
      ファイルをドロップしてインポート
    </v-snackbar>

  </div>
</template>

<script>
  import SearchContents from "../components/browser/Search"

  export default {

    name:"Browser",

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
        
        const files = event.dataTransfer.files
        const context = this.$store.state.viewContext
        //コンテキストにフォルダが設定されていない場合未分類にインポートする
        const folderID = context.folders
          ? context.folders[0]
          : 1

        await this.$contents.createMany({
          files,
          folderID
        })
      }
    }


  }

</script>

<style scoped>
.main-browser-wrapper {
  height: calc(100vh - 30px);
  position: relative;
}


</style>