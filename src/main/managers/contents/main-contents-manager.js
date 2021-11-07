//------------------------------------
// コンテンツ管理 for メインプロセス
//------------------------------------
const { imageManager } = require("./main-image-manager")
const log = require("electron-log")
const { Content } = require("../../db/models/content")
const { Op } = require("sequelize")
const imageFileExts = ["png", "jpg", "jpeg", "webp", "gif", "bmp"]

class ContentsManager {
  //コンテンツを登録する
  //やや長く読みづらいため分割の余地あり
  async create(fileData) {
    try {
      //ファイルの種類を判定
      const type = fileData.type.split("/")[0]
      const ext = fileData.type.split("/")[1]

      //コンテンツの種類によって担当するマネージャーを変える
      //ここ分割予定
      switch (type) {
        //画像ファイルの場合
        case "image":
          if (ext.indexOf(imageFileExts)) {
            return await imageManager.create(fileData)
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
      log.error(`[fileImport] ${err}`)
      return false
    }
  }

  //これ別マネージャーに分ける
  async search(query) {
    log.info(`[contentSearch] Start searching`)
    const result = await Content.findAll({
      where: {
        name: {
          [Op.like]: `%${query.searchWord}%`
        }
      }
    })
    log.info(`[contentSearch] Found ${result.length} items`)
    return result
  }
}

export const contents = new ContentsManager()
