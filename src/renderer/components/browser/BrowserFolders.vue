<template>
  <v-expansion-panels
    v-model="panel"
    v-if="childrenFolders.length && currentFolderID != 1"
    class="folder-panel"
  >
    <v-expansion-panel>
      <v-expansion-panel-header>サブフォルダ</v-expansion-panel-header>
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
        
        <v-divider class="my-2"/>

        <v-checkbox
          dense
          hide-details
          v-model="includeDecendantFolders"
          color="primary"
          label="サブフォルダも含めて検索する"
        />

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
        panel: [],
        includeDecendantFolders: this.$config.renderer().search.query.includeDecendantFolders
      }
    },
    computed: {
      currentFolderID() {
        return this.$store.state.viewContext.folder
      },
      //ブラウザの幅を基準にするためにcomputedで制御してるけど、CSSで実現する方法もありそう
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
      },
      includeDecendantFolders() {
        this.$config.set("renderer.search.query.includeDecendantFolders", this.includeDecendantFolders)
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