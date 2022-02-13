<template>
  <v-app>
    <SystemBar/>

    <SideMenu/>

    <ContentsEditMenu/>

    <NoticeChip/>

    <div id="main-content">
      <v-main id="main">
        <router-view/>
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
  name: 'App',

  components: {
    SystemBar,
    SideMenu,
    ContentsEditMenu,
    NoticeChip
  },

  data() {
    return {

    }
  },

  computed: {

  },

  methods: {

  },

  mounted() {
    setTimeout(() => {
      this.$el.scrollTop = 1000
    }, 3090)
  }

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
  flex-direction: column;
  overflow-y: scroll;
}

#main-content::-webkit-scrollbar {
  display: none;
}
</style>