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

  async create(data) {
    try {
      store.commit("setTask", {
        message: `${data.files.length}件のファイルを追加中...`,
      })

      //ipc送信時の注意
      //1. FilesはmapできないのでArrayにする。
      //2. Fileは各情報がprototypeにあるので改めてオブジェクトを作る
      const files = Array.from(data.files).map((file) => {
        return {
          name: file.name,
          type: file.type,
          path: file.path,
          size: file.size,
        }
      })
      const result = await window.ipc.createContents({
        files,
        folderID: data.folderID || 1,
      })

      //browserをリロードする
      window.dispatchEvent(this.events.reloadContents)

      //保存したコンテンツを編集する
      store.dispatch("setSelectedItems", result)

      store.commit("setTask", null)

      const successCount = result.filter((r) => r != null).length
      this.createdNotice(successCount, data.files.length)

      return result
    } catch (e) {
      console.error(e)
      store.commit("setTask", null)
    }
  }

  //search.executeへのエイリアス
  async search(query) {
    const result = await searchManager.execute(query)
    return result
  }

  async getData(contentIDs) {
    const result = await this.search({ contentIDs })
    return result
  }

  //指定されたコンテンツで、columnsカラムの値が全て共通するかどうかを調べる。(共通する場合はその値、共通しない場合はnull)
  //columns = ["name", "author"]の場合、{ name: null, author: '葛飾北斎' } みたいに帰ってくる
  async checkCommonValues(contentIDs, columns) {
    if (!contentIDs.length || !columns.length) return
    const result = await window.ipc.checkContentCommonValues({
      contentIDs,
      columns,
    })
    return result
  }

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

  async delete(IDs) {
    if (!IDs) return
    const result = await window.ipc.deleteContent(IDs)
    //Browserを再読み込みする
    window.dispatchEvent(this.events.reloadContents)
    return result
  }

  getThumbnail(content, size = "medium") {
    if (size === "small" || size === "s") {
      return `file://${content.folderPath}/${content.thumbnailSmall}`
    } else {
      return `file://${content.folderPath}/${content.thumbnailMedium}`
    }
  }

  createdNotice(successCount, length) {
    //通知を表示する
    let noticeMessage
    if (length === 1) {
      noticeMessage = successCount
        ? `アイテムの保存が完了しました。`
        : `アイテムの保存に失敗しました。`
    } else {
      noticeMessage =
        successCount - length < 0
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

  view(contentID, contentIndex = null) {
    const index =
      contentIndex === null
        ? store.state.searchResultIDs.findIndex((id) => id === contentID)
        : contentIndex

    router.push({ name: "View", params: { contentID, index } })
  }
}

const contentsManager = new RendererContentsManager()

export default contentsManager
