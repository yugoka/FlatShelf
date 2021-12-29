import Vue from "vue"
import Vuex from "vuex"
import { merge, cloneDeep } from "lodash"
import router from "../router"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    settings: {},
    folders: {},
    isSideMenuShown: true,
    notice: {},
    viewContext: {
      folders: [1],
      word: null,
    },
  },
  mutations: {
    //レンダラー設定をまとめて保存する
    setConfig(state, settings) {
      state.settings = settings
    },
    setFolders(state, folders) {
      state.folders = folders
    },
    toggleSideMenu(state, sideBarStatus) {
      state.isSideMenuShown = sideBarStatus
    },
    //通知を追加する
    setNotice(state, notice) {
      state.notice = notice
    },
    setContext(state, context) {
      //Search.vueのcomputedで監視するためにcloneDeepしてるけど余り良い実装ではなさそう
      state.viewContext = cloneDeep(merge(state.viewContext, context))
    },
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
    },
  },
})

export default store
