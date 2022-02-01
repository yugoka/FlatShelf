//------------------------------------
// 検索管理 for メインプロセス
//------------------------------------
const { Content } = require("../../db/models/content")
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

    //各検索条件をクエリに登録する
    this.registerSearchIDs()
    this.registerSearchWords()
    this.registerSearchFolders()
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
    if (!this.query.folders) return
    //クエリにフォルダ条件を追加する。複数のフォルダ条件がある場合or条件になる
    this.queryAnd.push({ folderID: this.query.folders })
  }

  //検索を実行する
  async execute() {
    log.info(`[contentSearch] Start searching`)
    const result = await Content.findAll(this.queryObject)
    log.info(`[contentSearch] Found ${result.length} items`)

    return result
  }
}
