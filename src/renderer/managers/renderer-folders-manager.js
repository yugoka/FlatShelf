//------------------------------------
// フォルダ管理 for レンダラープロセス
//------------------------------------
import store from "../store"

class RendererFoldersManager {
  constructor() {
    this.events = {
      reloadContents: new CustomEvent("reloadContents"),
    }
  }

  //フォルダ構造を取得してstoreに格納する
  //main.jsで初期化時に一度呼ばれる(同期的)
  async getStructure() {
    const foldersStructure = await window.ipc.getFoldersStructure()
    this.setFolders(foldersStructure)
  }

  //resultはフォルダ構造と新しいフォルダを両方含む
  async create(targetID) {
    const result = await window.ipc.createNewFolder(Number(targetID))
    const foldersStructure = result.structure
    this.setFolders(foldersStructure)
    return result.newFolder
  }

  async getData(ids) {
    const result = await window.ipc.getFolderData(ids)
    return result
  }

  async getDecendants(folderID, mode = "decendants", includeMe = false) {
    const result = await window.ipc.getFolderDecendants(
      folderID,
      mode,
      includeMe
    )
    return result
  }

  async rename(folderID, name) {
    if (!name || !folderID) return
    const foldersStructure = await window.ipc.renameFolder(
      Number(folderID),
      name
    )
    this.setFolders(foldersStructure)
  }

  async changeParent(folderID, parentFolderID) {
    if (!folderID || !parentFolderID) return
    if (folderID === parentFolderID) return
    const foldersStructure = await window.ipc.changeParentFolder(
      Number(folderID),
      Number(parentFolderID)
    )
    this.setFolders(foldersStructure)

    //Browserを再読み込みする
    window.dispatchEvent(this.events.reloadContents)
  }

  async delete(folderID) {
    //rootを削除させない安全対策
    if (folderID === 1) return
    const foldersStructure = await window.ipc.deleteFolder(Number(folderID))
    this.setFolders(foldersStructure)

    //Browserを再読み込みする
    window.dispatchEvent(this.events.reloadContents)
  }

  setFolders(structure) {
    store.commit("setFolders", structure)
  }
}

const foldersManager = new RendererFoldersManager()

export default foldersManager
