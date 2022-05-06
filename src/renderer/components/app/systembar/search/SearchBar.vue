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
    <v-card ref="card" class="menu-card px-1 pb-3">
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
      <v-divider class="mb-2" />
      <v-row class="mx-2">
        <v-col col-6>
          <div class="mb-1 subtitle-2">タグ</div>
          <TagPicker
            ref="tagPicker"
            class="tag-picker"
            @update="onTagsUpdate"
          />
        </v-col>
        <v-col col-6>
          <div class="mb-1 subtitle-2">フォルダ</div>
          <FolderSelector
            :folderID="context.folder"
            @select="onFolderSelect"
            @unselect="onFolderUnselect"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script>
import TagPicker from "../../../tags/TagPicker.vue"
import FolderSelector from "../../../folders/FolderSelector.vue"
import { cloneDeep } from "lodash"

export default {
  components: { TagPicker, FolderSelector },

  data() {
    return {
      menu: false,
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
    onTagsUpdate(tags) {
      this.context.tags = tags.map((tag) => tag.tagID)
    },

    onFolderSelect(folder) {
      this.context.folder = folder.id
    },

    onFolderUnselect() {
      this.context.folder = null
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

.tag-picker {
  display: inline-block;
}
</style>
