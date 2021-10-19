<template>
  <div class="home">
    ここはホームです<br>
    {{settings.window.position}}
    <div class="my-4">
      <v-btn @click="toggleSideMenu(null)">切り替え</v-btn>
      <v-btn @click="toggleSideMenu(false)">閉じる</v-btn>
      <v-btn @click="toggleSideMenu(true)">開く</v-btn>
      <v-btn @click="toggleDarkMode">ダークモード</v-btn>
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
      settings: {
        window: {
          position: []
        }
      }
    }
  },

  async mounted() {
    //mountedで設定取得はちょっと違うと思う
    this.settings = await this.$config.getAllSettings()
  },

  methods: {
    toggleSideMenu(sideBarStatus) {
      this.$store.dispatch('toggleSideMenu', sideBarStatus)
    },
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  },

}
</script>

<style>
</style>