<template>
  <div 
    v-if="childrenFolders.length"
  >
    <div class="py-1">
      子フォルダ
    </div>
    <v-row>
      <v-col
        v-for="folder in childrenFolders"
        :key="folder.folderID"
        cols="2"
      >
        <v-card
          class="text-center"
        >
          <div>
            <v-icon x-large>mdi-folder</v-icon>
          </div>
          <span class="caption">
            {{folder.name}}
          </span>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        childrenFolders: []
      }
    },
    computed: {
      currentFolderID() {
        return this.$store.state.viewContext.folder
      },
    },
    watch: {
      async currentFolderID() {
        await this.getChildrenFolders()
      }
    },
    methods: {
      async getChildrenFolders() {
        this.childrenFolders = await this.$folders.getDecendants(this.currentFolderID, "children", false)
      }
    },
    async created() {
      await this.getChildrenFolders()
    }
  }
</script>