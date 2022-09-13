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
      sideMenu: {},
      folders: {
        initiallyOpened: [],
      },
      search: {
        showItemName: true,
        itemSize: 200,
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

      //=======ヒント設定=======//
      //「trueで表示済み」なので注意
      tips: {
        openSideMenuAgain: false,
        browserSelectMany: false,
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
        getBookDataOnImport: true,
        //インポート時に編集モードを開く
        editOnImport: true,
      },
      scraping: {
        //同人誌データ取得時にタグを追加する
        getTagOnScraping: true,
      },
    },
  },
}

export const store = new Store({
  defaults,
  cwd: WORKING_SPACE,
})
