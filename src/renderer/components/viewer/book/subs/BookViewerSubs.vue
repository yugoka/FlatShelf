<template>
  <div v-if="visible">
    <v-expansion-panels v-model="panel" class="folders-wrapper pa-2">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span>
            <v-icon class="me-1"> mdi-folder </v-icon>
            サブアイテム
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row dense>
            <BookViewerSubFolder
              v-for="folder in folders"
              :key="folder.name"
              :folder="folder"
              @click="onClickFolder(folder)"
            />

            <BookViewerSubPDF
              v-for="pdf in pdfs"
              :key="pdf.name"
              :pdf="pdf"
              @click="onClickPDF(pdf)"
            />
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import BookViewerSubFolder from "./BookViewerSubFolder.vue"
import BookViewerSubPDF from "./BookViewerSubPDF.vue"

export default {
  data() {
    return {
      panel: 0,
    }
  },
  props: {
    folderInfo: Object,
  },
  computed: {
    folders() {
      return this.folderInfo.folders
    },
    pdfs() {
      return this.folderInfo.pdfs
    },

    //サブアイテム一覧を表示するかどうか
    visible() {
      return (
        (Array.isArray(this.folders) && this.folders.length) ||
        (Array.isArray(this.pdfs) && this.pdfs.length)
      )
    },
  },
  methods: {
    onClickFolder(folder) {
      this.$emit("onClickFolder", folder)
    },
    onClickPDF(pdf) {
      this.$emit("onClickPDF", { page: 0, target: pdf })
    },
  },
  components: { BookViewerSubFolder, BookViewerSubPDF, BookViewerSubPDF },
}
</script>

<style scoped>
.folders-wrapper {
  width: 100%;
}

.folder-img {
  max-height: 200px;
  transition: 0.3s;
}
</style>
