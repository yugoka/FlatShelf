const { ipcMain, app } = require("electron")
const { config } = require("../managers/main-config-manager")
const { folders } = require("../managers/main-folders-manager")
const { contents } = require("../managers/contents/main-contents-manager")

//------------------------------------
// IPCレシーバー設定
// レンダラーからpreload.js経由で発火したイベントをこちらで受け取る
//------------------------------------
export const registerIpcHandlers = ({mainWindow}) => {
  //------------------------------------
  // 相互通信：レンダラー⇔メイン
  //------------------------------------
  //レンダラープロセスの設定をすべて取得
  ipcMain.handle("get-all-settings", () => {
    return config.getAll()
  })

  ipcMain.handle("get-folders-structure", () => {
    return folders.getStructure()
  })

  //設定を保存する。成功した場合settingsオブジェクト全体、失敗した場合falseを返す
  ipcMain.handle("set-config", (event, { key, value }) => {
    const result = config.set(key, value)
    if (result) {
      return config.getAll()
    } else {
      return false
    }
  })

  //コンテンツ新規作成
  ipcMain.handle("create-content", (event, { file }) => {
    return contents.create(file)
  })

  ipcMain.handle("search-content", (event, { query }) => {
    return contents.search(query)
  })

  //------------------------------------
  // 片道通信：レンダラー→メイン
  //------------------------------------

  ipcMain.on("quit-app", () => {
    app.quit()
  })

  ipcMain.on("minimize-main-window", () => {
    mainWindow.minimize()
  })

  ipcMain.on("maximize-main-window", () => {
    mainWindow.maximize()
  })

}
