//------------------------------------
// コンテンツ管理 for メインプロセス
//------------------------------------
const { Content } = require("../../db/models/content")
const { imageManager } = require("./main-image-manager")
const log = require("electron-log")
const fs = require("fs").promises
const imageFileExts = ["png", "jpg", "jpeg", "webp", "gif", "bmp"]

class ContentsManager {
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
      switch (type) {
        //画像ファイルの場合
        case "image":
          if (ext.indexOf(imageFileExts)) {
            return await imageManager.create(data)
          }
          break
        case "aaa":
          console.log(fileData)
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
