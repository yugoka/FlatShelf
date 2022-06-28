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

    const zip = fs.createReadStream(filePath).pipe(unzipper.Parse())

    for await (const entry of zip) {
      if (entry.path.toLowerCase().endsWith(".pdf")) {
        entry.pipe(fs.createWriteStream(targetDirectory))
      } else {
        entry.autodrain()
      }
    }

    console.log("end")

    return null
  }
}

export const bookManager = new BookManager()
