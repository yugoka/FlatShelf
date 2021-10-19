import Vue from "vue"
import App from "./App.vue"
import Vuex from "vuex"
import vuetify from "./plugins/vuetify"
import store from "./store"
import router from "./router"

//これは自作プラグイン
import rendererConfigManager from "./plugins/renderer-config-manager"

Vue.config.productionTip = false
Vue.use(Vuex)

//各モジュールでthis.$configを使えるようにする
Vue.prototype.$config = rendererConfigManager

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app")
