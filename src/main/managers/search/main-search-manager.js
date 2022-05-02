//------------------------------------
// 検索管理 for メインプロセス
//------------------------------------
const { Content } = require("../../db/models/content")
const { Tag } = require("../../db/models/tag")
const { folders } = require("../folders/main-folders-manager")
const { Op, fn, col, where } = require("sequelize")
const log = require("electron-log")

//Searchインスタンスを生成して検索を実行する。
export const executeSearch = (query) => {
  const search = new Search(query)
  return search.execute()
}

class Search {
  constructor(query, raw = true) {

    query.tags = []

    log.info(`[contentSearch] Creating search instance`)
    this.query = query

    //------------------------------------
    // 検索クエリのオブジェクト
    //------------------------------------
    this.queryObject = {
      //raw=trueならdataValuesだけが返る
      raw,
      order: [],
      where: {
        [Op.or]: [
          {
            [Op.and]: [],
          },
        ],
      },
      having: [],
      include: [],
      group: ["contentID"]
    }

    //条件にショートカットでアクセスできるようにする
    this.queryRoot = this.queryObject.where[Op.or]
    this.queryAnd = this.queryObject.where[Op.or][0][Op.and]
  }

  //------------------------------------
  // クエリ登録処理
  //------------------------------------
  async registerQuerys() {
    //各検索条件をクエリに登録する
    this.registerSearchIDs()
    this.registerSearchWords()
    this.registerSearchTags()
    this.registerSearchFolders()
    this.registerOrders()

    //検索条件が一切ない場合where句を削除する
    if (!this.queryAnd.length && this.queryRoot.length === 1) {
      delete this.queryObject.where
    }
  }

  //------------------------------------
  // コンテンツID条件
  //------------------------------------
  registerSearchIDs() {
    if (!this.query.contentIDs) return
    this.queryAnd.push({ contentId: this.query.contentIDs })
  }

  //------------------------------------
  // 検索ワード条件
  //------------------------------------
  registerSearchWords() {
    if (!this.query.word) return

    //各種スペースかコンマで区切る
    const splitter = /[\s|　,]/
    const words = this.query.word.split(splitter)

    for (const word of words) {
      this.queryAnd.push({ name: { [Op.like]: `%${word}%` } })
    }
  }

  //------------------------------------
  // タグ条件
  //------------------------------------
  registerSearchTags() {
    if (!this.query.tags || !this.query.tags.length) return

    //タグ検索条件の基本オブジェクト
    const tagInclude = {
      model: Tag,
      attributes: [],
      through: { attributes: [] },
      where: {}
    }

    tagInclude.where[Op.or] = this.query.tags.map((tag) => {
      return { tagID: tag }
    })

    this.queryObject.include.push(tagInclude)

    this.queryObject.having.push(where(fn('COUNT', col("Content.contentID")), this.query.tags.length))
  }

  //------------------------------------
  // フォルダ条件
  //------------------------------------
  registerSearchFolders() {
    if (!this.query.folder) return

    //子孫フォルダも検索対象の場合、子孫フォルダをIDリストに追加する
    const folderIDs = this.query.config.includeDecendantFolders
      ? folders.root.getChildById(this.query.folder).getAllAffiliatedID()
      : this.query.folder

    //クエリにフォルダ条件を追加する。複数のフォルダ条件がある場合or条件になる
    this.queryAnd.push({ folderID: folderIDs })
  }

  //------------------------------------
  // 順番条件
  //------------------------------------
  registerOrders() {
    this.queryObject.order = this.query.order
  }

  //------------------------------------
  // 検索実行
  //------------------------------------
  async execute() {
    log.info(`[contentSearch] Start searching`)
    await this.registerQuerys()
    const result = await Content.findAll(this.queryObject)
    log.info(`[contentSearch] Found ${result.length} items`)

    return result
  }
}
