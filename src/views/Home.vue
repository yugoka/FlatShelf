<template>
  <div class="home">
    ここはホームです<br>
    Electron {{ipcTestdata}}
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
      ipcTestdata: ""
    }
  },

  methods: {
    toggleSideMenu(sideBarStatus) {
      this.$store.dispatch('toggleSideMenu', sideBarStatus)
    },
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  },

  async mounted() {
    this.ipcTestdata = await window.ipc.getRendererSettings()
  }
}
</script>

<style>
</style>