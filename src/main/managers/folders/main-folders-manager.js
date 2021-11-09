//------------------------------------
// フォルダーの読み込み/書き込み for メインプロセス
//------------------------------------
const Store = require("electron-store")
const { WORKING_SPACE } = require("../../initializers/global-settings")
const { Node } = require("./folder-node")
const { Folder } = require("../../db/models/folder")

class FoldersManager {
  constructor() {
    //フォルダ構造を表すオブジェクトで、jsonから読み込まれる
    const structure = store.get("structure")
    //structureを拡張したもので、フォルダ構造の管理を行える
    //独立したクラスなのでレンダラーに渡した後もメソッドを使える
    this.root = this.initStructure(structure)
  }

  //フォルダを作成する
  async create(parentID=1) {
    const parent = this.root.getChildById(parentID)
    if (!parent) return this.getAll()
    const newFolder = await Folder.create({
      name: "新規フォルダ"
    })

    const folderNode = new Node(newFolder.dataValues.folderID, newFolder.dataValues.name)
    parent.appendChild(folderNode)

    this.saveStructure()
    return this.getAll()
  }

  //フォルダの所属先を変更する。バグを生む可能性がかなり高い部分なので注意すること
  //後でテストする
  changeParent(targetID, newParentID) {
    const target = this.root.getChildById(targetID)

    //移動先のフォルダがターゲットフォルダの子孫要素ならキャンセルする
    if (target.getChildById(newParentID)) return this.getAll()

    const oldParent = this.root.getChildById(target.parentID)
    const newParent = this.root.getChildById(newParentID)

    //移動元=移動先の場合やいずれかのフォルダが見つからない場合はキャンセル
    if (oldParent === newParent) return this.getAll()
    if (!target || !oldParent || !newParent) return this.getAll()

    //元のフォルダから削除
    oldParent.deleteChild(targetID)
    //新しい親に追加
    newParent.appendChild(target)

    this.saveStructure()

    return this.getAll()
  }


  //フォルダを削除する
  //子フォルダまで削除したりdb編集したりがあるのであとまわし
  async delete(folderID) {

  }

  getAll() {
    return this.root
  }

  //jsonから読み込まれたフォルダ構造からNodeインスタンスで構成されたツリー構造を生成する
  initStructure(structure) {
    //rootフォルダーは常にid=1, name="root"になる。初回起動時にdbには自動登録済み
    const rootNode = new Node(1, "root")
    rootNode.appendAllChildren(structure[0])
    return rootNode
  }
  
  saveStructure() {
    store.set("structure", [this.root])
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