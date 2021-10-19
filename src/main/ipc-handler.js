const { ipcMain } = require("electron")

//------------------------------------
// IPCレシーバー設定
// preload.jsで発火したイベントをこちらで受け取る
//------------------------------------

export const registerIpcHandlers = () => {
  ipcMain.handle("get-renderer-settings", () => {
    console.log(process.versions.electron)
    return process.versions.electron
  })
}
