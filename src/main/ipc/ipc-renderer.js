const { contextBridge, ipcRenderer } = require("electron")

//------------------------------------
// プリロード設定
// レンダラー側でNode APIにアクセスする場合はこれを使う
//------------------------------------
contextBridge.exposeInMainWorld("ipc", {
  //------------------------------------
  // 往復通信：メイン⇔レンダラー
  //------------------------------------
  //レンダラープロセス用の設定を取得
  getAllSettings: async () => {
    return await ipcRenderer.invoke("get-all-settings")
  },
  //レンダラープロセスから設定を更新する
  setConfig: async (key, value) => {
    return await ipcRenderer.invoke("set-config", { key, value })
  },

  createContent: async data => {
    return await ipcRenderer.invoke("create-content", { data })
  }

  //------------------------------------
  // 片道通信：メイン→レンダラー
  //------------------------------------
})
