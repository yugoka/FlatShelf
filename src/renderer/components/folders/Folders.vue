<template>
  <div
    class="app-folders-menu-wrapper"
    :style="{ 'min-height': minHeight ? minHeight + 'px' : null }"
    @contextmenu="rightClickFolder(rootFolder)"
    @drop="onDrop({ event: $event, dropFolder: rootFolder })"
    @dragover.prevent
    @dragenter.prevent
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <FolderContextMenu
      ref="folderContextMenu"
      @rename="startRenaming"
      @create-folder="createNewFolder"
      @open-folder="onClickFolder"
      :mode="mode"
    />

    <v-subheader class="pt-1 mb-1" v-if="!noHeader">
      フォルダ
      <NewFolderButton
        class="new-folder-button"
        @click="createNewFolder"
        :visible="hover"
      />
    </v-subheader>

    <v-treeview
      class="app-folders-menu"
      dense
      hoverable
      activatable
      :items="folders"
      item-key="id"
      :active.sync="activatedFolder"
      :open.sync="openedFolders"
      @update:open="onOpenFolder"
    >
      <!-- labelスロット -->
      <template v-slot:label="{ item }">
        <!-- 通常時 -->
        <div draggable @dragstart="onDragStart($event, item)">
          <FolderNode
            v-if="renamingFolderID != item.id"
            :folder="item"
            @click="onClickFolder"
            @contextmenu="rightClickFolder"
            @drop="onDrop"
          />

          <!-- このnodeがリネーム対象の場合 -->
          <FolderRenameTextField
            v-else
            @end="endRenaming"
            :current-name="item.name"
          />
        </div>
      </template>

      <!-- prependスロット -->
      <template v-slot:prepend="{ open }">
        <v-icon>
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
      </template>

      <!-- appendスロット -->
      <template v-slot:append="{ item }">
        <!-- 右クリックした時などにフォルダIDを取得する隠し場所 -->
        <input
          type="hidden"
          :value="item.id"
          class="side-menu-folders-folder-id"
        />
      </template>
    </v-treeview>
  </div>
</template>

<script>
import debounce from "lodash.debounce"
import NewFolderButton from "./NewFolderButton.vue"
import FolderContextMenu from "./FolderContextMenu.vue"
import FolderRenameTextField from "./FolderRenameTextField.vue"
import FolderNode from "./FolderNode.vue"

export default {
  name: "SideMenuFolders",

  props: {
    mode: String,
    noHeader: {
      type: Boolean,
      default: false,
    },
    minHeight: {
      type: Number,
      default: 300,
    },
    syncWithViewContext: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    NewFolderButton,
    FolderContextMenu,
    FolderRenameTextField,
    FolderNode,
  },

  data() {
    return {
      hover: false,
      activatedFolder: [],
      openedFolders: [],
      isSelectingNavFolder: false,
      //初期オープンなフォルダを一度だけ読み込むためのフラグ
      hasInitiallyOpenFolderLoaded: false,
      renamingFolderID: null,
      rootFolder: {
        id: 1,
        name: "root",
      },
    }
  },

  computed: {
    folders() {
      return this.$store.state.folders.children
    },
    viewContextFolder() {
      return this.$store.state.viewContext.folder
    },
  },

  watch: {
    folders() {
      //フォルダが読み込まれた時一度だけ初期オープンフォルダを読み込む
      if (!this.hasInitiallyOpenFolderLoaded) {
        this.openedFolders = this.$config.renderer().folders.initiallyOpened
        this.hasInitiallyOpenFolderLoaded = true
      }
    },

    //this.syncWithViewContext = trueなら、ハイライトされたフォルダとviewContextを同期する
    viewContextFolder() {
      if (!this.syncWithViewContext) return
      if (this.viewContextFolder) {
        this.highlightFolder(this.viewContextFolder)
      } else {
        this.unselect()
      }
    },
  },

  methods: {
    //NavMenusが選択された場合フォルダの選択を外す
    unselect() {
      this.isSelectingNavFolder = false
      this.activatedFolder = []
    },

    onClickFolder(folder) {
      this.highlightFolder(folder.id)
      //このイベントが親コンポーネントとやりとりする
      this.$emit("select", folder)
    },

    //クリック時の処理はしないけどハイライトはするやつ
    highlightFolder(folderID) {
      this.isSelectingNavFolder = true
      this.activatedFolder = [folderID]
    },

    rightClickFolder(folder) {
      this.$refs.folderContextMenu.show(folder.id)
    },

    onOpenFolder() {
      this.saveOpenedFolders()
    },

    //開いたフォルダの情報を保存する。3秒間操作しなかった場合に実行
    saveOpenedFolders: debounce(function () {
      this.$config.set("renderer.folders.initiallyOpened", this.openedFolders)
    }, 3000),

    //フォルダを新規作成
    //parentID=1はすべての最上層フォルダが所属するrootフォルダ(非表示)
    async createNewFolder(parentID = 1) {
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

    onDragStart(event, folder) {
      event.dataTransfer.effectAllowed = "move"
      event.dataTransfer.dropEffect = "move"
      event.dataTransfer.setData("type", "folder")
      event.dataTransfer.setData("folder", JSON.stringify(folder))
    },

    async onDrop({ event, dropFolder }) {
      const dropType = event.dataTransfer.getData("type")

      if (dropType === "folder") {
        const dragFolder = JSON.parse(event.dataTransfer.getData("folder"))
        await this.dropFolder(dragFolder, dropFolder)
      } else if (dropType === "content") {
        const targetContents = JSON.parse(
          event.dataTransfer.getData("targetContents")
        )
        await this.dropContents(targetContents, dropFolder)

        //ファイルを直接ドロップした場合
      } else if (event.dataTransfer.types.includes("Files")) {
        const files = event.dataTransfer.files
        this.dropFiles(files, dropFolder)
      }
    },

    //フォルダからフォルダにドラッグ＆ドロップした場合
    async dropFolder(dragTarget, dropTarget) {
      await this.$folders.changeParent(dragTarget.id, dropTarget.id)
    },

    async dropContents(contents, folder) {
      await this.$contents.update(contents, {
        folderID: folder.id,
      })

      if (contents.length === this.$store.state.edit.selectedIDs.length) {
        this.$store.dispatch("endEditMode")
      }
    },

    async dropFiles(files, folder) {
      await this.$contents.create({
        files,
        folderID: folder.id,
      })
    },
  },

  mounted() {},
}
</script>

<style>
.app-folders-menu-wrapper {
  flex: 1 1 100%;
}

.app-folders-menu-wrapper .v-subheader {
  margin: 0;
}
.app-folders-menu .v-treeview-node__root {
  font-size: 14px;
  margin: 1px 0;
  cursor: pointer;
  user-select: none;
}

.app-folders-menu .v-treeview-node__root:before {
  border-radius: 4px;
  margin: 0 8px;
  transition-duration: 0.4s;
}

.app-folders-menu .v-treeview-node__toggle {
  z-index: 2;
}
</style>
