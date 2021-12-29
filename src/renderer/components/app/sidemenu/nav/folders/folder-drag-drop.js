//------------------------------------
// フォルダのドラッグ＆ドロップ管理
//------------------------------------
import foldersManager from "../../../../../managers/renderer-folders-manager"

class FolderDragger {
  constructor() {}

  startDrag(event) {
    event.stopPropagation()
    const folderID = event.target.folderID
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.dropEffect = "move"

    event.dataTransfer.setData("text/plain", folderID)
  }

  async drop(event) {
    event.stopPropagation()
    if (event.currentTarget.eventType != "folder") return
    const parentFolderID = event.currentTarget.folderID
    const childFolderID = event.dataTransfer.getData("text/plain")
    await foldersManager.changeParent(childFolderID, parentFolderID)
  }
}

export default new FolderDragger()
