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
      移動
    </MenuButton>

    <v-divider 
      class="my-1"
    />

    <MenuButton
      @click.native="remove(selectedItems)"
      v-if="isManySelected"
    >
      {{selectedItems.length}}件のアイテムを削除
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
    selectedItems() {
      return this.$store.state.edit.selectedIDs
    },

    //複数項目を選択中かつ選択している項目を右クリックしたかどうか
    isManySelected() {
      return this.selectedItems.length >= 2 && this.selectedItems.includes(this.contentID)
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
      this.$store.dispatch("setSelectedItems", [this.contentID])
    },

    moveFolder() {
      console.log("rename")
    },

    remove(IDs) {
      this.$contents.delete(IDs)
      if (this.selectedItems.includes(this.contentID)) {
        this.$store.dispatch("endEditMode")
      } 
    }
  }
}
</script>
