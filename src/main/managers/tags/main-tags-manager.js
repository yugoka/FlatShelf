//------------------------------------
// タグ管理 for メインプロセス
//------------------------------------

const { Content } = require("../../db/models/content")
const { Tag } = require("../../db/models/tag")
const log = require("electron-log")

class TagsManager {
  //対象のコンテンツ全てが共通して持つタグを抽出する
  async getCommonTags(contentIDs) {
    try {
      const result = []
      //タグの取得先をとりあえず最後に選択したコンテンツにしてるけど非効率的
      const lastContent = await Content.findOne({
        where: { contentID: contentIDs[contentIDs.length - 1] },
      })

      const tags = await lastContent.getTags()

      for await (const tag of tags) {
        //与えられたcontentIDを持つコンテンツの内、そのタグを持つものを抜き出す
        const contentsWithTag = await tag.getContents({
          where: { contentID: contentIDs },
          attributes: ["contentID"],
        })
        if (contentsWithTag.length === contentIDs.length) {
          result.push(tag.dataValues)
        }
      }

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
