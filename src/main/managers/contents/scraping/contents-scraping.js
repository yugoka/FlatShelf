//------------------------------------
// コンテンツ管理 for メインプロセス
//------------------------------------
const {
  productIDRegex,
  scrapingWaitTime,
  excludeTags,
} = require("./scraping-constants")
const { executeSearch } = require("../../search/main-search-manager")
const { config } = require("../../main-config-manager")
const { tags } = require("../../tags/main-tags-manager")
const { contents } = require("../main-contents-manager")
const { setTimeout } = require("timers/promises")
const log = require("electron-log")
const throttle = require("lodash.throttle")
const cheerio = require("cheerio")
const got = require("got")
const { CookieJar } = require("tough-cookie")

//------------------------------------
// スクレイピングタスクの管理用クラス
//------------------------------------
class ScrapingTaskManager {
  constructor() {
    this.running = false
  }

  //------------------------------------
  // スクレイピングタスクを追加
  // whileで待機処理書いてるけどあんまり良い実装じゃなさそう
  //------------------------------------
  async addTask(contentIDs) {
    const contentsData = await executeSearch({ contentIDs, types: ["book"] })

    for await (const content of contentsData) {
      //最大何回アクセスを試みるか
      const maxTryCount = 100

      let tryCount = 0
      while (tryCount < maxTryCount) {
        tryCount += 1

        //他の処理が実行中の場合
        if (this.running) {
          log.info(`[BookScraping] Waiting for scraping task end`)
          await setTimeout(scrapingWaitTime + 50)
          //今から処理開始できる場合
        } else {
          this.running = true
          await this.runScraping(content)

          setTimeout(scrapingWaitTime).then(() => {
            this.running = false
          })

          //トライを終了
          break
        }
      }
    }
  }

  //------------------------------------
  // スクレイピングを実行
  //------------------------------------
  async runScraping(content) {
    try {
      const result = await getBookData(content)
      if (!result) return

      await contents.update({
        contentIDs: content.contentID,
        values: result.data,
      })

      //設定がオンならタグを追加する
      if (config.get("main.scraping.getTagOnScraping")) {
        tags.setMany([content.contentID], result.tags)
      }

      return true
    } catch (e) {
      log.error(`[BookScraping] ${e}`)
    }
  }
}

//------------------------------------
// 同人誌データを取得(スロットリング済)
//------------------------------------
const getBookData = throttle(
  async function (content) {
    const bookName = content.name

    if (bookName.match(productIDRegex.DLSite)) {
      return await getDLSiteData(bookName)
    } else if (bookName.match(productIDRegex.FANZA)) {
      return await getFANZAData(bookName)
    }

    log.info(`[BookScraping] ${content.name} is not supported`)
    return null
  },
  scrapingWaitTime - 300,
  { trailing: false }
)

//------------------------------------
// DLSiteからデータ取得
//------------------------------------
const getDLSiteData = async (bookName) => {
  const productID = bookName.match(productIDRegex.DLSite)[0]

  log.info(`[BookScraping] Getting information from DLSite. PID: ${productID}`)

  //とりあえずhomeセクションにしておけば自動的にリダイレクトしてくれる模様
  const url = `https://www.dlsite.com/home/work/=/product_id/${productID}.html`
  const response = await got(url)
  const $ = cheerio.load(response.body)

  //各種情報を抜き出し
  const name = $("#work_name").text().trim()
  const author = $("#work_maker")
    .find("td")
    .eq(0)
    .text()
    .replace(/  +/g, " ")
    .trimStart()
    .trimEnd()
  const description = $(".work_parts_area").text().trim()

  //タグを抜き出し
  const tags = $(".main_genre").eq(0).text().trim().split(/\s+/)

  return {
    data: {
      name,
      author,
      description,
      productID,
    },
    tags,
  }
}

//------------------------------------
// FANZAからデータ取得
//------------------------------------
const getFANZAData = async (bookName) => {
  const productID = bookName.match(productIDRegex.FANZA)[0]

  log.info(`[BookScraping] Getting information from FANZA. PID: ${productID}`)

  const cookieJar = new CookieJar()
  await cookieJar.setCookie("age_check_done=1", "https://www.dmm.co.jp")

  const url = `https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=${productID}/`
  const response = await got(url, { cookieJar })
  const $ = cheerio.load(response.body)

  const productTitle = $(".productTitle").text()
  const saleText = $(".productTitle__txt .productTitle__txt--campaign").text()

  //各種情報を抜き出し
  const name = productTitle.replace(saleText, "").trim()
  const author = $(".circleName__txt").text()
  const description = $(".summary__txt").text().trim()

  //タグ抜き出し
  const tags = $(".informationList__item")
    .text()
    .trim()
    .split(/\s+/)
    .filter((tag) => !excludeTags.includes(tag))

  return {
    data: {
      name,
      author,
      description,
      productID,
    },
    tags,
  }
}

export const scraping = new ScrapingTaskManager()
