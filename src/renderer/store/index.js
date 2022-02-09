import Vue from "vue"
import Vuex from "vuex"
import { merge, cloneDeep } from "lodash"
import contentsManager from "../managers/renderer-contents-manager"

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
    setSelectedItems(state, contents) {
      state.edit.selectedContents = contents
      state.edit.selectedIDs = contents.map((content) => content.contentID)
      state.edit.editMode = !!contents.length
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

    async setSelectedItems({ commit, state }, inputValue) {
      const IDs = Array.isArray(inputValue) ? inputValue : [inputValue]
      const contents = await contentsManager.getData(IDs)
      commit("setSelectedItems", contents)
    },

    async addSelectedItems({ commit, state }, inputValue) {
      const IDs = Array.isArray(inputValue) ? inputValue : [inputValue]
      const contents = await contentsManager.getData(IDs)
      commit("setSelectedItems", [...state.edit.selectedContents, ...contents])
    },

    removeSelectedItems({ commit, state }, inputValue) {
      const IDs = Array.isArray(inputValue) ? inputValue : [inputValue]
      const contents = state.edit.selectedContents.filter((content) => {
        return !IDs.includes(content.contentID)
      })

      commit("setSelectedItems", contents)
    },

    //選択モードを終了する
    endEditMode({ commit }) {
      commit("setSelectedItems", [])
    },
  },
})

export default store
