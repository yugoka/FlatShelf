//------------------------------------
// ブックファイルのCRUD
//------------------------------------
const { Content } = require("../../db/models/content")
const { WORKING_SPACE } = require("../../initializers/global-settings")
const fs = require("fs")
const path = require("path")
const { v4: UUID } = require("uuid")
const log = require("electron-log")
const { thumbnailGenerator } = require("./thumbnail.js")
const { deleteFolder } = require("./contents-manager-util")
const StreamZip = require('node-stream-zip')

//定数として分離したい
const imageFileTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
]

class BookManager {
  //------------------------------------
  // ブック保存
  //------------------------------------
  async create(data) {
    try {
      const file = data.fileData
      const fileName = file.name
      const filePath = file.path
      //保存ディレクトリを生成
      const fileUUID = UUID()
      const targetDirectory = path.join(WORKING_SPACE, "contents/books", fileUUID)
      const type = "book"

      //コンテンツ本体ファイルを複製
      //↓は共通する可能性が高いので今後リファクタリングの余地あり
      log.info(`[fileImport]creating ${type} content:${targetDirectory}`)

      //ディレクトリを作成
      await fs.promises.mkdir(targetDirectory, { recursive: true })

      const zip = new StreamZip.async({ file: filePath })
      const fileCount = await zip.extract(null, targetDirectory)
      log.info(`[BookImport] Extracted ${fileCount} files`)
      await zip.close();

      await deleteFolder(path.join(targetDirectory, "__MACOSX"))

      const imageFiles = await this.searchFiles(targetDirectory, this.isImage)

      //zipを開いた結果画像が無かった場合
      if (!fileCount || !imageFiles.length) {
        await deleteFolder(targetDirectory)
        return null
      }

      //サムネイルを生成、thumbnail.jpgって名前のファイルあったらバグらない？
      const thumbnail = await thumbnailGenerator.generateAll(
        imageFiles[0].dir,
        targetDirectory
      )

      //dbにデータを登録する
      const newContent = await Content.create({
        name: fileName,
        type: type,
        mainFilePath: null,
        folderPath: targetDirectory,
        UUID: fileUUID,
        thumbnailSmall: thumbnail.names.small,
        thumbnailMedium: thumbnail.names.medium,
        thumbnailAspectRatio: thumbnail.aspectRatio,
        folderID: data.folderID,
      })
      return newContent.get({ plain: true })
    } catch (e) {
      log.error(e)
      await this.deleteFolder(targetDirectory)
      return null
    }
  }

  //------------------------------------
  // 条件に基づいてファイルを再帰的に列挙
  //------------------------------------
  async searchFiles(targetDirectory, condition = null) {
    //conditionに関数が渡されなかった場合全ファイルを対象に検索する
    const conditionFunc =
      typeof condition === "function"
        ? condition
        : () => true

    const allDirs = await fs.promises.readdir(targetDirectory, {
      withFileTypes: true,
    })
    const files = []

    for await (const dirent of allDirs) {
      //検索対象がフォルダの場合
      if (dirent.isDirectory()) {
        const folderPath = path.join(targetDirectory, dirent.name)
        const result = await this.searchFiles(folderPath, conditionFunc)
        files.push(result)

        //検索対象がファイルで、conditionを満たす場合
      } else if (dirent.isFile() && conditionFunc(dirent)) {
        files.push({
          dir: path.join(targetDirectory, dirent.name),
          name: dirent.name,
          ext: path.extname(dirent.name),
        })
      }
    }

    return files.flat()
  }

  isImage(dirent) {
    const imageFileExts = imageFileTypes.map(type => {
      return `.${type.split("/")[1]}`
    })

    return imageFileExts.includes(path.extname(dirent.name))
  }
}

export const bookManager = new BookManager()
