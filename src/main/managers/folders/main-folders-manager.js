//------------------------------------
// フォルダーの読み込み/書き込み for メインプロセス
//------------------------------------
const Store = require("electron-store")
const { WORKING_SPACE } = require("../../initializers/global-settings")
const { Node } = require("./folder-node")
const { Folder } = require("../../db/models/folder")

class FoldersManager {
  constructor() {
    //フォルダ構造を表すオブジェクト
    this.structure = store.get("structure")
    //structureを拡張したもので、フォルダ構造の管理を行える
    this.root = this.initModel()
  }

  //レンダラー用にフォルダ構造を取得する
  getStructure() {
    //structure[0]はrootフォルダ
    return this.structure[0].children
  }

  initModel() {
    const rootNode = new Node(1, "root")
    //再帰的に子要素を追加する　
    rootNode.appendAllChildren(this.structure[0])
    return rootNode
  }
}

//------------------------------------
// 設定保存場所の生成
//------------------------------------
//デフォルトのjsonファイル
const defaults = {
  structure: [
    {
      id: 1,
      name: "root",
      children: []
    }
  ]
}
const store = new Store({
  name: "folders",
  cwd: WORKING_SPACE,
  defaults
})

export const folders = new FoldersManager()