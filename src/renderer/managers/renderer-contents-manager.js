//------------------------------------
// 設定管理 for レンダラープロセス
//------------------------------------

class RendererContentsManager {
  async create(data) {
    const result = await window.ipc.createContent(data)
    return result
  }

  //searchとCRUDはマネージャー分けるべきかも
  async search(query) {
    const result = await window.ipc.searchContent(query)
    return result
  }
}

const contentsManager = new RendererContentsManager()

export default contentsManager
