//------------------------------------
// タグ管理 for レンダラープロセス
//------------------------------------
import store from "../store"

class RendererTagsManager {
  async set(contentIDs, tagName) {
    const result = await window.ipc.setTag(contentIDs, tagName)
    return result
  }
}

const tagsManager = new RendererTagsManager()

export default tagsManager
