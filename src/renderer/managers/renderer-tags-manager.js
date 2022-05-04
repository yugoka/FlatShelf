//------------------------------------
// タグ管理 for レンダラープロセス
//------------------------------------
import store from "../store"

class RendererTagsManager {
  //対象のコンテンツ全てに共通するタグを抽出する
  async getCommonTags(contentIDs) {
    const result = await window.ipc.getCommonTags(contentIDs)
    return result
  }

  async get(data) {
    const result = await window.ipc.getTags(data)
    return result
  }

  async set(contentIDs, tagName) {
    const result = await window.ipc.setTag(contentIDs, tagName)
    return result
  }

  async setByID(contentIDs, tagID) {
    const result = await window.ipc.setTagByID(contentIDs, tagID)
    return result
  }

  //指定したタグの最後に使用した日時を現在時刻に設定する
  async setTimeStamp(tagIDs) {
    await window.ipc.setTagTimestamp(tagIDs)
  }

  async removeByID(contentIDs, tagID) {
    const result = await window.ipc.removeTagByID(contentIDs, tagID)
    return result
  }
}

const tagsManager = new RendererTagsManager()

export default tagsManager
