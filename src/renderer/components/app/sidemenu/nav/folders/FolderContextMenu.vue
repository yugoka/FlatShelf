<template>
  <ContextMenu ref="contextMenu">

    <MenuButton>
      開く
    </MenuButton>

    <v-divider class="my-1"/>

    <MenuButton @click.native="createFolder">
      新規フォルダ
    </MenuButton>

    <MenuButton @click.native="renameFolder">
      名前の変更
    </MenuButton>

    <MenuButton @click.native="deleteFolder">
      削除
    </MenuButton>

  </ContextMenu>
</template>

<script>
import ContextMenu from '../../../contextmenu/ContextMenu.vue'
import MenuButton from '../../../contextmenu/ContextMenuButton.vue'

export default {
  components: {
    ContextMenu,
    MenuButton
  },

  data() {
    return {
      folderID: null
    }
  },

  methods: {
    show(folderID) {
      this.folderID = folderID
      this.$refs.contextMenu.show()
    },

    createFolder() {
      this.$emit("create-folder", this.folderID)
    },

    renameFolder() {
      this.$emit("rename", this.folderID)
    },

    deleteFolder() {
      this.$folders.delete(this.folderID)
    }
  }
}
</script>
