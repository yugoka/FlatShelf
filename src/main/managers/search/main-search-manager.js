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
    this.queryObject = {    
      where: {
        [Op.or]: [
          {
            [Op.and]: []
          }
        ]
      }
    }
    //条件にショートカットでアクセスできるようにする
    this.queryRoot = this.queryObject.where[Op.or]
    this.queryAnd = this.queryObject.where[Op.or][0][Op.and]
    
    //各検索条件をクエリに登録する
    this.registerSearchWords()
    this.registerSearchFolders()
  }

  //スペースやカンマで区切られたワードを展開して検索に登録する
  registerSearchWords() {
    if (!this.query.searchWord) return

    //各種スペースかコンマで区切る
    const splitter = (/[\s|　,]/)
    const words = this.query.searchWord.split(splitter)

    for (const word of words) {
      this.queryAnd.push({name: {[Op.like]: `%${word}%`}})
    }
  }

  //フォルダ
  registerSearchFolders() {
    if (!this.query.searchFolders) return
    //クエリにフォルダ条件を追加する。複数のフォルダ条件がある場合or条件になる
    this.queryAnd.push({ folderID: this.query.searchFolders })
  }

  //検索を実行する
  async execute() {
    log.info(`[contentSearch] Start searching`)
    const result = await Content.findAll(this.queryObject)
    log.info(`[contentSearch] Found ${result.length} items`)

    return result
  }
}
