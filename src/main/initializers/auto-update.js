const { autoUpdater } = require("electron-updater")
const { dialog } = require("electron")
const log = require("electron-log")

export const checkUpdate = (mainWindow) => {
  log.info(`[FlatShelf-Update] Checking for update...`)

  //更新をチェックする
  autoUpdater.checkForUpdates()

  //更新があった場合のダイアログ
  autoUpdater.on("update-downloaded", (info) => {
    log.info(info)

    const dialogOpts = {
      type: "info",
      buttons: ["更新する", "あとで"],
      message: "アップデートがあります",
      detail:
        "新しいバージョンをダウンロードしました。FlatShlefを再起動して更新しますか？",
    }

    dialog.showMessageBox(mainWindow, dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  autoUpdater.on("error", (err) => {
    log.error(`[FlatShelf-Updater] ${err}`)
  })
}
