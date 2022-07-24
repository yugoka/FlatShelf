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
const { parsePDF } = require("./pdf-parser")

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

      //zipファイルを読み込む
      const zip = new StreamZip.async({ file: filePath, nameEncoding: 'shift-jis'})
      const fileCount = await zip.extract(null, targetDirectory)
      log.info(`[BookImport] Extracted ${fileCount} files`)
      await zip.close()

      await deleteFolder(path.join(targetDirectory, "__MACOSX"))

      //pdfの数
      const pdfFiles = await this.searchFiles(targetDirectory, this.isPDF)
      await this.getFirstPageOfPDF(pdfFiles)

      //pdf展開後の画像
      const imageFiles = await this.searchFiles(targetDirectory, this.isImage)

      //zipを開いた結果画像が無かった場合
      if (!fileCount || !imageFiles.length) {
        //await deleteFolder(targetDirectory)
        return null
      }

      //サムネイルを生成
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
  // 条件に基づいてファイルを(再帰的に)列挙
  //------------------------------------
  async searchFiles(targetDirectory, condition = null, recursive = true) {
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
      //検索対象がフォルダかつ再帰的探索の場合
      if (dirent.isDirectory() && recursive) {
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

  //------------------------------------
  // ビューワーで今開いているフォルダのデータを取得
  // ちょっと煩雑なので修正の余地あり
  //  第一引数は現在開いているフォルダ, 第二引数はそのコンテンツのルートフォルダ
  //------------------------------------
  async getBookFolderData(directory, rootDirectory, getChildInfo = true) {
    const allDirs = await fs.promises.readdir(directory, {
      withFileTypes: true,
    })

    //直下の画像, PDF, フォルダ一覧
    const images = await this.searchFiles(directory, this.isImage, false)
    //サムネイル以外の画像たち
    const nonThumbnailImages = images.filter(image => {
      return !image.name.startsWith("thumbnail-")
    })

    const pdfs = await this.searchFiles(directory, this.isPDF, false)
    const folders = allDirs.filter(dirent => dirent.isDirectory())

    if (getChildInfo) {
      //子フォルダ直下の画像数, PDF数, フォルダ数をカウント
      const childFoldersInfo = []
      for await (const folder of folders) {
        const info = await this.getBookFolderData(
          path.join(directory, folder.name),
          rootDirectory,
          false
        )
        childFoldersInfo.push(info)
      }

      //親フォルダの場合
      return {
        dir: directory,
        //コンテンツのrootフォルダに対してサブディレクトリかどうか
        isSubDirectory: this.checkSubDirectory(rootDirectory, directory),
        images: nonThumbnailImages,
        pdfs,
        folders: childFoldersInfo
      }
    } else {
      //子フォルダ以下の場合
      return {
        name: path.basename(directory),
        dir: directory,
        imagesCount: nonThumbnailImages.length,
        pdfCount: pdfs.length,
        foldersCount: folders.length,
        firstImage: images.length ? images[0] : null
      }
    }
  }

  //------------------------------------
  // ビューワーでフォルダー階層を1個上に戻す
  //------------------------------------
  async backDirectory(root, current) {
    //何らかの原因でサブフォルダではない場所から戻ろうとした場合、表示をrootに戻す
    if (!this.checkSubDirectory(root, current)) {
      return await this.getBookFolderData(root, root)
    } else {
      const target = path.resolve(current, "../")
      return await this.getBookFolderData(target, root)
    }
  }

  //------------------------------------
  // currentがrootのサブディレクトリであるかどうかを調べる
  // (ビューワーで1個上の階層に戻れるかどうか調べる)
  //------------------------------------
  checkSubDirectory(root, current) {
    const relative = path.relative(root, current)
    const result = relative && !relative.startsWith('..') && !path.isAbsolute(relative)
    if (result === "") {
      return false
    } else {
      return result
    }
  }

  //------------------------------------
  // PDFを展開して画像にする
  //------------------------------------
  async getFirstPageOfPDF(target) {
    try {
      const targets = Array.isArray(target)
        ? target
        : [target]
      
      const promises = targets.map((pdf) => {
        return parsePDF(pdf.dir, 1, 1)
      })

      await Promise.all(promises)

      return true

    } catch (e) {
      log.error(`[bookImport] Error on pdf parse: ${e}`)
    }
  }
  
  //------------------------------------
  // 画像かどうかを判定
  //------------------------------------
  isImage(dirent) {
    const imageFileExts = imageFileTypes.map(type => {
      return `.${type.split("/")[1]}`
    })

    return imageFileExts.includes(path.extname(dirent.name).toLowerCase())
  }

  //------------------------------------
  // PDFかどうかを判定
  //------------------------------------
  isPDF(dirent) {
    return path.extname(dirent.name).toLowerCase() === ".pdf"
  }
}

export const books = new BookManager()
