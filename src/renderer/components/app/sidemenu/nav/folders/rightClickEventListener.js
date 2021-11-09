//------------------------------------
// フォルダの右クリックイベント登録
//------------------------------------

//右クリックされた時引数のcallbackが実行される
export const registerRightClickListener = (callback) => {
  const foldersRoot = document.getElementById("side-menu-folders")
  //各フォルダの実体要素
  const folderNodes = foldersRoot.getElementsByClassName("v-treeview-node__root")

  for (const node of folderNodes) {
    const folderID = node.getElementsByClassName("side-menu-folders-folder-id")[0].value

    node.addEventListener("contextmenu", callback)
    node.folderID = folderID
  }
}