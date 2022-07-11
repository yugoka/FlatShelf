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
const unzipper = require("unzipper")

class BookManager {
  //------------------------------------
  // ブック保存
  //------------------------------------
  async create(data) {
    const file = data.fileData
    const fileName = file.name
    const filePath = file.path
    console.log(filePath)
    //保存ディレクトリを生成
    const fileUUID = UUID()
    const targetDirectory = path.join(WORKING_SPACE, "contents/books", fileUUID)
    const type = "book"

    //コンテンツ本体ファイルを複製
    //↓は共通する可能性が高いので今後リファクタリングの余地あり
    log.info(`[fileImport]creating ${type} content:${targetDirectory}`)

    //ディレクトリを作成
    await fs.promises.mkdir(targetDirectory, { recursive: true })

    const directory = await unzipper.Open.file(filePath)
    await directory.extract({ path: targetDirectory, concurrency: 5 })

    await this.deleteFolder(path.join(targetDirectory, "__MACOSX"))

    const files = await this.searchFiles(targetDirectory)
    console.log(files)
  }

  //対象のフォルダが存在するなら削除
  async deleteFolder(target) {
    try {
      await fs.promises.rmdir(target, { recursive: true })
    } catch (e) {}
  }

  //特定の条件に基づいて再帰的にファイルを検索
  async searchFiles(targetDirectory, condition = null) {
    //conditionに関数が渡されなかった場合全ファイルを対象に検索する
    const conditionFunc =
      typeof condition === "function" ? condition : () => true

    const allDirs = await fs.promises.readdir(targetDirectory, {
      withFileTypes: true,
    })
    const files = []

    for await (const dirent of allDirs) {
      //検索対象がフォルダの場合
      if (dirent.isDirectory()) {
        const folderPath = path.join(targetDirectory, dirent.name)
        result = await this.searchFiles(folderPath)
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
}

export const bookManager = new BookManager()
