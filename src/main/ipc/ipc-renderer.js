const { contextBridge, ipcRenderer } = require("electron")

//------------------------------------
// プリロード設定
// レンダラー側でNode APIにアクセスする場合はこれを使う
// 要するにレンダラーロセス側の通信APIだよ
//------------------------------------
contextBridge.exposeInMainWorld("ipc", {
  //------------------------------------
  // 往復通信：メイン⇔レンダラー
  //------------------------------------

  //------------------------------------
  // 設定関連
  //------------------------------------
  //レンダラープロセス用の設定を取得
  getAllSettings: async () => {
    return await ipcRenderer.invoke("get-all-settings")
  },

  //レンダラープロセスから設定を更新する
  setConfig: async (key, value) => {
    return await ipcRenderer.invoke("set-config", { key, value })
  },

  //------------------------------------
  // コンテンツ関連
  //------------------------------------

  //コンテンツ作成
  //dataは必ずfilePathをプロパティに持つ
  createContent: async file => {
    return await ipcRenderer.invoke("create-content", { file })
  },

  //コンテンツ検索
  searchContent: async query => {
    return await ipcRenderer.invoke("search-content", { query })
  },

  //------------------------------------
  // フォルダ関連
  //------------------------------------

  //サイドバー表示用のフォルダ構造を取得
  getFoldersStructure: async () => {
    return await ipcRenderer.invoke("get-folders-structure")
  },

  createNewFolder: async (targetID) => {
    return await ipcRenderer.invoke("create-new-folder", { targetID })
  },


  //------------------------------------
  // 片道通信：レンダラー→メイン
  //------------------------------------

  quitApp: () => {
    ipcRenderer.send("quit-app")
  },
  minimizeMainWindow: () => {
    ipcRenderer.send("minimize-main-window")
  },
  maximizeMainWindow: () => {
    ipcRenderer.send("maximize-main-window")
  }

  //------------------------------------
  // 片道通信：メイン→レンダラー
  //------------------------------------
})
