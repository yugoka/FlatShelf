//------------------------------------
// タグ管理 for メインプロセス
//------------------------------------

const { Content } = require("../../db/models/content")
const { Tag } = require("../../db/models/tag")
const log = require("electron-log")
const { Op } = require("sequelize")

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

  //タグを検索する
  async get(data) {
    try {
      const query = {
        where: {},
        order: data.order || [["lastUsed", "DESC"]],
        raw: true,
      }

      //ワード条件が入力されているなら条件を追加
      if (data.word) {
        query.where.name = { [Op.like]: `%${data.word}%` }
      }
      if (data.limit) {
        query.limit = data.limit
      }

      const result = await Tag.findAll(query)
      return result
    } catch (err) {
      log.error(err)
      return false
    }
  }

  //与えられたnamesと同じ名前を持つタグを配列で返す
  async getTagsByNames(names, idMode=true) {
    if (!Array.isArray(names)) return []
    const result = await Tag.findAll({
      where: {
        name: {
          [Op.in]: names
        }
      },
      raw: true
    })
    
    if (!idMode) {
      return result
    } else {
      return result.map(tag => tag.tagID)
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
      await this.setLastUsedTime(tag[0])

      return {
        tag: tag[0].dataValues,
        created: tag[1],
      }
    } catch (err) {
      log.error(err)
      return false
    }
  }

  async setLastUsedTime(tag) {
    tag.update({
      lastUsed: new Date(),
    })
  }

  async setByID(contentIDs, tagID) {
    try {
      const tag = await Tag.findOne({ where: { tagID: tagID } })
      const contents = await Content.findAll({
        where: { contentID: contentIDs },
      })
      await tag.addContents(contents)
      await this.setLastUsedTime(tag)
      return true
    } catch (err) {
      log.error(err)
      return false
    }
  }

  async removeByID(contentIDs, tagID) {
    try {
      const tag = await Tag.findOne({ where: { tagID: tagID } })
      const contents = await Content.findAll({
        where: { contentID: contentIDs },
      })
      await tag.removeContents(contents)
      return true
    } catch (err) {
      log.error(err)
      return false
    }
  }

  async delete(tagIDs) {
    try {
      await Tag.destroy({
        where: { tagID: tagIDs },
      })
      return true
    } catch (err) {
      log.error(err)
      return false
    }
  }
}

export const tags = new TagsManager()
