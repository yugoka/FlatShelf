import Vue from "vue"
import App from "./App.vue"
import Vuex from "vuex"
import vuetify from "./plugins/vuetify"
import store from "./store"
import router from "./router"

//------------------------------------
// マネージャー類の読み込み
//------------------------------------
import rendererConfigManager from "./managers/renderer-config-manager"
import rendererContentsManager from "./managers/renderer-contents-manager"
import rendererFoldersManager from "./managers/renderer-folders-manager"
//各コンポーネントでthis.$config, this.$contentsという感じでマネージャを使えるようにする
Vue.prototype.$config = rendererConfigManager
Vue.prototype.$contents = rendererContentsManager
Vue.prototype.$folders = rendererFoldersManager

Vue.config.productionTip = false
Vue.use(Vuex)

;(async () => {
  //------------------------------------
  // 初期設定読み込み
  //------------------------------------
  //設定ファイルを読み込む。今は同期的だけど起動速度が心配なので非同期にすることも要検討
  await rendererConfigManager.initSettings()
  //this.$config.main, this.$config.rendererで設定にアクセスできるようにする
  rendererConfigManager.main = store.state.settings.main
  rendererConfigManager.renderer = store.state.settings.renderer
  //フォルダ構造を読み込んでstoreに格納する。
  rendererFoldersManager.getStructure()

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount("#app")
})()
