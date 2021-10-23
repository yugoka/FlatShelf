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
    <div style="height: 400px;">あああ</div>
    <div style="height: 400px;">あああ</div>
    <div style="height: 400px;">あああ</div>
    <div style="height: 400px;">あああ</div>
    <div style="height: 400px;">あああ</div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',

  data() {
    return {
      configKey: "renderer.key",
      configValue: "value"
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
    }
  },

}
</script>

<style>
</style>