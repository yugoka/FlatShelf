//------------------------------------
// コンテンツ管理 for レンダラープロセス
//------------------------------------
import store from "../store"

class RendererContentsManager {
  constructor() {
    this.events = {
      reloadContents: new CustomEvent("reloadContents"),
    }
  }

  async create(data) {
    const file = data.file
    //入力がそもそもファイル形式じゃないなら弾く
    if (!(file instanceof File)) return false

    //Node側だとFileオブジェクトが使えないらしいので必要なデータはここで展開する
    const fileData = {
      name: file.name,
      type: file.type,
      path: file.path,
    }

    const requestData = {
      fileData,
      folderID: data.folderID || 1,
    }

    const result = await window.ipc.createContent(requestData)
    return result
  }

  async createMany(data) {
    const files = data.files
    //保存に失敗した回数
    let failedCount = 0
    for await (const file of files) {
      const result = await this.create({
        file,
        folderID: data.folderID || 1,
      })
      if (!result) failedCount += 1
    }
    this.createdNotice(failedCount, files.length)
    return { failedCount }
  }

  //searchとCRUDはマネージャー分けるべきかも
  //→根幹は同じで委託する形かな
  async search(query) {
    const result = await window.ipc.searchContent(query)
    return result
  }

  async getData(contentIDs) {
    const result = await this.search({ contentIDs })
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

  createdNotice(failedCount, length) {
    //通知を表示する
    let noticeMessage
    if (length === 1) {
      noticeMessage = failedCount
        ? `コンテンツの保存に失敗しました。`
        : `コンテンツの保存が完了しました。`
    } else {
      noticeMessage = failedCount
        ? `${length}件中${failedCount}件のコンテンツの保存に失敗しました。`
        : `${length}件のコンテンツの保存が完了しました。`
    }
    store.commit("setNotice", {
      message: noticeMessage,
      icon: failedCount ? "mdi-alert-circle-outline" : "mdi-check",
    })
  }
}

const contentsManager = new RendererContentsManager()

export default contentsManager
