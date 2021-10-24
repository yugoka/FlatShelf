//------------------------------------
// コンテンツ管理 for メインプロセス
//------------------------------------
const { imageManager } = require("./main-image-manager")
const log = require("electron-log")

class ContentsManager {
  //コンテンツを登録する
  async create(data) {
    try {
      //コンテンツの種類によって担当するマネージャーを変える
      switch (data.contentData.type) {
        case "image":
          return await imageManager.create(data)
        case "book":
          console.log(data)
      }
    } catch (err) {
      //登録に失敗した場合
      log.error(err)
      return false
    }
  }
}

export const contents = new ContentsManager()
