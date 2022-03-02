<template>
  <v-expansion-panels
    v-model="panel"
    v-if="childrenFolders.length && currentFolderID != 1"
    class="folder-panel"
  >
    <v-expansion-panel>
      <v-expansion-panel-header>子フォルダ</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row 
          class="folders-wrapper"
          no-gutters
        >
          <v-col
            v-for="folder in childrenFolders"
            :key="folder.folderID"
            :cols="folderCols"
            class="folder text-center px-2"
            @click="onClickFolder(folder)"
          >
            <div>
              <v-icon x-large>mdi-folder</v-icon>
            </div>
            <span class="caption">
              {{folder.name}}
            </span>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

  </v-expansion-panels>
</template>

<script>
  export default {
    props: {
      width: Number
    },
    data() {
      return {
        childrenFolders: [],
        panel: []
      }
    },
    computed: {
      currentFolderID() {
        return this.$store.state.viewContext.folder
      },
      folderCols() {
        if (this.width < 300) {
          return 12
        } else if (this.width < 500) {
          return 4
        } else if (this.width < 700) {
          return 3
        } else if (this.width < 1000) {
          return 2
        } else {
          return 1
        }
      }
    },
    watch: {
      async currentFolderID() {
        await this.getChildrenFolders()
      }
    },
    methods: {
      async getChildrenFolders() {
        this.childrenFolders = await this.$folders.getDecendants(this.currentFolderID, "children", false)
      },
      onClickFolder(folder) {
        this.$search.redirect({
          folder: folder.folderID
        })
      }
    },
    async created() {
      await this.getChildrenFolders()
    }
  }
</script>

<style scoped>
.folder {
  cursor: pointer;
  max-height: 100px;    
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>