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
            class="mx-1 ps-3 pe-2"
            small
            label
            outlined
            v-bind="{ attrs }"
            v-on="{ ...tooltip, ...menu }"
          >
            <div class="search-chip-text-wrapper">
              <v-icon small>mdi-magnify</v-icon>
              {{ context.word ? context.word : "検索" }}
            </div>
            <v-btn v-show="context.word" icon x-small @click.stop="resetSearch">
              <v-icon small class="mx-0"> mdi-close </v-icon>
            </v-btn>
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

      <ColumnSelector @select="onSearchColumnUpdate" />
    </v-card>
  </v-menu>
</template>

<script>
import { cloneDeep } from "lodash"
import ColumnSelector from "./ColumnSelector.vue"

export default {
  components: { ColumnSelector },

  data() {
    return {
      menu: false,
      tab: 0,
      cardNudgeLeft: 113.5,
      context: {
        word: "",
        searchColumns: null,
      },
    }
  },

  watch: {
    menu() {
      if (this.menu) {
        const word = this.context.word
        this.$nextTick(() => {
          this.syncContext()
          this.context.word = word
        })
      }
    },
  },

  methods: {
    close() {
      this.resetSearch()
      this.menu = false
    },

    //メニューを開いた時this.contextとviewContextを同期する。
    //this.contextはviewContextとは別で動き、executeされた時に初めてviewContextに反映される。
    //これを実現するためにlodash.cloneDeepを使っている
    async syncContext() {
      this.context = cloneDeep(this.$store.state.viewContext)
    },

    executeSearch() {
      //検索画面に居るならシンプルに検索
      if (this.$route.name === "Search") {
        this.$search.mergeContext(this.context)

        //検索画面でないなら検索画面に飛ぶ
      } else {
        this.$search.setContext(this.context)
        this.$search.redirect()
      }

      this.menu = false
    },

    //現状SearchColumnのコンポーネント内部値をcontextと同期する仕様はないので注意
    //要するにColumnSelector→contextの一方向バインディング
    onSearchColumnUpdate(columns) {
      this.context.searchColumns = columns.map((column) => column.column)
    },

    resetSearch() {
      this.context.word = ""
      this.executeSearch()
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
  min-width: 150px;
}
.folder-selector {
  display: inline-block;
  max-width: 100%;
}
</style>
