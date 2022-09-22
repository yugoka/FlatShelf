const { ipcMain, app, shell } = require("electron")
const log = require("electron-log")
const { config } = require("../main/managers/main-config-manager")
const { folders } = require("../main/managers/folders/main-folders-manager")
const { contents } = require("../main/managers/contents/main-contents-manager")
const {
  scraping,
} = require("../main/managers/contents/scraping/contents-scraping")
const { tags } = require("../main/managers/tags/main-tags-manager")
const { books } = require("../main/managers/contents/main-book-manager")
const { executeSearch } = require("../main/managers/search/main-search-manager")

//------------------------------------
// IPCレシーバー設定
// レンダラーからpreload.js経由で発火したイベントをこちらで受け取る
// 要するにメインプロセス側のAPIリストだよ
//------------------------------------
export const registerIpcHandlers = ({ mainWindow }) => {
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
    return config.set(key, value)
  })

  //------------------------------------
  // コンテンツ関連
  //------------------------------------

  //コンテンツ新規作成
  ipcMain.handle("create-contents", (event, { data }) => {
    return contents.createMany(data)
  })

  //コンテンツ更新
  ipcMain.handle("update-content", (event, { data }) => {
    return contents.update(data)
  })

  //コンテンツの重複値特定
  ipcMain.handle(
    "check-content-common-values",
    (event, { contentIDs, columns }) => {
      return contents.checkCommonValues(contentIDs, columns)
    }
  )

  //コンテンツ削除
  ipcMain.handle("delete-content", (event, { data }) => {
    return contents.delete(data)
  })

  //コンテンツ情報のスクレイピング
  ipcMain.handle("add-scraping-task", (event, { contentIDs }) => {
    return scraping.addTask(contentIDs)
  })

  //------------------------------------
  // フォルダ関連
  //------------------------------------

  ipcMain.handle("get-folders-structure", () => {
    return folders.getAll()
  })

  ipcMain.handle("create-new-folder", async (event, { targetID }) => {
    const newFolder = await folders.create(targetID)
    //新しく作ったフォルダも一緒に返す
    return { structure: folders.getAll(), newFolder }
  })

  ipcMain.handle("get-folder-data", (event, { ids }) => {
    return folders.getData(ids)
  })

  ipcMain.handle(
    "get-folder-decendants",
    (event, { folderID, mode, includeMe }) => {
      return folders.getDecendants(folderID, mode, includeMe)
    }
  )

  ipcMain.handle("rename-folder", async (event, { folderID, name }) => {
    await folders.rename(folderID, name)
    return folders.getAll()
  })

  ipcMain.handle(
    "change-parent-folder",
    async (event, { folderID, parentFolderID }) => {
      await folders.changeParent(folderID, parentFolderID)
      return folders.getAll()
    }
  )

  ipcMain.handle("delete-folder", async (event, { folderID }) => {
    await folders.delete(folderID)
    return folders.getAll()
  })

  //------------------------------------
  // タグ関連
  //------------------------------------

  ipcMain.handle("set-tag", (event, { contentIDs, tagName }) => {
    return tags.set(contentIDs, tagName)
  })

  ipcMain.handle("get-tags-by-content-ids", (event, { contentIDs }) => {
    return tags.getTagsByContentIDs(contentIDs)
  })

  ipcMain.handle("get-tags", (event, { data }) => {
    return tags.get(data)
  })

  ipcMain.handle("set-tag-by-id", (event, { contentIDs, tagID }) => {
    return tags.setByID(contentIDs, tagID)
  })

  ipcMain.on("set-tag-timestamp", (event, { tagIDs }) => {
    tags.setTimestamp(tagIDs)
  })

  ipcMain.handle("remove-tag-by-id", (event, { contentIDs, tagID }) => {
    return tags.removeByID(contentIDs, tagID)
  })

  //------------------------------------
  // 検索関連
  //------------------------------------

  ipcMain.handle("search-content", (event, { query }) => {
    return executeSearch(query)
  })

  //------------------------------------
  // ブック関連
  //------------------------------------
  ipcMain.handle("get-book-folder-info", (event, { directory, root }) => {
    return books.getBookFolderData(directory, root)
  })

  ipcMain.handle(
    "book-folder-back",
    (event, { rootDirectory, currentDirectory }) => {
      return books.backDirectory(rootDirectory, currentDirectory)
    }
  )

  //------------------------------------
  // 片道通信：レンダラー→メイン
  //------------------------------------

  //------------------------------------
  // ウィンドウ関連
  //------------------------------------

  ipcMain.on("quit-app", () => {
    app.quit()
  })

  ipcMain.on("minimize-main-window", () => {
    mainWindow.minimize()
  })

  ipcMain.on("toggle-maximized", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })

  //------------------------------------
  // ローカルファイル関連
  //------------------------------------
  ipcMain.on("open-local-file", (event, { filePath }) => {
    log.info(`[LocalFile] Opening ${filePath}`)
    shell.openPath(filePath)
  })

  //------------------------------------
  // ログ関連
  //------------------------------------
  ipcMain.on("push-log", (event, { message, logType }) => {
    const logFunctions = new Map([
      ["error", log.error],
      ["warn", log.warn],
      ["info", log.info],
      ["verbose", log.verbose],
      ["silly", log.silly],
    ])

    if (logFunctions.has(logType)) {
      logFunctions.get(logType)(`[Frontend] ${message}`)
    } else {
      log.warn(`[FrontendLog] logType ${logType} does not exist`)
      log.warn(`[Frontend] ${message}`)
    }
  })

  //------------------------------------
  // 片道通信：メイン→レンダラー
  //------------------------------------

  //------------------------------------
  // ウィンドウ関連
  //------------------------------------

  mainWindow.on("maximize", () => {
    mainWindow.send("toggle-maximized", { isMaximized: true })
  })

  mainWindow.on("unmaximize", () => {
    mainWindow.send("toggle-maximized", { isMaximized: false })
  })
}
