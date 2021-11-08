<template>
  <div id="side-menu-folders-wrapper">

    <v-subheader class="my-1">
      フォルダ
      <NewFolderButton @click="createNewFolder"/>
    </v-subheader>

    <v-treeview
      id="side-menu-folders"
      dense
      hoverable
      activatable

      :items="folders"
      item-key="id"
      :active.sync="activatedFolder"
      :open.sync="openedFolders"

      @update:active="clickFolder"
      @update:open="saveOpenedFolders"
    >
      <template v-slot:prepend="{ open }">
        <v-icon>
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
      </template>

    </v-treeview>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import NewFolderButton from "./NewFolderButton.vue"

  export default {

    name: 'SideMenuFolders',

    components: {
      NewFolderButton
    },

    data() {
      return {
        activatedFolder: [],
        openedFolders: [],
        //選択解除時にactivatedFolderを↓に戻す
        currentActiveFolder: null,
        isSelectingNavFolder: false,
      }
    },

    computed: {
      folders() {
        return this.$store.state.folders.children
      }
    },

    methods: {
      //NavMenusが選択された場合フォルダの選択を外す
      unselect() {
        this.isSelectingNavFolder = false
        this.activatedFolder = []
      },
      clickFolder(folderID) {
        //フォルダーを普通に選択した場合
        if (folderID[0]) {
          this.isSelectingNavFolder = true
          this.currentActiveFolder = folderID

          //このイベントはAppSideMenuを経由してNavMenusの選択を解除する
          this.$emit("select")

          //ここにフォルダクリック時の処理(ページ遷移など)

        //ダブルクリックなどで選択解除を試みた場合再度アクティベートする
        } else if(this.isSelectingNavFolder) {
          this.activatedFolder[0] = this.currentActiveFolder
        }
      },

      //次回起動時用に開いたフォルダの情報を保存する。5秒間操作しなかった場合に実行
      saveOpenedFolders: debounce(function() {
        this.$config.set("renderer.folders.initiallyOpened", this.openedFolders)
      }, 5000),

      createNewFolder() {
        this.$folders.create()
      }

    },

    created() {
      const folderLoadWatcher = this.$watch('folders', () => {
        //この中の処理はフォルダ構造が読み込まれた際一度だけ実行される
        this.openedFolders = this.$config.renderer.folders.initiallyOpened

        //プロパティの監視をを終了する
        folderLoadWatcher()
      })
    }
  }

</script>

<style>
#side-menu-folders-wrapper .v-subheader {
    height: 30px;
    margin: 0;
}
#side-menu-folders .v-treeview-node__root {
  font-size: 14px;
  height: 30px;
  min-height: 30px;
  margin: 1px 0;
  cursor: pointer;
  user-select: none;
}
#side-menu-folders .v-treeview-node__root:before {
  border-radius: 4px;
  margin: 0 8px;
}
</style>
