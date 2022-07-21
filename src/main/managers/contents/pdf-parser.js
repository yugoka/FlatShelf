const path = require("path")
const log = require("electron-log")
const { Poppler } = require("node-poppler")

const binPath = process.env.NODE_ENV === 'development'
  ? path.join(__dirname, '../bin')
  : path.join(process.resourcesPath, 'bin')

const popplerPath = path.join(binPath, "poppler", process.platform, "bin")

const poppler = new Poppler(popplerPath)

//------------------------------------
// PDFを展開して画像にする
//------------------------------------
export const parsePDF = async (src, start=1, end=1) => {
  try {
    const options = {
      pngFile: true,
      firstPageToConvert: start,
      lastPageToConvert: end
    }

    const outputFile = path.join(path.dirname(src), `${path.basename(src)}.png`)

    await poppler.pdfToCairo(src, outputFile, options)

  } catch (error) {
    log.error(`[pdfParse] Error: ${error}`)
  }
}