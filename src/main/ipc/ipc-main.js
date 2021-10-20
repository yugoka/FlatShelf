const { ipcMain } = require("electron")
const { config } = require("../managers/main-config-manager")

//------------------------------------
// IPCレシーバー設定
// レンダラーからpreload.js経由で発火したイベントをこちらで受け取る
//------------------------------------
export const registerIpcHandlers = () => {
  //------------------------------------
  // 相互通信：レンダラー⇔メイン
  //------------------------------------
  //レンダラープロセスの設定をすべて取得
  ipcMain.handle("get-all-settings", () => {
    return config.getAll()
  })

  //設定を保存する。成功すればtrue、失敗すればfalseが戻ってくる
  ipcMain.handle("set-config", (event, { key, value }) => {
    return config.set(key, value)
  })

  //------------------------------------
  // 片道通信：レンダラー→メイン
  //------------------------------------
}
