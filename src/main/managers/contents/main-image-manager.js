//------------------------------------
// 画像ファイルのCRUD
//------------------------------------
const { Content } = require("../../db/models/content")
const { WORKING_SPACE } = require("../../initializers/global-settings")
const fs = require("fs").promises
const path = require("path")
const { v4: UUID } = require("uuid")
const log = require("electron-log")
const {generateThumbnail} = require("./contents-manager-util")

class ImageManager {
  //------------------------------------
  // 画像保存
  //------------------------------------
  async create(data) {
    const file = data.fileData
    const fileName = file.name
    //保存ディレクトリを生成
    const fileUUID = UUID()
    const targetDirectory = path.join(
      WORKING_SPACE,
      "contents/images",
      fileUUID
    )
    const type = file.type

    //コンテンツ本体ファイルを複製
    //↓は共通する可能性が高いので今後リファクタリングの余地あり
    const targetFile = path.join(targetDirectory, fileName)
    log.info(`[fileImport]creating ${type} content:${targetFile}`)
    
    //ディレクトリを作成
    await fs.mkdir(targetDirectory, { recursive: true })
    //サムネイルを生成
    const thumbnail = await generateThumbnail(file.path, targetDirectory)
    //画像本体をコピー
    await fs.copyFile(file.path, targetFile)

    //dbにデータを登録する
    const newContent = await Content.create({
      name: fileName,
      type: type,
      mainFilePath: targetFile,
      folderPath: targetDirectory,
      UUID: fileUUID,
      thumbnailPath: thumbnail.path,
      thumbnailWidth: thumbnail.width,
      thumbnailHeight: thumbnail.height,
      folderId: data.folderID
    })
    return newContent
  }
}

export const imageManager = new ImageManager()
