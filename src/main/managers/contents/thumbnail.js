//------------------------------------
// 画像サムネイルの作成
//------------------------------------
const sharp = require("sharp")
const path = require("path")
const { deleteFile } = require("./contents-manager-util")

class ThumbnailGenerator {
  constructor() {
    this.maxAspectRatio = 2
    //(サイズ * ↓の値)以上のサイズを持つ画像はサムネイルが生成される
    this.thumbnailGenerateThreshold = 1.2
    this.sizes = [
      { name: "medium", value: 960 },
      { name: "small", value: 480 },
    ]
  }

  async generateAll(imagePath, directory) {
    const image = await sharp(imagePath)
    const metadata = await image.metadata()
    const fit = this.getFitMethod(metadata)
    const aspectRatio = this.getAspectRatio(fit, metadata)
    const imageNames = {}

    for (const size of this.sizes) {
      imageNames[size.name] = await this.generate({
        directory,
        imagePath,
        image,
        metadata,
        fit,
        size,
      })
    }
    return {
      names: imageNames,
      aspectRatio,
    }
  }

  //画像切り取りの手法を選択する。
  //coverならアスペクト比を維持せず短辺で切り取る。→極端なアスペクト比用
  //insideならアスペクト比を維持しつつ設定幅に収まるように切り取る。→通常用
  getFitMethod(metadata) {
    if (
      metadata.width / metadata.height > this.maxAspectRatio ||
      metadata.height / metadata.width > this.maxAspectRatio
    ) {
      return "cover"
    } else {
      return "inside"
    }
  }

  async generate({ directory, imagePath, image, metadata, fit, size }) {
    //最小サムネイルサイズを下回る大きさなら元画像をサムネイルにする
    if (
      this.fit != "cover" &&
      //画像が十分に小さい場合でもアスペクト比が上限を超える場合サムネを生成する
      metadata.width <= size.value * this.thumbnailGenerateThreshold &&
      metadata.height <= size.value * this.thumbnailGenerateThreshold
    ) {
      return path.relative(directory, imagePath)
    }

    const fileName = this.getThumbnailFileName(size.name)
    const filePath = path.join(directory, fileName)

    const resizedImage = await image.resize({
      fit,
      width: size.value,
      height: size.value,
    })

    await resizedImage.toFile(filePath)

    return fileName
  }

  getAspectRatio(fit, metadata) {
    if (fit === "cover") {
      return 1
    } else {
      return metadata.width / metadata.height
    }
  }

  //新規生成のサムネイルはwebpで保存
  getThumbnailFileName(size) {
    return `thumbnail-${size}.webp`
  }

  //------------------------------------
  // 使うかわかんないけど、古いサムネイルファイルを削除する
  //------------------------------------
  async deleteOldThumbnailFiles(directory) {
    const fileNames = this.sizes.map((size) => {
      return this.getThumbnailFileName(size.name)
    })

    for (const fileName of fileNames) {
      const target = path.join(directory, fileName)
      await deleteFile(target)
    }
  }
}

export const thumbnailGenerator = new ThumbnailGenerator()
