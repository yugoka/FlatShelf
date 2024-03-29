//------------------------------------
// コンテンツ管理 for レンダラープロセス
//------------------------------------
import store from "../store"
import searchManager from "./renderer-search-manager"
import router from "../router"

class RendererContentsManager {
  constructor() {
    this.events = {
      reloadContents: new CustomEvent("reloadContents"),
    }
  }

  //------------------------------------
  //コンテンツ作成
  //------------------------------------
  async create(data) {
    try {
      store.commit("setTask", {
        id: "create",
        message: `${data.files.length}件のファイルを追加中...`,
      })

      //ipc送信時の注意
      //1. FilesオブジェクトはmapできないのでArrayに変換する。
      //2. Fileは各情報がprototypeにあるので改めてオブジェクトを作る
      const files = Array.from(data.files).map((file) => {
        return {
          name: file.name,
          type: file.type,
          path: file.path,
          size: file.size,
        }
      })

      //コンテンツを新規作成
      const result = await window.ipc.createContents({
        files,
        folderID: data.folderID || 1,
      })

      //正常に登録できたコンテンツ
      const success = result.filter((r) => r.status === "success")
      const successContentIDs = success.map((r) => r.content.contentID)

      //設定がオンならブックの情報をスクレイピングする
      if (store.state.settings.main.import.getBookDataOnImport) {
        await this.addScrapingTask(successContentIDs)
      }

      //browserをリロードする
      window.dispatchEvent(this.events.reloadContents)

      this.createdNotice(result, success.length)

      //設定がオンなら保存したコンテンツを編集する
      if (store.state.settings.main.import.editOnImport) {
        store.dispatch("setSelectedItems", successContentIDs)
      }

      store.commit("setTask", null)
    } catch (e) {
      console.error(e)
      store.commit("setTask", null)
    }
  }

  //------------------------------------
  //search.executeへのエイリアス
  //------------------------------------
  async search(query) {
    const result = await searchManager.execute(query)
    return result
  }

  //------------------------------------
  //IDからコンテンツ情報を取得
  //------------------------------------
  async getData(contentIDs) {
    const result = await searchManager.execute({ contentIDs })
    return result
  }
  //------------------------------------
  //指定されたコンテンツで、columnsカラムの値が全て共通するかどうかを調べる。(共通する場合はその値、共通しない場合はnull)
  //columns = ["name", "author"]の場合、{ name: null, author: '葛飾北斎' } みたいに帰ってくる
  //------------------------------------
  async checkCommonValues(contentIDs, columns) {
    if (!contentIDs.length || !columns.length) return
    const result = await window.ipc.checkContentCommonValues({
      contentIDs,
      columns,
    })
    return result
  }

  //------------------------------------
  // コンテンツ更新
  //------------------------------------
  async update(IDs, values) {
    if (!values || !IDs) return
    const result = await window.ipc.updateContent({
      contentIDs: IDs,
      values,
    })
    //Browserを再読み込みする
    window.dispatchEvent(this.events.reloadContents)
    return result
  }

  //------------------------------------
  // コンテンツ削除
  //------------------------------------
  async delete(IDs) {
    if (!IDs) return
    const result = await window.ipc.deleteContent(IDs)
    //Browserを再読み込みする
    window.dispatchEvent(this.events.reloadContents)
    return result
  }

  //------------------------------------
  // サムネイルのパスを取得する
  //------------------------------------
  getThumbnail(content, size = "medium") {
    if (size === "small" || size === "s") {
      return `file://${content.folderPath}/${content.thumbnailSmall}`
    } else {
      return `file://${content.folderPath}/${content.thumbnailMedium}`
    }
  }

  //------------------------------------
  // 作成時の通知
  //------------------------------------
  createdNotice(result, successCount) {
    const length = result.length
    //通知を表示する
    let noticeMessage
    if (length === 1) {
      noticeMessage = successCount
        ? `アイテムの保存が完了しました。`
        : `${result[0].message}`
    } else {
      noticeMessage =
        successCount < length
          ? `${length}件中${
              length - successCount
            }件のアイテムの保存に失敗しました。`
          : `${length}件のアイテムの保存が完了しました。`
    }
    store.commit("setNotice", {
      message: noticeMessage,
      icon: successCount === length ? "mdi-check" : "mdi-alert-circle-outline",
    })
  }

  //------------------------------------
  // 閲覧画面へ移動
  //------------------------------------
  view(contentID, contentIndex = null) {
    const index =
      contentIndex === null
        ? store.state.browser.searchResultIDs.findIndex(
            (id) => id === contentID
          )
        : contentIndex

    router.push({ name: "View", params: { contentID, index } })
  }

  //------------------------------------
  // コンテンツ情報をスクレイピングする
  //------------------------------------
  async addScrapingTask(contentIDs) {
    await window.ipc.addScrapingTask(contentIDs)
  }
}

const contentsManager = new RendererContentsManager()

export default contentsManager
