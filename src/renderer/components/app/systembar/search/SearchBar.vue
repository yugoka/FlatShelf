<template>
  <v-menu
    content-class="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-left="cardNudgeLeft"
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom open-delay="300">
        <template v-slot:activator="{ on: tooltip }">
          <v-chip
            class="mx-1"
            small
            label
            outlined
            v-bind="{ attrs }"
            v-on="{ ...tooltip, ...menu }"
          >
            <div class="search-chip-text-wrapper">
              <v-icon>mdi-magnify</v-icon>
              {{ context.word ? context.word : "検索" }}
            </div>
          </v-chip>
        </template>
        <span class="caption">アイテムを検索</span>
      </v-tooltip>
    </template>
    <v-card ref="card" class="menu-card px-1">
      <div ref="input">
        <v-text-field
          class="text-field"
          autofocus
          flat
          solo
          dense
          hide-details
          placeholder="検索してみよう"
          :persistent-placeholder="!context.word"
          v-model="context.word"
          @keypress.enter="executeSearch"
        >
          <template v-slot:prepend-inner>
            <v-btn icon color="primary" @click="executeSearch">
              <v-icon color="primary">mdi-magnify</v-icon>
            </v-btn>
          </template>
          <template v-slot:append>
            <v-btn icon x-small @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
      <v-divider />

      <v-tabs v-model="tab" grow height="30">
        <v-tab class="body-2">
          <v-icon class="me-1" small>mdi-layers-search-outline</v-icon>
          検索対象
        </v-tab>
        <v-tab class="body-2">
          <v-icon class="me-1" small>mdi-filter-variant</v-icon>
          フィルター
        </v-tab>
        <v-tab class="body-2">
          <v-icon class="me-1" small>mdi-cog</v-icon>
          設定
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <ColumnSelector @select="onSearchColumnUpdate" />
        </v-tab-item>

        <v-tab-item eager>
          <v-row no-gutters class="mt-2 mx-1 pb-4">
            <v-col cols="7" class="tagpicker-area px-1">
              <div class="ms-2 mb-2 subtitle-2">タグ</div>

              <TagPicker ref="tagPicker" @update="onTagsUpdate" mode="card" />
            </v-col>

            <v-col cols="5" class="px-1">
              <div class="mb-2 subtitle-2">フォルダ</div>
              <FolderSelector
                class="folder-selector"
                :folderID="context.folder"
                @select="onFolderSelect"
                @unselect="onFolderUnselect"
              />
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item> 設定画面</v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-menu>
</template>

<script>
import TagPicker from "../../../tags/tagpicker/TagPicker.vue"
import FolderSelector from "../../../folders/FolderSelector.vue"
import { cloneDeep } from "lodash"
import ColumnSelector from "./ColumnSelector.vue"

export default {
  components: { TagPicker, FolderSelector, ColumnSelector },

  data() {
    return {
      menu: false,
      tab: 0,
      cardNudgeLeft: 113.5,
      context: {
        word: "",
      },
    }
  },

  computed: {
    //現在検索対象のフォルダ
    viewContext() {
      return this.$store.state.viewContext
    },
    contextChanged() {
      return (
        this.context.word.length ||
        (Array.isArray(this.context.tags) && this.context.tags.length)
      )
    },
  },

  watch: {
    menu() {
      if (this.menu) {
        this.$nextTick(() => this.syncContext())
      }
    },
  },

  methods: {
    close() {
      this.menu = false
    },

    //メニューを開いた時this.contextとviewContextを同期する。
    //this.contextはviewContextとは別で動き、executeされた時に初めてviewContextに反映される。
    //これを実現するためにlodash.cloneDeepを使っている
    async syncContext() {
      this.context = cloneDeep(this.viewContext)
      const selectedTags = await this.$tags.get({
        ids: this.context.tags,
        idMode: true,
      })

      this.$refs.tagPicker.setSelectedTags(selectedTags)
    },

    executeSearch() {
      if (this.menu) {
        //検索画面に居るならシンプルに検索
        if (this.$route.name === "Search") {
          this.$search.mergeContext(this.context)

          //検索画面でないなら検索画面に飛ぶ
        } else {
          this.$search.setContext(this.context)
          this.$router.push({ name: "Search" })
        }

        this.menu = false
      }
    },

    openTagPicker() {
      this.$refs.tagPicker.show()
    },

    onTagsUpdate(tags) {
      this.context.tags = tags.map((tag) => tag.tagID)
    },

    onFolderSelect(folder) {
      this.context.folder = folder.id
    },

    onFolderUnselect() {
      this.context.folder = null
    },

    //現状SearchColumnのコンポーネント内部値をcontextと同期する仕様はないので注意
    onSearchColumnUpdate(columns) {
      this.context.searchColumns = columns.map((column) => column.column)
    },
  },
}
</script>

<style scoped>
.menu {
  top: 5px !important;
  width: 400px;
}
.menu-card {
  width: 100%;
}
.menu-input-field {
  border: none !important;
}
.search-chip-text-wrapper {
  margin-inline-end: 100px;
}
.folder-selector {
  display: inline-block;
  max-width: 100%;
}
</style>
