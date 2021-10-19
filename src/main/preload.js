const { contextBridge, ipcRenderer } = require("electron")

//------------------------------------
// プリロード設定
// レンダラー側でNode APIにアクセスする場合はこれを使う
//------------------------------------

contextBridge.exposeInMainWorld("ipc", {
  //レンダラープロセス用の設定を取得
  getRendererSettings() {
    return ipcRenderer.invoke("get-renderer-settings")
  }
})