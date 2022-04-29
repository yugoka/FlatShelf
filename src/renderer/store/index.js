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
    isFilterMenuShown: true,
    notice: {},
    viewContext: {
      folder: null,
      word: null,
      order: [["createdAt", "ASC"]],
      tags: []
    },
    edit: {
      editMode: false,
      selectedIDs: [],
      selectedContents: [],
    },
  },

  //computed的なアレと認識してる
  getters: {
    //stateのviewContextにsettings.renderer.search.queryを加えたもの
    //これstate.settingsが変わるたびに呼び出されてしまってるぽおい！
    //→config全部上書きしてるせいだわ
    viewContext(state) {
      console.log(state.viewContext)
      return {
        ...state.viewContext,
        config: state.settings.renderer.search.query,
      }
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
    toggleFilterMenu(state, menuStatus) {
      if (menuStatus === undefined) {
        state.isFilterMenuShown = !state.isFilterMenuShown
      } else {
        state.isFilterMenuShown = menuStatus
      }
    },
    //通知を追加する
    setNotice(state, notice) {
      state.notice = notice
    },
    mergeContext(state, context) {
      state.viewContext = cloneDeep(merge(state.viewContext, context))
    },
    //コンテキストを直接指定する。ただし並び替えだけは保持
    setContext(state, context) {
      const order = state.viewContext.order
      state.viewContext = context
      state.viewContext.order = order
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
      //追加するIDの内すでに存在するものは除く
      const filteredIDs = IDs.filter(
        (id) => !state.edit.selectedIDs.includes(id)
      )
      const contents = await contentsManager.getData(filteredIDs)
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
