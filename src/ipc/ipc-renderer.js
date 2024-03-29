const { contextBridge, ipcRenderer } = require("electron")

//------------------------------------
// プリロード設定
// レンダラー側でNode APIにアクセスする場合はこれを使う
// 要するにレンダラープロセス側のAPIリストだよ
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
  //作成したコンテンツのID一覧を返す
  createContents: async (data) => {
    return await ipcRenderer.invoke("create-contents", { data })
  },

  //コンテンツ検索
  searchContent: async (query) => {
    return await ipcRenderer.invoke("search-content", { query })
  },

  //コンテンツの共通値を抽出
  checkContentCommonValues: async (contentIDs, columns) => {
    return await ipcRenderer.invoke("check-content-common-values", {
      contentIDs,
      columns,
    })
  },

  //コンテンツ更新
  updateContent: async (data) => {
    return await ipcRenderer.invoke("update-content", { data })
  },

  //コンテンツ削除
  deleteContent: async (data) => {
    return await ipcRenderer.invoke("delete-content", { data })
  },

  //コンテンツ情報のスクレイピング
  addScrapingTask: async (contentIDs) => {
    return await ipcRenderer.invoke("add-scraping-task", { contentIDs })
  },

  //------------------------------------
  // フォルダ関連
  //------------------------------------

  //サイドバー表示用のフォルダ構造を取得
  getFoldersStructure: async () => {
    return await ipcRenderer.invoke("get-folders-structure")
  },

  //新規フォルダを作成
  createNewFolder: async (targetID) => {
    return await ipcRenderer.invoke("create-new-folder", { targetID })
  },

  //フォルダの情報を取得
  getFolderData: async (ids) => {
    return await ipcRenderer.invoke("get-folder-data", { ids })
  },

  getFolderDecendants: async (folderID, mode, includeMe) => {
    return await ipcRenderer.invoke("get-folder-decendants", {
      folderID,
      mode,
      includeMe,
    })
  },

  renameFolder: async (folderID, name) => {
    return await ipcRenderer.invoke("rename-folder", { folderID, name })
  },

  changeParentFolder: async (folderID, parentFolderID) => {
    return await ipcRenderer.invoke("change-parent-folder", {
      folderID,
      parentFolderID,
    })
  },

  deleteFolder: async (folderID) => {
    return await ipcRenderer.invoke("delete-folder", { folderID })
  },

  //------------------------------------
  // タグ関連
  //------------------------------------

  setTag: async (contentIDs, tagName) => {
    return await ipcRenderer.invoke("set-tag", { contentIDs, tagName })
  },
  getTagsByContentIDs: async (contentIDs) => {
    return await ipcRenderer.invoke("get-tags-by-content-ids", { contentIDs })
  },
  getTags: async (data) => {
    return await ipcRenderer.invoke("get-tags", { data })
  },
  setTagByID: async (contentIDs, tagID) => {
    return await ipcRenderer.invoke("set-tag-by-id", { contentIDs, tagID })
  },
  setTagTimestamp: async (tagIDs) => {
    return await ipcRenderer.send("set-tag-timestamp", { tagIDs })
  },
  removeTagByID: async (contentIDs, tagID) => {
    return await ipcRenderer.invoke("remove-tag-by-id", { contentIDs, tagID })
  },

  //------------------------------------
  // ブック関連
  //------------------------------------
  getBookFolderInfo: async (directory, root) => {
    return await ipcRenderer.invoke("get-book-folder-info", { directory, root })
  },

  bookFolderBack: async (rootDirectory, currentDirectory) => {
    return await ipcRenderer.invoke("book-folder-back", {
      rootDirectory,
      currentDirectory,
    })
  },

  //------------------------------------
  // 片道通信：レンダラー→メイン
  //------------------------------------

  //------------------------------------
  // ウィンドウ関連
  //------------------------------------
  quitApp: () => {
    ipcRenderer.send("quit-app")
  },
  minimizeMainWindow: () => {
    ipcRenderer.send("minimize-main-window")
  },
  toggleMaximized: () => {
    ipcRenderer.send("toggle-maximized")
  },

  //------------------------------------
  // ローカルファイル関連
  //------------------------------------
  openLocalFile: (path) => {
    ipcRenderer.send("open-local-file", { filePath: path })
  },

  //------------------------------------
  // ログ関連
  //------------------------------------
  pushLog: (message, logType = "info") => {
    ipcRenderer.send("push-log", { message, logType })
  },

  //------------------------------------
  // 片道通信：メイン→レンダラー
  //------------------------------------

  onToggleMaximized: (callback) => {
    ipcRenderer.on("toggle-maximized", (event, { isMaximized }) =>
      callback(isMaximized)
    )
  },
})
