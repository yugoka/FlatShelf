import Vue from "vue"
import App from "./App.vue"
import Vuex from "vuex"
import vuetify from "./plugins/vuetify"
import store from "./store"
import router from "./router"

//これは自作プラグイン
import rendererConfigManager from "./managers/renderer-config-manager"
import rendererContentsManager from "./managers/renderer-contents-manager"

Vue.config.productionTip = false
Vue.use(Vuex)

//各モジュールでthis.$config, this.$contentsを使えるようにする
Vue.prototype.$config = rendererConfigManager
Vue.prototype.$contents = rendererContentsManager
;(async () => {
  //設定ファイルを読み込み。今は同期的だけど起動速度が心配なので非同期にすることも要検討
  await rendererConfigManager.initSettings()
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount("#app")
})()
