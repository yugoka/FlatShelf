//------------------------------------
// コンテンツ管理 for メインプロセス
//------------------------------------
const { Content } = require("../../db/models/content")
const { imageManager } = require("./main-image-manager")
const { books } = require("./main-book-manager")
const log = require("electron-log")
const fs = require("fs").promises

//対応ファイルのMIME
const { imageFileTypes, bookFileTypes } = require("./content-file-types")

class ContentsManager {
  async createMany(data) {
    const promises = data.files.map((file) => {
      return this.create({
        fileData: file,
        folderID: data.folderID,
      })
    })
    const result = await Promise.all(promises)

    return result
  }

  //コンテンツを登録する
  //やや長く読みづらいため分割の余地あり
  async create(data) {
    try {
      const fileData = data.fileData
      //ファイルの種類を判定
      const type = fileData.type.toLowerCase()

      //コンテンツの種類によって担当するマネージャーを変える
      if (imageFileTypes.includes(type)) {
        return await imageManager.create(data)
      } else if (bookFileTypes.includes(type)) {
        return await books.create(data)
      }

      //ファイルタイプがどれにも該当しない or サポートされていないファイルの場合
      log.error(`[fileImport] ${type} is not supported`)
      const message = type
        ? `${type}形式のファイルはサポートされていません`
        : `この形式のファイルはサポートされていません`
      return {
        status: "fail",
        message,
      }
    } catch (err) {
      //登録に失敗した場合
      log.error(`[fileImport] ${err}`)
      return {
        status: "fail",
        message: `インポート中にエラーが発生しました： ${err}`,
      }
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
      log.info(`[contentsUpdate] Update contents, ID:${data.contentIDs}`)
      await Content.update(data.values, {
        where: { contentID: data.contentIDs },
      })
      return true
    } catch (err) {
      log.error(`[contentsUpdate] Error: ${err}`)
      return false
    }
  }

  async delete(IDs) {
    try {
      log.info(`[contentDelete] Deleting ${IDs.length ? IDs.length : 1} items`)
      await this.deleteDatas(IDs)
      await Content.destroy({
        where: {
          contentID: IDs,
        },
      })

      return true
    } catch (err) {
      log.error(`[contentsDelete] Error: ${err}`)
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
      log.info(`[contentsDelete] Deleting ${content.folderPath}`)
      await fs.rm(content.folderPath, { recursive: true })
    }
  }
}

export const contents = new ContentsManager()
