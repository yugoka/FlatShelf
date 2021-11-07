//------------------------------------
// 画像ファイルのCRUD
//------------------------------------
const { Content } = require("../../db/models/content")
const { WORKING_SPACE } = require("../../initializers/global-settings")
const fs = require("fs").promises
const path = require("path")
const { v4: UUID } = require("uuid")
const log = require("electron-log")

class ImageManager {
  async create(file) {
    const fileName = file.name
    //保存ディレクトリを生成
    const fileUUID = UUID()
    const targetDirectory = path.join(WORKING_SPACE, "contents/images", fileUUID)

    const targetFile = path.join(targetDirectory, fileName)
    const type = file.type

    //コンテンツ本体ファイルを複製
    //↓は共通する可能性が高いので今後リファクタリングの余地あり

    log.info(`[fileImport]creating ${type} content:${targetFile}`)
    await fs.mkdir(targetDirectory, { recursive: true })
    await fs.copyFile(file.path, targetFile)
    //dbにデータを登録する
    const newContent = await Content.create({
      name: fileName,
      type: type,
      filePath: targetFile,
      UUID: fileUUID,
    })
    return newContent
  }
}

export const imageManager = new ImageManager()
