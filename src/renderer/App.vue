<template>
  <v-app>
    <SystemBar/>

    <SideMenu/>

    <ContentsEditMenu/>

    <div id="main-content">
      <v-main>
        <router-view/>
      </v-main>
    </div>
  </v-app>
</template>

<script>

import SystemBar from "./components/app/systembar/SystemBar"
import SideMenu from "./components/app/sidemenu/AppSideMenu"
import ContentsEditMenu from "./components/app/editmenu/AppEditMenu"

export default {
  name: 'App',

  components: {
    SystemBar,
    SideMenu,
    ContentsEditMenu
  },

  data() {
    return {

    }
  },

  methods: {

  },

  computed: {

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
#main-content {
  margin-top: 30px;
  width: 100vw;
  height: calc(100vh - 30px);
  flex-direction: column;
  overflow-y: scroll;
}

#main-content::-webkit-scrollbar {
  overflow:visible;
  width: 8px;
}
#main-content::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,.3); 
  border-radius: 4px;
}
</style>