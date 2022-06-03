<template>
  <v-app>
    <SystemBar />

    <SideMenu />

    <ContentsEditMenu />

    <NoticeChip />

    <div id="main-content">
      <v-main id="main">
        <transition name="fade">
          <router-view />
        </transition>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import SystemBar from "./components/app/systembar/SystemBar"
import SideMenu from "./components/app/sidemenu/SideMenu"
import ContentsEditMenu from "./components/app/editmenu/AppEditMenu"
import NoticeChip from "./components/app/NoticeChip"

export default {
  name: "App",

  components: {
    SystemBar,
    SideMenu,
    ContentsEditMenu,
    NoticeChip,
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
}

#main-content {
  margin-top: 30px;
  width: 100vw;
  height: calc(100vh - 30px);
  overflow-y: scroll;
}

#main-content::-webkit-scrollbar {
  display: none;
}

#main .slide-enter-active,
#main .slide-leave-active {
  max-width: 100%;
  transition: all 0.3s ease-out;
}

#main .slide-enter-to {
  position: absolute;
  right: 0;
}

#main .slide-enter {
  position: absolute;
  right: -100%;
}

#main .slide-leave-to {
  position: absolute;
  left: -100%;
}

#main .slide-leave {
  position: absolute;
  left: 0;
}
</style>
