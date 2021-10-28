<template>
  <v-app>
    <SystemBar/>

    <SideBar/>

    <div id="main-content">
      <v-main>
        <router-view/>
      </v-main>
    </div>
  </v-app>
</template>

<script>

import SideBar from "./components/app/sidemenu/AppSideBar"
import SystemBar from "./components/app/SystemBar"

export default {
  name: 'App',

  components: {
    SideBar,
    SystemBar
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
    margin-top: 25px;
    width: 100vw;
    height: calc(100vh - 25px);
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