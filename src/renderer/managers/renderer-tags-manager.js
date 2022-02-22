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

  async set(contentIDs, tagName) {
    const result = await window.ipc.setTag(contentIDs, tagName)
    return result
  }
}

const tagsManager = new RendererTagsManager()

export default tagsManager
