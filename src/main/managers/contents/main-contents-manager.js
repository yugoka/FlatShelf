//------------------------------------
// コンテンツ管理 for メインプロセス

import { fdatasync } from "fs"

//------------------------------------
const { Content } = require("../../db/models/content")
const { BrowserWindow } = require("electron")
const { imageManager } = require("./main-image-manager")
const log = require("electron-log")
const fs = require("fs").promises
const imageFileExts = ["png", "jpg", "jpeg", "webp", "gif", "bmp"]
const { performance } = require("perf_hooks")
const { v4: UUID } = require("uuid")

class ContentsManager {
  constructor() {
    this.mainWindow = null
  }

  getMainWindow() {
    this.mainWindow = this.mainWindow || BrowserWindow.fromId(1)
    return this.mainWindow
  }

  async createMany(data) {
    /*
    const result = []
    for await (const file of data.files) {
      const r = await this.create({
        fileData: file,
        folderID: data.folderID,
      })
      result.push(r)
    }    
    */

    //ファイルインポート時にmainWindowを改めて取得してるけどあんまり良い実装じゃない
    //mainWindowのIDが1とは限らない
    const mainWindow = this.getMainWindow()
    const taskID = UUID()
    this.pushProgress({
      mainWindow,
      taskID,
      completeCount: 0,
      length: data.files.length,
    })

    let completeCount = 0
    const promises = data.files.map((file) => {
      return this.create({
        fileData: file,
        folderID: data.folderID,
      }).then((res) => {
        //進捗情報を送信する
        completeCount += 1
        this.pushProgress({
          mainWindow,
          taskID,
          length: data.files.length,
          completeCount,
        })
        return res
      })
    })
    const result = await Promise.all(promises)
    return result.map((content) => content.contentID)
  }

  //レンダラーのプログレスバーに情報を送る
  pushProgress({ mainWindow, taskID, length, completeCount }) {
    if (mainWindow) {
      mainWindow.send("push-progress", {
        data: {
          type: "create-content",
          id: taskID,
          progress: (completeCount / length) * 100,
          length,
          completeCount,
        },
      })
    }
  }

  //コンテンツを登録する
  //やや長く読みづらいため分割の余地あり
  async create(data) {
    try {
      const fileData = data.fileData
      //ファイルの種類を判定
      const type = fileData.type.split("/")[0]
      const ext = fileData.type.split("/")[1]

      //コンテンツの種類によって担当するマネージャーを変える
      //ここ分割予定
      if (type === "image" && ext.indexOf(imageFileExts)) {
        return await imageManager.create(data)
      } else if (type === "aaa") {
        console.log("aaa")
      }

      //ファイルタイプがどれにも該当しない or サポートされていないファイルの場合
      log.error(`[fileImport] ${ext} is not supported`)
      return false
    } catch (err) {
      //登録に失敗した場合
      log.error(`[fileImport]Error: ${err}`)
      return false
    }
  }

  //指定されたコンテンツ全てにおいて値が共通するようなcolumnsを抽出する
  async checkCommonValues({ contentIDs, columns }) {
    try {
      const basisContent = await Content.findOne({
        where: { contentID: contentIDs[0] },
        attributes: columns,
        raw: true,
      })
      const result = {}

      for await (const column of columns) {
        const commonCount = await Content.count({
          where: {
            contentID: contentIDs,
            [column]: basisContent[column],
          },
        })

        result[column] =
          commonCount === contentIDs.length ? basisContent[column] : null
      }

      return result
    } catch (err) {
      log.error(`[checkContentCommonValues]Error: ${err}`)
    }
  }

  //コンテンツのメタデータを変更
  async update(data) {
    try {
      await Content.update(data.values, {
        where: { contentID: data.contentIDs },
      })
      return true
    } catch (err) {
      log.error(`[contentUpdate] Error: ${err}`)
      return false
    }
  }

  async delete(IDs) {
    try {
      log.info(`[contentDelete] Deleting ${IDs.length} items`)
      await this.deleteDatas(IDs)
      await Content.destroy({
        where: {
          contentID: IDs,
        },
      })

      return true
    } catch (err) {
      log.error(`[contentDelete] Error: ${err}`)
      return false
    }
  }

  //コンテンツの実データを削除する
  async deleteDatas(IDs) {
    const targetContents = await Content.findAll({
      raw: true,
      where: {
        contentID: IDs,
      },
      attributes: ["folderPath"],
    })

    for await (const content of targetContents) {
      log.info(`[contentDelete] Deleting ${content.folderPath}`)
      await fs.rmdir(content.folderPath, { recursive: true })
    }
  }
}

export const contents = new ContentsManager()
