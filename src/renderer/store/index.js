import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    settings: {},
    folders: {},
    isSideMenuShown: true
  },
  mutations: {
    //レンダラー設定をまとめて保存する
    setConfig(state, settings) {
      state.settings = settings
    },
    setFolders(state, folders) {
      state.folders= folders
    },
    toggleSideMenu(state, sideBarStatus) {
      state.isSideMenuShown = sideBarStatus
    }
  },
  actions: {
    //dispatchとかはいらないのでcontext.commitとcontext.stateだけ引数に取る
    //サイドバー切り替えをしたい場合イベントからの引数でnullを明示的に指定する必要があるので注意
    toggleSideMenu({ commit, state }, sideBarStatus = null) {
      if (sideBarStatus === null || sideBarStatus === undefined) {
        commit("toggleSideMenu", !state.isSideMenuShown)
      } else {
        commit("toggleSideMenu", sideBarStatus)
      }
    }
  }
})

export default store
