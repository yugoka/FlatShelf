<template>
  <div class="settings-wrapper">
    <BackToSearchButton type="fixed" class="mt-4 ml-2" />
    <v-container>
      <v-row class="pt-1" justify="center">
        <v-col cols="10">
          <v-text-field
            v-model="searchWord"
            solo
            dense
            prepend-inner-icon="mdi-magnify"
            placeholder="設定項目を検索"
            class="search-field"
            clearable
          />

          <SettingsRow
            v-for="data in searchResult"
            :key="data.id"
            :data="data"
          />

          <div v-if="!searchResult.length" class="mt-5 body-2 text-center">
            検索条件と一致する設定項目がありません。<br />
            <a @click="clearSearch">ここをクリックして検索条件をクリア</a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BackToSearchButton from "../components/app/miniparts/BackToSearchButton.vue"
import SettingsRow from "../components/settings/SetttingsRow.vue"
import debounce from "lodash.debounce"

export default {
  components: { BackToSearchButton, SettingsRow },
  name: "Settings",

  data() {
    return {
      searchWord: "",
      searchResult: [],
      settings: [
        //---ディスプレイ設定---//
        {
          id: "separator-display",
          label: "ディスプレイ設定",
          type: "separator",
        },
        {
          id: "renderer.darkmode",
          label: "ダークモード",
          type: "switch",
        },
        //---検索設定---//
        {
          id: "separator-search",
          label: "検索設定",
          type: "separator",
        },
        {
          id: "renderer.search.showItemName",
          label: "検索結果にアイテム名を表示",
          type: "check",
        },
        {
          id: "renderer.search.query.includeDecendantFolders",
          label: "サブフォルダを含めて検索",
          description: "",
          type: "check",
        },
        {
          id: "renderer.search.layout",
          label: "検索のレイアウト",
          description: "",
          type: "select",
          selects: [
            { label: "水平レイアウト", value: "brick", icon: "mdi-wall" },
            {
              label: "グリッドレイアウト",
              value: "grid",
              icon: "mdi-grid-large",
            },
          ],
        },
        //---インポート設定---//
        {
          id: "separator-import",
          label: "インポート設定",
          type: "separator",
        },
        {
          id: "main.import.editOnImport",
          label: "インポート時に編集モードを開く",
          type: "switch",
        },
        {
          id: "main.import.getBookDataOnImport",
          label: "同人誌インポート時に販売サイトから情報を取得",
          type: "switch",
        },

        //---情報取得設定---//
        {
          id: "separator-scraping",
          label: "情報取得設定",
          type: "separator",
        },
        {
          id: "main.scraping.getTagOnScraping",
          label: "同人誌の情報取得時にタグを自動追加",
          type: "switch",
        },

        //---ブックビューア設定---//
        {
          id: "separator-viewer-book",
          label: "ブックビューア設定",
          type: "separator",
        },
        {
          id: "renderer.viewer.book.showImgName",
          label: "プレビューに画像のファイル名を表示",
          type: "check",
        },
        {
          id: "renderer.viewer.book.skipBlankFolder",
          label: "空のフォルダをスキップ",
          type: "check",
        },
      ],
    }
  },

  watch: {
    searchWord: debounce(function () {
      this.onSearchInput()
    }, 300),
  },

  methods: {
    back() {},
    clearSearch() {
      this.searchWord = ""
      this.onSearchInput()
    },
    onSearchInput() {
      if (this.searchWord) {
        const word = this.searchWord.toLowerCase()

        this.searchResult = this.settings.filter((data) => {
          return (
            data.id.toLowerCase().indexOf(word) != -1 ||
            data.label.toLowerCase().indexOf(word) != -1
          )
        })
      } else {
        this.searchResult = this.settings
      }
    },
  },

  created() {
    this.searchResult = this.settings
  },
}
</script>

<style scoped>
.settings-wrapper {
  height: 100%;
  overflow-y: scroll;
}

.settings-wrapper::-webkit-scrollbar {
  overflow: visible;
  width: 8px;
}
.settings-wrapper::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 4px;
}

.search-field {
  position: sticky;
  top: 16px;
  z-index: 2;
}
</style>
