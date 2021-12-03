//------------------------------------
// 画像ファイルのCRUD
//------------------------------------
const { Content } = require("../../db/models/content")
const { WORKING_SPACE } = require("../../initializers/global-settings")
const fs = require("fs").promises
const path = require("path")
const { v4: UUID } = require("uuid")
const log = require("electron-log")
const sharp = require("sharp")

const maxThumbnailWidth = 200
const maxThumbnailHeight = 200

class ImageManager {
  //------------------------------------
  // 画像保存
  //------------------------------------
  async create(file) {
    try {
      const fileName = file.name
      //保存ディレクトリを生成
      const fileUUID = UUID()
      const targetDirectory = path.join(
        WORKING_SPACE,
        "contents/images",
        fileUUID
      )
      const type = file.type

      //サムネイルを生成
      const thumbnail = await this.generateThumbnail(file.path, targetDirectory)

      //コンテンツ本体ファイルを複製
      //↓は共通する可能性が高いので今後リファクタリングの余地あり
      const targetFile = path.join(targetDirectory, fileName)
      log.info(`[fileImport]creating ${type} content:${targetFile}`)
      await fs.mkdir(targetDirectory, { recursive: true })
      await fs.copyFile(file.path, targetFile)
      //dbにデータを登録する
      const newContent = await Content.create({
        name: fileName,
        type: type,
        filePath: targetFile,
        UUID: fileUUID,
        thumbnailPath: thumbnail.path,
        thumbnailWidth: thumbnail.width,
        thumbnailHeight: thumbnail.height,
      })
      return newContent
    } catch (err) {
      log.error(`[fileImport]Error: ${err}`)
    }
  }

  //------------------------------------
  // 画像サムネイルの作成
  //------------------------------------
  async generateThumbnail(targetImage, targetDirectory) {
    const image = await sharp(targetImage)
    const metadata = await image.metadata()
    console.log(metadata)

    //サムネイル最小値を下回る大きさなら元画像をサムネイルにする
    if (
      metadata.width <= maxThumbnailWidth &&
      metadata.height <= maxThumbnailHeight
    ) {
      return {
        path: path.join(targetDirectory, targetImage),
        width: metadata.width,
        height: metadata.height,
      }
    }

    //サムネイルを作成して保存
    const thumbnailPath = path.join(targetDirectory, "thumbnail.png")
    const resizedImage = await image.resize(
      maxThumbnailWidth,
      maxThumbnailHeight,
      { fit: "inside" }
    )
    const resizedImageMetadata = await resizedImage.metadata()
    await resizedImage.tofile(thumbnailPath)

    return {
      path: thumbnailPath,
      width: resizedImageMetadata.width,
      height: resizedImageMetadata.height,
    }
  }
}

export const imageManager = new ImageManager()
