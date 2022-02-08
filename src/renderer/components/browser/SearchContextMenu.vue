<template>
  <ContextMenu ref="contextMenu">

    <MenuButton
      @click.native="open"
    >
      開く
    </MenuButton>

    <v-divider 
      class="my-1"
    />

    <MenuButton 
      @click.native="edit"
    >
      編集
    </MenuButton>

    <MenuButton
      @click.native="moveFolder"
    >
      フォルダを選択
    </MenuButton>

    <v-divider 
      class="my-1"
    />

    <MenuButton
      @click.native="remove"
      color="red"
    >
      削除
    </MenuButton>

  </ContextMenu>
</template>

<script>
import ContextMenu from '../app/contextmenu/ContextMenu'
import MenuButton from '../app/contextmenu/ContextMenuButton'

export default {
  components: {
    ContextMenu,
    MenuButton
  },

  data() {
    return {
      contentID: null
    }
  },

  methods: {
    show(contentID) {
      this.contentID = contentID
      this.$refs.contextMenu.show()
    },

    open() {
      console.log("open", this.contentID)
    },

    edit() {
      this.$store.commit("setSelectedItems", [this.contentID])
    },

    moveFolder() {
      console.log("rename")
    },

    remove() {
      this.$contents.delete([this.contentID])
    }
  }
}
</script>
