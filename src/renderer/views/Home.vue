<template>
  <div class="home">
    ここはホームです<br>
    {{settings}}
    <div class="my-4">
      <v-btn @click="toggleSideMenu(null)">切り替え</v-btn>
      <v-btn @click="toggleSideMenu(false)">閉じる</v-btn>
      <v-btn @click="toggleSideMenu(true)">開く</v-btn>
      <v-btn @click="toggleDarkMode">ダークモード</v-btn>
    </div>
    <div class="my-4">
      <v-text-field v-model="configKey"></v-text-field>
      <v-text-field v-model="configValue"></v-text-field>
      <v-btn @click="setConfig">設定保存テスト</v-btn>
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

  computed: {
    settings() {
      return this.$store.state.settings
    }
  },

  methods: {
    toggleSideMenu(sideBarStatus) {
      this.$store.dispatch('toggleSideMenu', sideBarStatus)
    },
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    setConfig() {
      this.$config.set(this.configKey, this.configValue)
    }
  },

}
</script>

<style>
</style>