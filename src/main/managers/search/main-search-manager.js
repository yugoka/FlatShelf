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
  constructor(query) {
    log.info(`[contentSearch] Creating search instance`)
    this.query = query

    //検索オブジェクトを初期化
    this.searchObject = {    
      where: {
        [Op.or]: [
          {
            [Op.and]: []
          }
        ]
      }
    }
    //and条件にショートカットでアクセスできるようにする
    this.queryAnd = this.searchObject.where[Op.or][0][Op.and]
  }

  //スペースやカンマで区切られたワードを展開して検索に登録する
  parseSearchWords() {
    //各種スペースかコンマで区切る
    const splitter = (/[\s|　,]/)
    const words = this.query.searchWord.split(splitter)

    for (const word of words) {
      this.queryAnd.push({name: {[Op.like]: `%${word}%`}})
    }
  }

  //検索を実行する
  async execute() {
    log.info(`[contentSearch] Start searching`)

    //検索ワード
    this.parseSearchWords()
    const result = await Content.findAll(this.searchObject)
    log.info(`[contentSearch] Found ${result.length} items`)
    return result
  }
}
