//------------------------------------
// フォルダ各要素のイベント登録
//------------------------------------
import folderDragger from "./folder-drag-drop"

//------------------------------------
// nodeのイベント登録
//------------------------------------
export const registerNodeEventListeners = ({ rightClick }) => {
  const foldersRoot = document.getElementById("side-menu-folders")
  //各フォルダの実体要素
  const folderNodes = foldersRoot.getElementsByClassName("v-treeview-node__root")

  for (const node of folderNodes) {
    const folderID = node.getElementsByClassName("side-menu-folders-folder-id")[0].value

    //各nodeにHTML5 draggableを追加する
    node.setAttribute("draggable", true)

    node.addEventListener("contextmenu", rightClick)
    node.addEventListener("dragstart", folderDragger.startDrag)
    node.addEventListener("drop", folderDragger.drop)
    node.addEventListener("dragenter", preventDefault)
    node.addEventListener("dragover", preventDefault)

    //event.currentTarget.folderIDにアクセスできるようにする 
    node.folderID = folderID
    node.eventType = "folder"
  }
}

//------------------------------------
// その他のイベント登録
//------------------------------------
export const initFolderEventListeners = ({ rightClick }) => {
  //フォルダ構造をラップするオブジェクトのイベント登録
  const folderWrapper = document.getElementById("side-menu-folders-wrapper")
  folderWrapper.addEventListener("drop", folderDragger.drop)
  folderWrapper.addEventListener("contextmenu", rightClick)
  folderWrapper.addEventListener("dragenter", preventDefault)
  folderWrapper.addEventListener("dragover", preventDefault)

  folderWrapper.folderID = "1"//rootフォルダの扱い
  folderWrapper.eventType = "folder"
}

function preventDefault(e) {
  e.preventDefault()
  e.stopPropagation()
}
