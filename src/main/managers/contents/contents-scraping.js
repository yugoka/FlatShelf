//------------------------------------
// コンテンツ管理 for メインプロセス
//------------------------------------
const { executeSearch } = require("../search/main-search-manager")
const { setTimeout } = require("timers/promises")
const log = require("electron-log")
const throttle = require("lodash.throttle")
const cheerio = require("cheerio")
const got = require("got")

//------------------------------------
// 各販売サイトのID正規表現
//------------------------------------
const productIDRegex = {
  DLSite: /[RB][JE]\d{6}/,
  DMM: /d_\d{6}/,
}

class ScrapingTaskManager {
  constructor() {
    this.running = false
  }

  async addTask(contentIDs) {
    const contents = await executeSearch({ contentIDs })
    for await (const content of contents) {
      await getBookData(content)
      await setTimeout(2500)
    }
  }
}

const getBookData = throttle(async function (content) {
  const bookName = content.name

  if (bookName.match(productIDRegex.DLSite)) {
    getDLSiteData(bookName)
  } else if (bookName.match(productIDRegex.DMM)) {
    console.log("DMM")
  } else {
    console.log("others")
  }
}, 2000)

const getDLSiteData = async (bookName) => {
  try {
    const productID = bookName.match(productIDRegex.DLSite)[0]
    //とりあえずmaniax決め打ちで
    const url = `https://www.dlsite.com/maniax/work/=/product_id/${productID}.html`
    const response = await got(url)
    const $ = cheerio.load(response.body)
  } catch (e) {
    log.error(`[BookDataScraping]${e}`)
  }
}

export const scraping = new ScrapingTaskManager()
