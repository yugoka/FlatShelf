<template>
  <ContextMenu ref="contextMenu">
    <MenuButton v-if="showOpenButton" @click.native="openFolder">
      開く
    </MenuButton>

    <v-divider class="my-1" v-if="showOpenButton" />

    <MenuButton @click.native="createFolder"> 新規フォルダ </MenuButton>

    <MenuButton @click.native="renameFolder" v-if="folderID != 1">
      名前の変更
    </MenuButton>

    <MenuButton @click.native="deleteFolder" v-if="folderID != 1">
      削除
    </MenuButton>
  </ContextMenu>
</template>

<script>
import ContextMenu from "../app/contextmenu/ContextMenu.vue"
import MenuButton from "../app/contextmenu/ContextMenuButton.vue"

export default {
  props: {
    mode: String,
  },

  components: {
    ContextMenu,
    MenuButton,
  },

  data() {
    return {
      folderID: null,
    }
  },

  computed: {
    showOpenButton() {
      return this.mode === "SideMenu" && this.folderID != 1
    },
  },

  methods: {
    show(folderID) {
      this.folderID = folderID
      this.$refs.contextMenu.show()
    },

    openFolder() {
      this.$emit("open-folder", { id: this.folderID })
    },

    createFolder() {
      this.$emit("create-folder", this.folderID)
    },

    renameFolder() {
      this.$emit("rename", this.folderID)
    },

    deleteFolder() {
      this.$folders.delete(this.folderID)
    },
  },
}
</script>
