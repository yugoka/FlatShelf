//------------------------------------
// 画像ファイルのCRUD
//------------------------------------
const { Content } = require("../../initializers/init-db")
const { WORKING_SPACE } = require("../../initializers/global-settings")
const fs = require("fs").promises
const path = require("path")
const { v4: UUID } = require("uuid")
const log = require("electron-log")

class ImageManager {
  async create(data) {
    const fileName = path.basename(data.filePath)

    //ディレクトリ名を生成
    const fileUUID = UUID()
    const targetDirectory = path.join(
      WORKING_SPACE,
      "contents/images",
      fileUUID
    )
    const targetFile = path.join(targetDirectory, fileName)
    log.info(`creating an image content:${targetFile}`)
    //コンテンツ本体ファイルを複製
    //↓は共通する可能性が高いので今後リファクタリングの余地あり
    try {
      await fs.mkdir(targetDirectory, { recursive: true })
      await fs.copyFile(data.filePath, targetFile)
      //dbにデータを登録する
      const newContent = await Content.create({
        name: fileName,
        type: "image",
        filePath: targetFile
      })
      return newContent
    } catch (err) {
      log.error(err)
    }
  }
}

export const imageManager = new ImageManager()
