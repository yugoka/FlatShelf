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

    <MenuButton 
      v-if="isCardSelected"
      @click.native="unselect"
    >
      選択を解除
    </MenuButton>

    <v-divider 
      class="my-1"
    />

    <MenuButton
      @click.native="remove(selectedIDs)"
      v-if="isManySelected"
    >
      {{selectedIDs.length}}件のアイテムを削除
    </MenuButton>

    <MenuButton
      @click.native="remove(contentID)"
      v-else
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

  computed: {
    selectedIDs() {
      return this.$store.state.edit.selectedIDs
    },

    isCardSelected() {
      return this.selectedIDs.includes(this.contentID)
    },

    //複数項目を選択中かつ選択している項目を右クリックしたかどうか
    isManySelected() {
      return this.selectedIDs.length >= 2 && this.selectedIDs.includes(this.contentID)
    }
  },

  methods: {
    show(contentID) {
      this.contentID = contentID
      this.$refs.contextMenu.show()
    },

    hide() {
      this.$refs.contextMenu.hide()
    },

    open() {
      console.log("open", this.contentID)
    },

    edit() {
      this.$store.dispatch("setSelectedItems", [this.contentID])
    },

    unselect() {
      this.$store.dispatch("endEditMode")
    },

    moveFolder() {
      console.log("rename")
    },

    remove(IDs) {
      this.$contents.delete(IDs)
      if (this.isCardSelected) {
        this.$store.dispatch("endEditMode")
      } 
    }
  }
}
</script>
