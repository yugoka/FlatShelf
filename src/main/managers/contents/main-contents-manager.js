//------------------------------------
// コンテンツ管理 for メインプロセス
//------------------------------------
const { Content } = require("../../db/models/content")
const { imageManager } = require("./main-image-manager")
const { bookManager } = require("./main-book-manager")
const log = require("electron-log")
const fs = require("fs").promises
const imageFileExts = ["png", "jpg", "jpeg", "webp", "gif", "bmp"]
const bookFileExts = ["zip"]
const { performance } = require("perf_hooks")

class ContentsManager {
  async createMany(data) {
    const promises = data.files.map((file) => {
      return this.create({
        fileData: file,
        folderID: data.folderID,
      })
    })
    const result = await Promise.all(promises)

    return result.map((content) => content.contentID)
  }

  //コンテンツを登録する
  //やや長く読みづらいため分割の余地あり
  async create(data) {
    try {
      const fileData = data.fileData
      //ファイルの種類を判定
      const type = fileData.type.split("/")[0]
      const ext = fileData.type.split("/")[1].toLowerCase()

      //コンテンツの種類によって担当するマネージャーを変える
      //ここ分割予定
      if (type === "image" && imageFileExts.includes(ext)) {
        return await imageManager.create(data)
      } else if (bookFileExts.includes(ext)) {
        return await bookManager.create(data)
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
