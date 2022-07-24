<template>
<div>
  <BookFolderBackButton @click="backFolder" :isSubDirectory="folderInfo.isSubDirectory"/>

  <v-row justify="center" no-gutters class="mt-3">
    <v-col cols="10">
      <BookViewerFolders :folders="folderInfo.folders" @onClickFolder="changeCurrentFolder"/>
      <BookViewerThumbnails :images="folderInfo.images"/>
    </v-col>
  </v-row>
</div>
</template>

<script>
import BookViewerFolders from './BookViewerFolders.vue'
import BookViewerThumbnails from './BookViewerThumbnails.vue'
import BookFolderBackButton from './BookFolderBackButton.vue'

export default {
  name: "book-viewer",
    
  props: {
      content: Object,
  },
  components: { BookViewerFolders, BookViewerThumbnails, BookFolderBackButton },

  data() {
    return {
      folderInfo: {},
    }
  },

  computed: {
  },

  methods: {
    async getFolderInfo(directory) {
      const result = await window.ipc.getBookFolderInfo(directory, this.content.folderPath)
      return result
    },

    async changeCurrentFolder(folder) {
      this.folderInfo = await this.getFolderInfo(folder.dir)
    },

    async backFolder() {
      //ブック内最上層フォルダから戻ろうとした場合
      if (this.folderInfo.dir === this.content.folderPath) {
        this.$search.redirect()
        return
      }

      this.folderInfo = await window.ipc.bookFolderBack(this.content.folderPath, this.folderInfo.dir)
    }
  },

    
  async created() {
    this.folderInfo = await this.getFolderInfo(this.content.folderPath)
  },

}
</script>

<style scoped>

</style>
