//------------------------------------
// 検索管理 for メインプロセス
//------------------------------------
const { Content } = require("../../db/models/content")
const { folders } = require("../folders/main-folders-manager")
const { Op } = require("sequelize")
const log = require("electron-log")

//Searchインスタンスを生成して検索を実行する。
export const executeSearch = (query) => {
  const search = new Search(query)
  return search.execute()
}

class Search {
  constructor(query, raw = true) {
    log.info(`[contentSearch] Creating search instance`)
    this.query = query

    //検索オブジェクトを初期化
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
    }

    //条件にショートカットでアクセスできるようにする
    this.queryRoot = this.queryObject.where[Op.or]
    this.queryAnd = this.queryObject.where[Op.or][0][Op.and]
  }

  async registerQuerys() {
    //各検索条件をクエリに登録する
    this.registerSearchIDs()
    this.registerSearchWords()
    this.registerSearchFolders()
    this.registerOrders()

    //検索条件が一切ない場合where句を削除する
    if (!this.queryAnd.length && this.queryRoot.length === 1) {
      delete this.queryObject.where
    }
  }

  //コンテンツID条件
  registerSearchIDs() {
    if (!this.query.contentIDs) return
    this.queryAnd.push({ contentId: this.query.contentIDs })
  }

  //検索ワード条件
  registerSearchWords() {
    if (!this.query.word) return

    //各種スペースかコンマで区切る
    const splitter = /[\s|　,]/
    const words = this.query.word.split(splitter)

    for (const word of words) {
      this.queryAnd.push({ name: { [Op.like]: `%${word}%` } })
    }
  }

  //フォルダ条件
  registerSearchFolders() {
    if (!this.query.folder) return
    //子孫フォルダも検索対象の場合、子孫フォルダをIDリストに追加する
    const folderIDs = this.query.config.includeDecendantFolders
      ? folders.root.getChildById(this.query.folder).getAllAffiliatedID()
      : this.query.folder
    console.log(folderIDs)
    //クエリにフォルダ条件を追加する。複数のフォルダ条件がある場合or条件になる
    this.queryAnd.push({ folderID: folderIDs })
  }

  //順番条件。記載がない場合は作成日の降順になる
  registerOrders() {
    this.queryObject.order = this.query.order
  }

  //検索を実行する
  async execute() {
    log.info(`[contentSearch] Start searching`)
    await this.registerQuerys()
    const result = await Content.findAndCountAll(this.queryObject)
    log.info(`[contentSearch] Found ${result.count} items`)

    return result.rows
  }
}
