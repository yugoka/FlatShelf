import Vue from "vue"
import Vuex from "vuex"
import { merge, cloneDeep } from "lodash"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    settings: {},
    folders: {},
    isSideMenuShown: true,
    sideMenuWidth: 0,
    notice: {},
    viewContext: {
      folders: [1],
      word: null,
    },
    isSelectMode: false,
    selectedItems: [],
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
    setSideMenuWidth(state, sideMenuWidth) {
      state.sideMenuWidth = sideMenuWidth
    },
    //通知を追加する
    setNotice(state, notice) {
      state.notice = notice
    },
    mergeContext(state, context) {
      state.viewContext = cloneDeep(merge(state.viewContext, context))
    },
    setContext(state, context) {
      state.viewContext = context
    },
    setSelectedItems(state, items) {
      state.selectedItems = items
    },
    addSelectedItem(state, contentID) {
      state.selectedItems.push(contentID)
    },
    removeSelectedItem(state, contentID) {
      state.selectedItems = state.selectedItems.filter((item) => {
        return item != contentID
      })
      //選択アイテム数が0になったら選択モードもオフにする
      if (!state.selectedItems.length) {
        state.isSelectMode = false
      }
    },
    setSelectMode(state, boolean) {
      state.isSelectMode = boolean
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

    //選択モードを終了する
    endSelectMode({ commit }) {
      commit("setSelectedItems", [])
      commit("setSelectMode", false)
    },
  },
})

export default store
