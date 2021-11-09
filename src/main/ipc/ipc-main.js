const { ipcMain, app } = require("electron")
const { config } = require("../managers/main-config-manager")
const { folders } = require("../managers/folders/main-folders-manager")
const { contents } = require("../managers/contents/main-contents-manager")

//------------------------------------
// IPCレシーバー設定
// レンダラーからpreload.js経由で発火したイベントをこちらで受け取る
// 要するにメインプロセス側の通信APIだよ
//------------------------------------
export const registerIpcHandlers = ({mainWindow}) => {
  //------------------------------------
  // 相互通信：レンダラー⇔メイン
  //------------------------------------

  //------------------------------------
  // 設定関連
  //------------------------------------

  //レンダラープロセスの設定をすべて取得
  ipcMain.handle("get-all-settings", () => {
    return config.getAll()
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

  //------------------------------------
  // コンテンツ関連
  //------------------------------------

  //コンテンツ新規作成
  ipcMain.handle("create-content", (event, { file }) => {
    return contents.create(file)
  })

  ipcMain.handle("search-content", (event, { query }) => {
    return contents.search(query)
  })

  //------------------------------------
  // フォルダ関連
  //------------------------------------

  ipcMain.handle("get-folders-structure", () => {
    return folders.getAll()
  })

  ipcMain.handle("create-new-folder", async (event, { targetID }) => {
    await folders.create(targetID)
    return folders.getAll()
  })

  ipcMain.handle("rename-folder", async (event, { folderID, name }) => {
    await folders.rename(folderID, name)
    return folders.getAll()
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
