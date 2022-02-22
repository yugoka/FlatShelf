//------------------------------------
// タグ管理 for メインプロセス
//------------------------------------

const { Content } = require("../../db/models/content")
const { Tag } = require("../../db/models/tag")
const log = require("electron-log")

class TagsManager {
  async create(data) {
    try {
      const result = await Tag.create({
        name: data.name || "新規タグ",
      })
      return result
    } catch (err) {
      log.error(err)
    }
  }

  async set(contentIDs, tagName) {
    try {
      //tagNameと同名のタグがなければ作成
      const tag = await Tag.findOrCreate({
        where: { name: tagName },
      })

      const contents = await Content.findAll({
        where: { contentID: contentIDs },
      })

      await tag[0].addContents(contents)

      return {
        tag: tag[0].dataValues,
        created: tag[1],
      }
    } catch (err) {
      log.error(err)
      return false
    }
  }
}

export const tags = new TagsManager()
