<template>
  <v-list 
    nav
    dense
    class="pt-1"
  >
    <v-list-item-group
      v-model="selectedItem"
      color="primary"
      :mandatory="isMandatoryEnabled"
    >
      <NavItem 
        title="ホーム"
        icon="mdi-home"
        to="Home"
      />

      <v-divider
        class="my-1"  
      />

      <NavItem 
        title="すべて"
        icon="mdi-archive-outline"
        to="Search"
        :context="contexts.all"
      />

      <NavItem 
        title="未分類"
        icon="mdi-archive-outline"
        to="Search"
        :context="contexts.noFolder"
      />

      <NavItem 
        title="タグなし"
        icon="mdi-archive-outline"
      />

      <NavItem 
        title="最近追加"
        icon="mdi-archive-outline"
      />

    </v-list-item-group>
  </v-list>
</template>

<script>
  import NavItem from "./NavItem.vue"

  export default {
    name: 'SideMenuMainMenus',

    components: {
      NavItem
    },

    data() {
      return {
        selectedItem: 0,
        isMandatoryEnabled: true,

        //各ボタンに対応する検索コンテキスト
        contexts: {
          all: {},
          noFolder: {
            folders: [1]
          },
          noTags: {

          },
          recent: {

          }
        }
      }
    },

    methods: {
      unselect() {
        //NavFoldersが選択された場合NavMenusの選択状態を外す。このメソッドは親から呼び出される
        this.isMandatoryEnabled = false
        this.selectedItem = null
      },
      redirect(path) {
        this.$router.push(path)
        console.log(path)
      }
    },

    watch: {
      selectedItem() {
        if (this.selectedItem != null) {
          //NavMenusコンテンツを選択したならNavFolders側の選択を外す
          //このイベントはAppSideMenuを経由してNavFoldersの選択を解除する
          this.$emit("select")
          this.isMandatoryEnabled = true
        }
      }
    }
  }

</script>

<style scoped>

</style>
