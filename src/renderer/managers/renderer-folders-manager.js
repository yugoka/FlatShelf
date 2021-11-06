//------------------------------------
// フォルダ管理 for レンダラープロセス
//------------------------------------
import store from "../store"

class RendererFoldersManager {
  constructor() {}

  //フォルダ構造を取得してstoreに格納する
  //main.jsで初期化時に一度呼ばれる(同期的)
  async getStructure() {
    const foldersStructure = await window.ipc.getFoldersStructure()
    store.commit("setFoldersStructure", foldersStructure)
  }

}

const foldersManager = new RendererFoldersManager()

export default foldersManager
