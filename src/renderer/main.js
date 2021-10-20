import Vue from "vue"
import App from "./App.vue"
import Vuex from "vuex"
import vuetify from "./plugins/vuetify"
import store from "./store"
import router from "./router"

//これは自作プラグイン
import rendererConfigManager from "./managers/renderer-config-manager"

Vue.config.productionTip = false
Vue.use(Vuex)

//各モジュールでthis.$configを使えるようにする
Vue.prototype.$config = rendererConfigManager
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
