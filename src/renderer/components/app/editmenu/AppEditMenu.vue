<template>
  <v-navigation-drawer
    class="pb-10"
    app
    stateless
    right
    id="editmenu"
    v-model="show"
    :width="sideBar.width"
  >
    <FolderMoveDialog ref="folderMoveDialog" />
    <div>
      <v-btn icon small class="mt-1 ms-1" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <div v-if="contents.length" class="mx-1">
      <div class="editmenu-img-wrapper">
        <img
          class="editmenu-img rounded elevation-4"
          :src="$contents.getThumbnail(contents[contents.length - 1])"
        />
      </div>

      <v-divider />

      <div class="mx-3">
        <v-text-field
          v-if="contents.length === 1"
          v-model.lazy="name"
          @input="onChange('name')"
          class="mt-6 mb-2"
          dense
          outlined
          label="タイトル"
          counter="255"
        />

        <div v-else class="mt-2 body-2 text-center">
          {{ contents.length }}件のアイテムを選択中
        </div>

        <v-textarea
          @input="onChange('description')"
          counter="1000"
          class="my-2"
          outlined
          label="説明"
          v-model.lazy="description"
        />

        <v-text-field
          v-model.lazy="author"
          @input="onChange('author')"
          class="mb-1"
          dense
          outlined
          label="作者名"
          counter="50"
        />

        <div class="tag-box">
          <div>
            <span class="body-2">タグ</span>

            <v-btn
              icon
              small
              class="tag-box-button mb-1"
              @click="clickTagEditButton"
            >
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>
          </div>
          <TagBox ref="tagBox" class="mt-1 mb-2" :contentIDs="contentIDs" />
        </div>

        <div class="body-2">フォルダ</div>
        <v-chip class="my-3" small block @click="moveFolder">
          <v-icon class="me-2"> mdi-folder </v-icon>
          <span v-if="folder">{{ folder[0].name }}</span>
          <span v-else>フォルダを選択</span>
        </v-chip>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import debounce from "lodash.debounce"
import { SideMenuDragger } from "../side-menu-dragger"
import FolderMoveDialog from "../../window/FolderMoveDialog.vue"
import TagBox from "./TagBox.vue"

export default {
  name: "EditMenu",

  components: {
    FolderMoveDialog,
    TagBox,
  },

  data() {
    return {
      changes: {},
      name: null,
      description: null,
      author: null,
      folder: null,
      sideBar: {
        width: 250,
      },
    }
  },

  computed: {
    show: {
      get() {
        return this.$store.state.edit.editMode
      },
      set(boolean) {
        if (boolean) {
          this.$store.commit("setEditMode", true)
        } else {
          this.$store.dispatch("endEditMode")
        }
      },
    },
    contents() {
      return this.$store.state.edit.selectedContents
    },
    contentIDs() {
      return this.$store.state.edit.selectedIDs
    },
    selectedMany() {
      return this.contentIDs.length >= 2
    },
    viewContext() {
      return this.$store.state.viewContext
    },
  },

  watch: {
    async contents() {
      if (this.contentIDs.length) {
        await this.getCommonValues()
      }
    },
    viewContext() {
      this.show = false
    },
  },

  methods: {
    close() {
      this.$store.dispatch("endEditMode")
    },

    onChange(valueName) {
      this.changes[valueName] = this[valueName]
      this.save()
    },

    save: debounce(async function () {
      await this.$contents.update(this.contentIDs, this.changes)
      this.changes = {}
    }, 200),

    moveFolder() {
      this.$refs.folderMoveDialog.show(this.contentIDs)
    },

    clickTagEditButton() {
      this.$refs.tagBox.clickCard()
    },

    //選択中のアイテム全てに共通する編集項目を抜き出して保存する
    //nameまでもを適用する必要はないかも？
    async getCommonValues() {
      const commonValues = await this.$contents.checkCommonValues(
        this.contentIDs,
        ["name", "description", "author", "folderID"]
      )
      if (!commonValues) return

      for (const column of ["name", "description", "author"]) {
        this[column] = commonValues[column]
      }

      this.folder = commonValues.folderID
        ? await this.$folders.getData(this.contents[0].folderID)
        : null
    },
  },

  mounted() {
    //幅調整用クラス
    this.sideBar = new SideMenuDragger({
      menuID: "#editmenu",
      menuName: "editMenu",
      width: this.$config.renderer().app.editMenuWidth,
      minWidth: 125,
      maxWidth: 600,
      right: true,
    })

    //幅調整開始のイベント登録
    const sideBarDragger = this.$el.querySelector(
      ".v-navigation-drawer__border"
    )
    sideBarDragger.addEventListener("mousedown", () => {
      this.sideBar.startDragging()
    })
  },
}
</script>

<style>
#editmenu {
  margin-top: 30px;
  transition: unset;
}
#editmenu .editmenu-img-wrapper {
  display: flex;
  align-items: center;
  height: 150px;
  margin: 5px 5px 10px;
}
#editmenu .editmenu-img {
  vertical-align: top;
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}
#editmenu .editmenu-img-chip {
  position: absolute;
}
#editmenu ::-webkit-scrollbar {
  overflow: visible;
  width: 4px;
  opacity: 0;
}
#editmenu ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0);
  border-radius: 2px;
}
#editmenu:hover ::-webkit-scrollbar {
  opacity: 1;
}
#editmenu:hover ::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
}

/*サイドメニュー幅調整*/
#editmenu .v-navigation-drawer__border {
  background-color: transparent;
  width: 5px !important;
  cursor: col-resize;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  user-select: none;
}
#editmenu .v-navigation-drawer__border:hover,
#editmenu .v-navigation-drawer__border.dragging {
  /*この色はハードコーディングなので注意*/
  background-color: #489aeb !important;
  cursor: col-resize;
  transition: 0.2s;
  transition-delay: 150ms;
}
#editmenu.no-transition {
  transition: none;
}

#editmenu .tag-box-button {
  opacity: 0;
  transition: opacity 0.2s;
}

#editmenu .tag-box:hover .tag-box-button {
  opacity: 1;
}
</style>
