const sharp = require("sharp")
const path = require("path")

//YYYY-MM-DD-mm-ss-msms方式で日時を出力
export const getDate = () => {
  const date = new Date()
  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) +
    "-" +
    ("0" + date.getHours()).slice(-2) +
    "-" +
    ("0" + date.getMinutes()).slice(-2) +
    "-" +
    ("0" + date.getSeconds()).slice(-2) +
    "-" +
    date.getMilliseconds()
  )
}

//------------------------------------
// 画像サムネイルの作成
//------------------------------------
const maxThumbnailWidth = 500
const maxThumbnailHeight = 500
const maxAspectRatio = 2

export const generateThumbnail = async (targetImage, targetDirectory) => {
  const image = await sharp(targetImage)
  const metadata = await image.metadata()

  //最小サムネイルサイズを下回る大きさなら元画像をサムネイルにする
  if (
    metadata.width <= maxThumbnailWidth &&
    metadata.height <= maxThumbnailHeight
  ) {
    return {
      path: path.join(targetDirectory, path.basename(targetImage)),
      width: metadata.width,
      height: metadata.height,
    }
  }

  let fit = "inside"
  //アスペクト比が最大を超える場合fitをcoverにする
  if (
    metadata.width / metadata.height > maxAspectRatio ||
    metadata.height / metadata.width > maxAspectRatio
  ) {
    fit = "cover"
  }

  //サムネイルを作成して保存
  const thumbnailPath = path.join(targetDirectory, "thumbnail.jpg")
  const resizedImage = await image.resize(
    { 
      fit,
      width: maxThumbnailWidth,
      height: maxThumbnailHeight,
    }
  )
  await resizedImage.toFile(thumbnailPath)
  const resizedImageMetadata = await sharp(thumbnailPath).metadata()

  return {
    path: thumbnailPath,
    width: resizedImageMetadata.width,
    height: resizedImageMetadata.height,
  }
}