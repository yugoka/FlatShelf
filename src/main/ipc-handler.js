const { ipcMain } = require("electron")
const { config } = require("./config-manager")

//------------------------------------
// IPCレシーバー設定
// レンダラーからpreload.js経由で発火したイベントをこちらで受け取る
//------------------------------------
export const registerIpcHandlers = () => {
  //------------------------------------
  // 相互通信：レンダラー⇔メイン
  //------------------------------------
  //レンダラープロセスの設定をすべて取得
  ipcMain.handle("get-renderer-settings", () => {
    return config.renderer.getAll()
  })

  //------------------------------------
  // 片道通信：レンダラー→メイン
  //------------------------------------
  //レンダラープロセスの設定を変更
  ipcMain.on("set-renderer-setting", (key, value) => {
    config.renderer.set(key, value)
  })
}
