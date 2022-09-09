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
        editMenuWidth: 250,
      },
      folders: {
        initiallyOpened: [],
      },
      search: {
        showItemName: false,
        itemSize: 150,
        layout: "brick",
        query: {
          includeDecendantFolders: false,
        },
      },
      viewer: {
        book: {
          showImgName: true,
          //空のフォルダをスキップする
          skipBlankFolder: true,
          pageInversion: false,
        },
      },
    },

    //=======メインプロセス設定=======//
    main: {
      window: {
        size: [1200, 900],
        position: [360, 90],
      },
      import: {
        //インポート時に同人誌のデータをスクレイピングするかどうか
        getBookDataOnImport: false,
        getTagOnScraping: false,
      },
    },
  },
}

export const store = new Store({
  defaults,
  cwd: WORKING_SPACE,
})
