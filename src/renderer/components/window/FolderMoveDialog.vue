<template>
  <DialogCard
    ref="dialog"
    :maxWidth="300"
    :title="`${contentIDs.length}件のアイテムを移動`"
    :caption="caption"
  >
    <v-card-text>
      <Folders
        ref="folder"
        @select="select($event)"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        color="primary"
        small
        @click="hide"
      >
        キャンセル
      </v-btn>
      <v-btn
        color="primary"
        small
        :disabled="!selectedFolder"
        @click="save"
      >
        移動
      </v-btn>
    </v-card-actions>
  </DialogCard>
</template>

<script>
import DialogCard from './DialogCard.vue'
import Folders from '../folders/Folders.vue'
export default {
  name: "FolderSelectWindow",

  components: {
    DialogCard,
    Folders 
  },

  data() {
    return {
      visible: false,
      contentIDs: [],
      selectedFolder: null
    }
  },

  computed: {
    caption() {
      if (this.selectedFolder) {
        return `移動先：${this.selectedFolder.name}`
      } else {
        return null
      }
    }
  },

  methods: {
    show(contentIDs) {
      if (!contentIDs.length) return
      this.contentIDs = contentIDs
      this.selectedFolder = null
      this.$refs.dialog.show()
      this.$nextTick(() => {
        this.$refs.folder.unselect()
      })
    },
    hide() {
      this.$refs.dialog.hide()
    },
    save() {
      if (!this.selectedFolder || !this.contentIDs.length) return
      this.$contents.update(
        this.contentIDs, 
        {
          folderID: this.selectedFolder.id
        }
      )
      this.hide()
    },
    select(folderID) {
      this.selectedFolder = folderID
    }
  },
}
</script>

<style>

</style>