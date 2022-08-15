const path = require("path")
const fs = require("fs").promises
const log = require("electron-log")
const { Poppler } = require("node-poppler")
const { app } = require("electron")
const { v4: UUID } = require("uuid")

const binPath =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "../bin")
    : path.join(process.resourcesPath)

const popplerPath = path.join(binPath, "poppler", process.platform, "bin")

const poppler = new Poppler(popplerPath)

//------------------------------------
// PDFを展開して画像にする
//------------------------------------
export const getPDFThumbnail = async (pdf) => {
  try {
    //tempフォルダ内にflatshelfフォルダを作成
    await fs.mkdir(path.join(app.getPath("temp"), "flatshelf")).catch(() => {})

    //一時ファイル名
    const outputPath = path.join(app.getPath("temp"), "flatshelf", UUID())
    const tempFile = `${outputPath}.jpg`
    //最終的に保存したい場所
    const targetFile = path.join(
      path.dirname(pdf.dir),
      `thumbnail-${pdf.name}.jpg`
    )

    console.log(targetFile)
    console.log(tempFile)

    const options = {
      jpegFile: true,
      firstPageToConvert: 1,
      lastPageToConvert: 1,
      singleFile: true,
      //出力ファイルの解像度
      scalePageTo: 700,
    }

    //temp内に画像を生成
    await poppler.pdfToCairo(pdf.dir, outputPath, options)

    //tempの画像をコピーして削除
    await fs.copyFile(tempFile, targetFile)
    await fs.unlink(tempFile)
  } catch (error) {
    log.error(`[pdfParse] ${error}`)
  }
}
