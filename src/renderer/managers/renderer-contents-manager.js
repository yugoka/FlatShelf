//------------------------------------
// 設定管理 for レンダラープロセス
//------------------------------------

class RendererContentsManager {
  async createContent(data) {
    const result = await window.ipc.createContent(data)
    return result
  }
}

const contentsManager = new RendererContentsManager()

export default contentsManager
