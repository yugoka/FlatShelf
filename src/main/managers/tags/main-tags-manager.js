//------------------------------------
// タグ管理 for メインプロセス
//------------------------------------

const { Content } = require("../../db/models/content")
const { Tag } = require("../../db/models/tag")
const log = require("electron-log")
const { Op } = require("sequelize")

class TagsManager {
  //------------------------------------
  // contentIDからタグを取得
  // 複数の場合すべてのcontentが共通して持つタグを返す
  //------------------------------------
  async getTagsByContentIDs(contentIDs) {
    if (!Array.isArray(contentIDs) && typeof contentIDs != "number") return []
    console.log(contentIDs)

    if (typeof contentIDs === "number") {
      const result = await this.getContentTags({
        contentID: contentIDs,
        raw: true,
      })
      return result
    } else if (contentIDs.length === 1) {
      const result = await this.getContentTags({
        contentID: contentIDs[0],
        raw: true,
      })
      return result
    } else {
      const result = await this.getCommonTags(contentIDs)
      return result
    }
  }

  async getContentTags({ contentID, raw = false } = {}) {
    try {
      if (typeof contentID != "number") {
        throw new Error("contentID must be number")
      }

      const content = await Content.findOne({
        where: { contentID },
      })

      const tags = await content.getTags({ raw: raw })
      return tags
    } catch (err) {
      log.error(err)
    }
  }

  //------------------------------------
  // 共通抽出
  // 対象のコンテンツ全てが共通して持つタグを抽出する
  //------------------------------------
  async getCommonTags(contentIDs) {
    try {
      if (!Array.isArray(contentIDs))
        throw new Error("contentIDs must be Array")

      const result = []
      const tags = await this.getContentTags({
        contentID: contentIDs[contentIDs.length - 1],
      })

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

  //------------------------------------
  // タグ検索
  //------------------------------------
  async get(data) {
    try {
      const query = {
        where: {},
        order: data.order || [["lastUsed", "DESC"]],
        raw: true,
      }

      //IDModeの場合はids=nullの時空配列を結果として返す。
      //そうでない場合、ids=nullは条件無しとして扱われる。
      if (data.idMode && !data.ids) {
        return []
      }

      if (data.ids) {
        query.where.tagID = data.ids
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
  //オプション：
  //idMode: タグ情報ではなくてID一覧を返す
  //checkExsist：与えられたnamesの中に存在しないタグ名が含まれる場合falseを返す
  async getTagsByNames(names, { idMode = false, checkExistence = false } = {}) {
    if (!Array.isArray(names)) return []
    const result = await Tag.findAll({
      where: {
        name: names,
      },
      raw: true,
    })

    //与えられたnamesの中に存在しないタグ名が含まれる場合falseを返す
    if (checkExistence) {
      const areAllNameExist = await this.checkNameExistence(names)
      if (!areAllNameExist) {
        return false
      }
    }

    if (!idMode) {
      return result
    } else {
      return result.map((tag) => tag.tagID)
    }
  }

  //namesのタグがすべて存在するかどうかを確認する。タグの数だけSQLを叩くのであんまりいい実装じゃないかも
  async checkNameExistence(names) {
    if (!Array.isArray(names)) return null

    const tagFinders = names.map((name) => {
      return Tag.findOne({
        where: { name },
        raw: true,
        attributes: ["name"],
      })
    })

    const results = await Promise.all(tagFinders)

    //見つからなかったタグ名があるかどうか判定
    if (results.includes(null)) {
      return false
    } else {
      return true
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
      await this.setTimeStamp(tag[0])

      return {
        tag: tag[0].dataValues,
        created: tag[1],
      }
    } catch (err) {
      log.error(err)
      return false
    }
  }

  async setByID(contentIDs, tagID) {
    try {
      const tag = await Tag.findOne({ where: { tagID: tagID } })
      const contents = await Content.findAll({
        where: { contentID: contentIDs },
      })
      await tag.addContents(contents)
      await this.setTimestamp(tagID)
      return true
    } catch (err) {
      log.error(err)
      return false
    }
  }

  //------------------------------------
  // 指定されたタグの最終使用を現時刻にする
  //------------------------------------

  async setTimestamp(tagIDs) {
    try {
      await Tag.update(
        {
          lastUsed: new Date(),
        },
        {
          where: {
            tagID: tagIDs,
          },
        }
      )
    } catch (err) {
      log.error(err)
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
