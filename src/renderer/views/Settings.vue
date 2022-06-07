<template>
  <div>
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
          >
            <template v-slot:append>
              <v-btn v-if="searchWord" icon small @click="clearSearch">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-text-field>

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
        {
          id: "renderer.darkmode",
          label: "ダークモード",
          type: "check",
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
            { label: "グリッドレイアウト", value: "grid", icon:"mdi-grid-large" },
          ]
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

<style scoped></style>
