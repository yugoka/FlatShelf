//------------------------------------
// 設定管理 for レンダラープロセス
//------------------------------------

class RendererContentsManager {
  async create(file) {
    //入力がそもそもファイル形式じゃないなら弾く
    if (!(file instanceof File)) return false

    //Node側だとFileオブジェクトが使えないらしいので必要なデータはここで展開する
    const fileData = {
      name: file.name,
      type: file.type,
      path: file.path
    }
    const result = await window.ipc.createContent(fileData)
    return result
  }

  //searchとCRUDはマネージャー分けるべきかも
  //→根幹は同じで委託する形かな
  async search(query) {
    const result = await window.ipc.searchContent(query)
    return result
  }
}

const contentsManager = new RendererContentsManager()

export default contentsManager
