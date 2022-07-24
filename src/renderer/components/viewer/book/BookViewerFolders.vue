<template>
  <v-card v-if="Array.isArray(folders) && folders.length" outlined class="folders-wrapper pa-2">
    <div class="ms-1 mb-2 text-body-2">
      サブフォルダ
    </div>
    <v-row dense>
      <v-col cols="6" sm="3" md="2" v-for="folder in folders" :key="folder.name">
        <v-card class="folder-card text-center" @click="onClickFolder(folder)">
          <div>
            <v-img 
              v-if="folder.firstImage"
              :src="`file://${folder.firstImage.dir}`"
              class="rounded folder-img"
            />
            <v-icon x-large v-else class="folder-img">mdi-folder</v-icon>
          </div>
          <div class="caption mx-1">
            <v-icon small color="info">
              {{isImageCollection(folder) ? "mdi-book-open" : "mdi-folder"}}
            </v-icon>
            {{folder.name}}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    folders: Array
  },

  watch: {
    folders() {
    }
  },

  methods: {
    onClickFolder(folder) {
      this.$emit("onClickFolder", folder)
    },

    //対象のフォルダの中身が画像の集合であるかどうかを確認する
    isImageCollection(folder) {
      return folder.imagesCount && !folder.foldersCount && !folder.pdfCount
    }
  }
}
</script>

<style scoped>
.folders-wrapper {
  width: 100%;
}

.folder-img {
  height: 110px;
  transition: .3s;
}
</style>