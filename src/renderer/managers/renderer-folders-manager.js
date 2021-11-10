//------------------------------------
// フォルダ管理 for レンダラープロセス
//------------------------------------
import store from "../store"

class RendererFoldersManager {
  constructor() {}

  //フォルダ構造を取得してstoreに格納する
  //main.jsで初期化時に一度呼ばれる(同期的)
  //また、CRUDメソッドは変更後のフォルダ構造をまとめて返す
  async getStructure() {
    const foldersStructure = await window.ipc.getFoldersStructure()
    this.setFolders(foldersStructure)
  }

  //この関数ではフォルダツリー全体に加えて作成されたノード単体も返される
  async create(targetID) {
    const result = await window.ipc.createNewFolder(Number(targetID))
    const foldersStructure = result.structure
    this.setFolders(foldersStructure)
    return result.newFolder
  }

  async rename(folderID, name) {
    if (!name || !folderID) return
    const foldersStructure = await window.ipc.renameFolder(Number(folderID), name)
    this.setFolders(foldersStructure)
  }

  async changeParent(folderID, parentFolderID) {
    if (!folderID || !parentFolderID) return
    if (folderID === parentFolderID) return
    const foldersStructure = await window.ipc.changeParentFolder(Number(folderID), Number(parentFolderID))
    this.setFolders(foldersStructure)
  }

  async delete(folderID) {
    //rootを削除させない安全対策
    if (folderID === 1) return
    const foldersStructure = await window.ipc.deleteFolder(Number(folderID))
    this.setFolders(foldersStructure)
  }

  setFolders(structure) {
    store.commit("setFolders", structure)
  }

}

const foldersManager = new RendererFoldersManager()

export default foldersManager
