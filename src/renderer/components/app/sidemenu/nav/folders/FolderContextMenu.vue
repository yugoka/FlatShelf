<template>
  <ContextMenu ref="contextMenu">

    <MenuButton>
      開く
    </MenuButton>

    <v-divider class="my-1"/>

    <MenuButton @click.native="createFolder">
      新規フォルダ
    </MenuButton>

    <MenuButton>
      名前の変更
    </MenuButton>

    <MenuButton>
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
      this.$folders.create(this.folderID)
    }
  }
}
</script>
