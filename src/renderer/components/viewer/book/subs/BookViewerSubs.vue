<template>
  <div v-if="Array.isArray(folders) && folders.length">
    <v-expansion-panels v-model="panel" class="folders-wrapper pa-2">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span>
            <v-icon class="me-1"> mdi-folder </v-icon>
            サブフォルダ
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
  },
  methods: {
    onClickFolder(folder) {
      this.$emit("onClickFolder", folder)
    },
    onClickPDF(pdf) {
      this.$emit("onClickPDF", pdf)
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
