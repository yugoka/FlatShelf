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
    edit: {
      editMode: false,
      selectedIDs: [],
      selectedContents: [],
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
      state.edit.selectedIDs = items
      state.edit.editMode = !!items.length
    },
    addSelectedItem(state, contentID) {
      state.edit.selectedIDs.push(contentID)
    },
    removeSelectedItem(state, contentID) {
      state.edit.selectedIDs = state.edit.selectedIDs.filter((item) => {
        return item != contentID
      })
      //選択アイテム数が0になったら選択モードもオフにする
      if (!state.edit.selectedIDs.length) {
        state.edit.editMode = false
      }
    },
    setEditMode(state, boolean) {
      state.edit.editMode = boolean
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
    endEditMode({ commit }) {
      commit("setSelectedItems", [])
      commit("setEditMode", false)
    },
  },
})

export default store
