//------------------------------------
// 設定ファイルの初期化
//------------------------------------

const Store = require("electron-store")
//ワーキングスペースの場所を取得。保存場所はappdata/Roaming/flatshelf
const { WORKING_SPACE } = require("./global-settings")

//defaultsの読み込みを外部jsonにすることも検討
const defaults = {
  config: {
    //=======レンダラープロセス設定=======//
    renderer: {
      darkmode: false,
      app: {
        sideMenuWidth: 250,
      },
      folders: {
        initiallyOpened: [],
      },
      search: {
        showItemName: false,
      },
    },

    //=======メインプロセス設定=======//
    main: {
      window: {
        size: [1200, 900],
        position: [360, 90],
      },
    },
  },
}

export const store = new Store({
  defaults,
  cwd: WORKING_SPACE,
})
