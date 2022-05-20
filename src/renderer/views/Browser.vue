<template>
  <div class="main-browser-wrapper">
    <!-- 上部のツールバー -->
    <BrowserFilterMenu class="filtermenu" />

    <div
      class="search-wrapper"
      @dragenter.prevent
      @dragover.prevent="onDragOver"
      @dragleave="fileDropSnackBar = false"
      @drop="onDrop"
    >
      <!-- 検索画面本体 -->
      <SearchContents ref="contents" />

      <!-- ファイルドロップ用スナックバー -->
      <FileDropSnackBar :show="fileDropSnackBar" />
    </div>
  </div>
</template>

<script>
import SearchContents from "../components/browser/Search"
import BrowserFilterMenu from "../components/browser/filtermenu/BrowserFilterMenu.vue"
import FileDropSnackBar from "../components/browser/FileDropSnackBar.vue"

export default {
  name: "Browser",

  components: {
    SearchContents,
    BrowserFilterMenu,
    FileDropSnackBar,
  },

  data() {
    return {
      fileDropSnackBar: false,
      isDraggingFile: false,
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
      const folderID = context.folder ? context.folder : 1

      await this.$contents.create({
        files,
        folderID,
      })
    },
  },
}
</script>

<style scoped>
/* システムメニューとフィルターメニューに対しハードコーディング */
.main-browser-wrapper {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100vh - 30px);
}

.filtermenu {
  position: relative;
  z-index: 2;
  flex-grow: 0;
}

.search-wrapper {
  position: relative;
  z-index: 1;
  flex-grow: 1;
  overflow: hidden;
}
</style>
