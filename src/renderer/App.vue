<template>
  <v-app>
    <SystemBar />

    <SideMenu />

    <ContentsEditMenu />

    <NoticeChip />

    <v-main id="main">
      <div class="viewport-wrapper">
        <div class="main-content">
          <transition name="fade">
            <router-view />
          </transition>
        </div>
        <div class="footer">
          <AppProgressBar />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import SystemBar from "./components/app/systembar/SystemBar"
import SideMenu from "./components/app/sidemenu/SideMenu"
import ContentsEditMenu from "./components/app/editmenu/AppEditMenu"
import NoticeChip from "./components/app/NoticeChip"
import AppProgressBar from "./components/app/progressbar/AppProgressBar.vue"

export default {
  name: "App",

  components: {
    SystemBar,
    SideMenu,
    ContentsEditMenu,
    NoticeChip,
    AppProgressBar,
  },

  data() {
    return {}
  },

  computed: {
    darkmode() {
      return this.$store.state.settings.renderer.darkmode
    },
  },

  watch: {
    darkmode() {
      this.$vuetify.theme.dark = this.darkmode
    },
  },

  methods: {},

  created() {
    this.$vuetify.theme.dark = this.darkmode
  },
}
</script>

<style>
/* 
  メインコンテンツの範囲を限定してスクロールバーを正しく出すようにしている。
  サイドバーやプログレスバーが出ている場合の設定はまだなので注意
*/
html {
  overflow: hidden;
}

#main {
  transition: unset;
  margin-top: 30px;
  height: calc(100vh - 30px);
}

#main .viewport-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#main .main-content {
  flex-grow: 1;
  flex-shrink: 1;
  min-height: calc(100% - 30px);
}

#main .footer {
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
