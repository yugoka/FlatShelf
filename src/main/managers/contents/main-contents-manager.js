//------------------------------------
// コンテンツ管理 for メインプロセス
//------------------------------------
const { Content } = require("../../db/models/content")
const { imageManager } = require("./main-image-manager")
const { books } = require("./main-book-manager")
const log = require("electron-log")
const fs = require("fs").promises
const imageFileTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
]
const bookFileTypes = ["application/zip", "application/x-zip-compressed"]
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

    return result.map((content) => (content ? content.contentID : null))
  }

  //コンテンツを登録する
  //やや長く読みづらいため分割の余地あり
  async create(data) {
    try {
      const fileData = data.fileData
      //ファイルの種類を判定
      const type = fileData.type.toLowerCase()

      console.log(type)

      //コンテンツの種類によって担当するマネージャーを変える
      //ここ分割予定
      if (imageFileTypes.includes(type)) {
        return await imageManager.create(data)
      } else if (bookFileTypes.includes(type)) {
        return await books.create(data)
      }

      //ファイルタイプがどれにも該当しない or サポートされていないファイルの場合
      log.error(`[fileImport] ${type} is not supported`)
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
