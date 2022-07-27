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
            <v-col
              cols="6"
              sm="4"
              md="3"
              lg="2"
              v-for="folder in folders"
              :key="folder.name"
            >
              <v-card
                class="folder-card text-center"
                @click="onClickFolder(folder)"
              >
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
                    {{
                      isImageCollection(folder) ? "mdi-book-open" : "mdi-folder"
                    }}
                  </v-icon>
                  {{ folder.name }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
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
  },

  watch: {
    panel() {
      console.log(this.panel)
    },
  },

  methods: {
    onClickFolder(folder) {
      this.$emit("onClickFolder", folder)
    },

    //対象のフォルダの中身が画像の集合であるかどうかを確認する
    isImageCollection(folder) {
      return folder.imagesCount && !folder.foldersCount && !folder.pdfCount
    },
  },
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
