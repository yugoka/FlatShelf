//------------------------------------
// 検索管理 for メインプロセス
//------------------------------------
const { Content } = require("../../db/models/content")
const { Tag } = require("../../db/models/tag")
const { folders } = require("../folders/main-folders-manager")
const { tags } = require("../tags/main-tags-manager")
const { Op, fn, col, where } = require("sequelize")
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

    //このフラグがtrueなら検索過程を飛ばして空の配列を返す
    this.notFound = false

    //tagsが未定義なら空の配列にする
    if (!Array.isArray(this.query.tags)) {
      this.query.tags = []
    }

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
      group: ["contentID"],
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
    //↓ここでquery.tagsに条件追加されるので前後関係に注意
    //あんまりいい実装じゃないかも
    await this.registerSearchWords()
    this.registerSearchTags()
    this.registerSearchFolders()
    this.registerSearchTypes()
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
  async registerSearchWords() {
    if (!this.query.word || typeof this.query.word != "string") return

    //検索対象のカラムを列挙した配列。
    //searchColumnsが定義されていない場合はすべてのカラムを対象にする。
    const searchColumns =
      Array.isArray(this.query.searchColumns) && this.query.searchColumns.length
        ? this.query.searchColumns
        : ["name", "description", "author"]

    //各種スペースかコンマで区切る
    const splitter = /[\s|　,]/
    const words = this.query.word.split(splitter)
    //ワード条件から抽出されたタグ
    const tagNames = []

    for (const word of words) {
      //#で始まるタグ指定の場合
      if (word[0] === "#" || word[0] === "＃") {
        //#を除いたタグ名を追加
        tagNames.push(word.slice(1))

        //通常の検索ワードの場合
      } else {
        const conditions = {
          [Op.or]: searchColumns.map((column) => {
            return {
              [column]: { [Op.like]: `%${word}%` },
            }
          }),
        }
        this.queryAnd.push(conditions)
      }
    }

    //ワード検索にタグ指定がある場合、タグ名称からIDを取得してタグ条件に追加
    if (tagNames.length) {
      //存在しないタグ名が1つでも含まれている場合falseが帰ってくる
      const tagIDs = await tags.getTagsByNames(tagNames, {
        idMode: true,
        checkExistence: true,
      })

      if (tagIDs) {
        this.query.tags = [...this.query.tags, ...tagIDs]

        //存在しないタグ名で検索した場合表示数が0件になるようにする
      } else {
        this.notFound = true
      }
    }
  }

  //------------------------------------
  // タグ条件
  //------------------------------------
  registerSearchTags() {
    if (!Array.isArray(this.query.tags) || !this.query.tags.length) return

    //タグ検索条件の基本オブジェクト
    const tagInclude = {
      model: Tag,
      attributes: [],
      through: { attributes: [] },
      where: {},
    }

    tagInclude.where[Op.or] = this.query.tags.map((tag) => {
      if (typeof tag === "number") {
        return { tagID: tag }
      }
    })

    this.queryObject.include.push(tagInclude)

    this.queryObject.having.push(
      where(fn("COUNT", col("Content.contentID")), this.query.tags.length)
    )
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
  // タイプ条件
  //------------------------------------
  registerSearchTypes() {
    if (!Array.isArray(this.query.types)) return
    const typeQuery = this.query.types.map((type) => {
      return { type: { [Op.like]: `%${type}%` } }
    })

    console.log(typeQuery)

    //クエリにフォルダ条件を追加する。複数のフォルダ条件がある場合or条件になる
    this.queryAnd.push({ [Op.or]: typeQuery })
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

    //notFoundフラグが立っている場合(タグ検索ワードを見つけられなかった場合など)は空の配列を結果として返す
    const result = this.notFound ? [] : await Content.findAll(this.queryObject)

    log.info(`[contentSearch] Found ${result.length} items`)

    return result
  }
}
