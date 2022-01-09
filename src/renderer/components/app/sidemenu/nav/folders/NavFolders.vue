<template>
  <div id="side-menu-folders-wrapper">

    <FolderContextMenu
      ref="folderContextMenu"
      @rename="startRenaming"
      @create-folder="createNewFolder"
    />

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
      @update:open="openFolder"
    >
      <!-- labelスロット -->
      <template v-slot:label="{ item }"> 
        <!-- 通常時 -->
        <template v-if="renamingFolderID != item.id">{{item.name}}</template>

        <!-- このnodeがリネーム対象の場合 -->
        <FolderRenameTextField
          v-else
          @end="endRenaming"
          :current-name="item.name"
        />
      </template>

      <!-- prependスロット -->
      <template v-slot:prepend="{ open }">
        <v-icon>
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
      </template>
      
      <!-- appendスロット -->
      <template v-slot:append="{ item }">
        <!-- 右クリックした時などにフォルダIDを取得する隠し場所 -->
        <input type="hidden" :value="item.id" class="side-menu-folders-folder-id"/>
      </template>

    </v-treeview>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import { registerNodeEventListeners, initFolderEventListeners } from "./folder-nodes-event-listener"

  import NewFolderButton from "./NewFolderButton.vue"
  import FolderContextMenu from "./FolderContextMenu.vue"
  import FolderRenameTextField from "./FolderRenameTextField.vue"

  export default {

    name: 'SideMenuFolders',

    components: {
      NewFolderButton,
      FolderContextMenu,
      FolderRenameTextField
    },

    data() {
      return {
        activatedFolder: [],
        openedFolders: [],
        //選択解除時にactivatedFolderを↓に戻す
        currentActiveFolder: null,
        isSelectingNavFolder: false,
        //初期オープンなフォルダを一度だけ読み込むためのフラグ
        hasInitiallyOpenFolderLoaded: false,
        renamingFolderID: null
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

      registerEventListeners() {
        registerNodeEventListeners({
          rightClick: this.rightClickFolder
        })
      },

      clickFolder(folderID) {
        //ダブルクリックなどで選択解除を試みた場合再度アクティベートする
        if(!folderID[0] && this.isSelectingNavFolder) {
          this.activatedFolder[0] = this.currentActiveFolder
          return
        }

        //フォルダーを普通に選択した場合
        if (folderID[0]) {
          this.isSelectingNavFolder = true
          this.currentActiveFolder = folderID

          //このイベントはAppSideMenuを経由してNavMenusの選択を解除する
          this.$emit("select")

          //検索コンテキストを変更＆ページを遷移する
          this.$search.redirect({folders: this.currentActiveFolder})
        }
      },

      rightClickFolder(event) {
        event.stopPropagation()
        this.$refs.folderContextMenu.show(event.currentTarget.folderID)
      },

      openFolder() {
        this.saveOpenedFolders()
        this.$nextTick(() => {
          this.registerEventListeners()
        })
      },

      //開いたフォルダの情報を保存。5秒間操作しなかった場合に実行
      saveOpenedFolders: debounce(function() {
        this.$config.set("renderer.folders.initiallyOpened", this.openedFolders)
      }, 5000),

      //フォルダを新規作成
      //parentID=1はすべての最上層フォルダが所属するrootフォルダ(非表示)
      async createNewFolder(parentID=1) {
        const newFolder = await this.$folders.create(parentID)
        //追加したフォルダの親フォルダをオープンする
        this.openedFolders.push(parentID)
        //追加したフォルダのリネームを開始する
        this.startRenaming(newFolder.id)
      },

      //リネーム処理を開始
      startRenaming(folderID) {
        this.renamingFolderID = folderID
      },

      //リネーム処理を終了して保存
      async endRenaming(input) {
        await this.$folders.rename(this.renamingFolderID, input)
        this.renamingFolderID = null
      },
    },

    watch: {
      folders() {
        this.$nextTick(() => {
          //フォルダ構造が変更されるたびに右クリックイベントを登録し直す
          this.registerEventListeners()
        })

        //フォルダが読み込まれた時一度だけ初期オープンフォルダを読み込む
        if (!this.hasInitiallyOpenFolderLoaded) {
          this.openedFolders = this.$config.renderer.folders.initiallyOpened
          this.hasInitiallyOpenFolderLoaded = true
        }

      }
    },

    mounted() {
      //フォルダノード以外の固定イベントを登録する
      initFolderEventListeners({ rightClick: this.rightClickFolder })
    }
  }

</script>

<style>
#side-menu-folders-wrapper {
  min-height: 300px;
  padding-bottom: 50px;
}

#side-menu-folders-wrapper .v-subheader {
    margin: 0;
}
#side-menu-folders .v-treeview-node__root {
  font-size: 14px;
  margin: 1px 0;
  cursor: pointer;
  user-select: none;
}
#side-menu-folders .v-treeview-node__root:before {
  border-radius: 4px;
  margin: 0 8px;
}
</style>
