"use strict"

//------------------------------------
// モジュール
//------------------------------------
const { app, protocol, BrowserWindow } = require("electron")
const path = require("path")
const { createProtocol } = require("vue-cli-plugin-electron-builder/lib")
const {
  default: installExtension,
  VUEJS_DEVTOOLS
} = require("electron-devtools-installer")

const { config } = require("./config-manager")
const { getWindowCenterPosition } = require("./init-functions")
const { registerIpcHandlers } = require("./ipc-handler")

//------------------------------------
// 定数
//------------------------------------
//実行環境の判定
const isDevelopment = process.env.NODE_ENV !== "production"
//プロトコルの登録
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
])

// ウィンドウのデフォルトサイズ
const DEFAULT_SIZE = {
  width: 1200,
  height: 600
}

//------------------------------------
// グローバル変数
//------------------------------------
let mainWindow

//------------------------------------
// ウィンドウ生成
//------------------------------------
const createWindow = () => {
  const position =
    config.main.get("window.position") || getWindowCenterPosition(DEFAULT_SIZE)
  const size = config.main.get("window.size") || [
    DEFAULT_SIZE.width,
    DEFAULT_SIZE.height
  ]
  // ウィンドウを生成
  mainWindow = new BrowserWindow({
    width: size[0],
    height: size[1],
    x: position[0],
    y: position[1],
    minWidth: 600,
    minHeight: 400,

    webPreferences: {
      // ここは変えないこと
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js")
    },
    frame: true
  })

  //development環境関連設定
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    createProtocol("app")
    // Load the index.html when not in development
    mainWindow.loadURL("app://./index.html")
  }

  //メインウィンドウを閉じた時
  mainWindow.on("close", () => {
    //ウィンドウのサイズと位置を保存する
    config.main.set("window.position", mainWindow.getPosition())
    config.main.set("window.size", mainWindow.getSize())
  })
}

//------------------------------------
// appイベント
//------------------------------------
// アプリ終了時
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// アクティベート時
app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// アプリ準備完了後
//一部のAPIはこれ以降に触る必要がある
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString())
    }
  }
  //ウィンドウを生成
  createWindow()

  //IPC通信の窓口を設定
  registerIpcHandlers()
})

//終了時処理
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit()
      }
    })
  } else {
    process.on("SIGTERM", () => {
      app.quit()
    })
  }
}
