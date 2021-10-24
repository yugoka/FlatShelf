const { Content } = require("../../initializers/init-db")

class ImageManager {
  async create({ contentData }) {
    const newContent = Content.create({
      name: contentData.name,
      type: contentData.type,
      description: contentData.description,
      author: contentData.author,
      filePath: "C://abc/d.mp4"
    })

    return newContent
  }
}

export const imageManager = new ImageManager()
