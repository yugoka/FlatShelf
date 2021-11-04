<template>
  <div class="home">
    ここはホームです<br/>
    {{settings.renderer}}
    {{settings.renderer.test}}
    <div class="my-4">
      <v-btn @click="toggleSideMenu(null)">切り替え</v-btn>
      <v-btn @click="toggleSideMenu(false)">閉じる</v-btn>
      <v-btn @click="toggleSideMenu(true)">開く</v-btn>
      <v-btn @click="toggleDarkMode">ダークモード</v-btn>
    </div>
    <div class="my-4">
      <v-text-field
        v-model="configKey"
      />
      <v-text-field v-model="configValue"/>
      <v-btn
        @click="setConfig"
        color="primary"
      >
        設定保存テスト
        <v-icon
          right
          dark
        >
          mdi-upload
        </v-icon>
      </v-btn>
    </div>
    <div class="my-5">
      <v-file-input 
        v-model="importFile"
        label="ファイルを選択"
      />
      <v-btn @click="testSaveContent" color="primary">データ保存テスト</v-btn>
    </div>
    <div class="my-5">
      <v-text-field v-model="searchWord"/>
      <v-btn @click="searchTest" color="primary">
        検索テスト
      </v-btn>
    </div>
    <ul class="mx-5">
      <li v-for="image in images" :key="image.dataValues.contentID">
        <v-img :src="`file://${image.dataValues.filePath}`"/>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',

  data() {
    return {
      configKey: "renderer.key",
      configValue: "value",
      searchWord: "img.jpg",
      importFile: null,
      images: []
    }
  },

  mounted() {
    this.$vuetify.theme.dark = this.darkmode
  },

  computed: {
    settings() {
      return this.$store.state.settings
    },

    darkmode() {
      return this.$store.state.settings.renderer.darkmode
    }
  },

  watch: {
    darkmode() {
      this.$vuetify.theme.dark = this.darkmode
    }
  },

  methods: {
    toggleSideMenu(sideBarStatus) {
      this.$store.dispatch('toggleSideMenu', sideBarStatus)
    },
    toggleDarkMode() {
      this.$config.set("renderer.darkmode", !this.darkmode)
    },
    setConfig() {
      this.$config.set(this.configKey, this.configValue)
    },
    async testSaveContent() {
      const result = await this.$contents.create(this.importFile)
      console.log(`result: ${result}`)
    },
    async searchTest() {
      const query = {searchWord: this.searchWord}
      const result = await this.$contents.search(query)
      console.log(result)
      this.images = result.dataValues
    }
  },

}
</script>

<style>
</style>