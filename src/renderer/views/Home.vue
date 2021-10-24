<template>
  <div class="home">
    ここはホームです<br>
    {{settings.renderer}}
    {{settings.renderer.test}}
    <div class="my-4">
      <v-btn @click="toggleSideMenu(null)">切り替え</v-btn>
      <v-btn @click="toggleSideMenu(false)">閉じる</v-btn>
      <v-btn @click="toggleSideMenu(true)">開く</v-btn>
      <v-btn @click="toggleDarkMode">ダークモード</v-btn>
      <v-btn @click="testSaveContent">データ保存テスト</v-btn>
    </div>
    <div class="my-4">
      <v-text-field v-model="configKey"></v-text-field>
      <v-text-field v-model="configValue"></v-text-field>
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
    <div>
      <v-text-field v-model="searchWord"></v-text-field>
      <v-btn @click="searchTest">
        
      </v-btn>
    </div>
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
      searchWord: "img.png"
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
      const data = {
        filePath: "C:\\Users\\watas\\Downloads\\img.jpg"
      }

      const result = await this.$contents.create(data)
      console.log(`result: ${result}`)
    }
  },

}
</script>

<style>
</style>