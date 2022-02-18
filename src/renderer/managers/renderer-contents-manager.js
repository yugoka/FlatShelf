//------------------------------------
// コンテンツ管理 for レンダラープロセス
//------------------------------------
import store from "../store"
import searchManager from "./renderer-search-manager"

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
    //保存に成功した回数
    let successCount = 0

    for await (const file of files) {
      const result = await this.create({
        file,
        folderID: data.folderID || 1,
      })
      if (result) successCount += 1

      //保存枚数30枚ごとにBrowser画面を更新する
      if (successCount % 30 === 0) {
        window.dispatchEvent(this.events.reloadContents)
      }
    }
    this.createdNotice(successCount, files.length)
    window.dispatchEvent(this.events.reloadContents)
    return { successCount }
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
      noticeMessage = successCount
        ? `${length}件中${
            length - successCount
          }件のアイテムの保存に失敗しました。`
        : `${length}件のアイテムの保存が完了しました。`
    }
    store.commit("setNotice", {
      message: noticeMessage,
      icon: successCount ? "mdi-check" : "mdi-alert-circle-outline",
    })
  }
}

const contentsManager = new RendererContentsManager()

export default contentsManager
