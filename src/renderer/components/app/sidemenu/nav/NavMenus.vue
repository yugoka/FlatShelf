<template>
  <v-list nav dense class="pt-1">
    <NavUtilMenu />

    <v-divider class="mt-2" />

    <v-subheader>コンテンツ</v-subheader>

    <v-list-item-group
      v-model="selectedItem"
      color="primary"
      :mandatory="isMandatoryEnabled"
    >
      <NavItem title="すべて" icon="mdi-home" :context="contexts.all" />

      <NavItem
        title="未分類"
        icon="mdi-folder-question-outline"
        :context="contexts.noFolder"
      />

      <NavItem title="タグなし" icon="mdi-tag-off-outline" />

      <NavItem title="最近追加" icon="mdi-archive-outline" />
    </v-list-item-group>
  </v-list>
</template>

<script>
import NavItem from "./NavItem.vue"
import NavUtilMenu from "./NavUtilMenu.vue"

export default {
  name: "SideMenuMainMenus",

  components: {
    NavItem,
    NavUtilMenu,
  },

  data() {
    return {
      selectedItem: 0,
      isMandatoryEnabled: true,

      //各ボタンに対応する検索コンテキスト
      contexts: {
        all: {
          word: "",
        },
        noFolder: {
          folder: 1,
        },
        noTags: {},
        recent: {},
      },
    }
  },

  methods: {
    unselect() {
      //NavFoldersが選択された場合NavMenusの選択状態を外す。このメソッドは親から呼び出される
      this.isMandatoryEnabled = false
      this.selectedItem = null
    },
  },

  watch: {
    selectedItem() {
      if (this.selectedItem != null) {
        //NavMenusコンテンツを選択したならNavFolders側の選択を外す
        //このイベントはAppSideMenuを経由してNavFoldersの選択を解除する
        this.$emit("select")
        this.isMandatoryEnabled = true
      }
    },
  },
}
</script>

<style scoped></style>
