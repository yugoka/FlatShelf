import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    settings: {},
    isSideMenuShown: true
  },
  mutations: {
    //レンダラー設定をまとめて保存する
    setConfigAll(state, settings) {
      state.settings = settings
    },
    toggleSideMenu(state, sideBarStatus) {
      state.isSideMenuShown = sideBarStatus
    }
  },
  actions: {
    //dispatchとかはいらないのでcontext.commitとcontext.stateだけ引数に取る
    toggleSideMenu({ commit, state }, sideBarStatus = null) {
      //切り替えをしたい場合イベントからの引数でnullを明示的に指定する必要があるので注意
      if (sideBarStatus === null || sideBarStatus === undefined) {
        commit("toggleSideMenu", !state.isSideMenuShown)
      } else {
        commit("toggleSideMenu", sideBarStatus)
      }
    }
  }
})

export default store
