//------------------------------------
// フォルダーの読み込み/書き込み for メインプロセス
//------------------------------------
const Store = require("electron-store")
const { WORKING_SPACE } = require("../../initializers/global-settings")
const { Node } = require("./folder-node")
const { Folder } = require("../../db/models/folder")
const { Content } = require("../../db/models/content")
const fs = require("fs").promises
const log = require("electron-log")

class FoldersManager {
  constructor() {
    //フォルダ構造を表すオブジェクトで、jsonから読み込まれる
    const structure = store.get("structure")
    //structureを拡張したもので、フォルダ構造の管理を行える
    this.root = this.initStructure(structure)
  }

  //フォルダを作成する
  async create(parentID = 1) {
    const parent = this.root.getChildById(parentID)
    if (!parent) return

    const newFolder = await Folder.create({
      name: "新規フォルダ",
    })

    const folderNode = new Node(
      newFolder.dataValues.folderID,
      newFolder.dataValues.name
    )
    parent.appendChild(folderNode)

    this.saveStructure()
    //新しく作ったフォルダが返される
    return folderNode
  }

  //フォルダの所属先を変更する。バグを生む可能性がかなり高い部分なので注意すること
  //後でテストする
  changeParent(targetID, newParentID) {
    try {
      const target = this.root.getChildById(targetID)
      const oldParent = this.root.getChildById(target.parentID)
      const newParent = this.root.getChildById(newParentID)

      //いずれかのフォルダーが見つからなかったらキャンセル
      if (!target || !oldParent || !newParent) return
      //移動先のフォルダがターゲットフォルダの子孫要素ならキャンセル
      if (target.getChildById(newParentID)) return

      //元のフォルダから削除
      oldParent.deleteChild(targetID)
      //新しい親に追加
      newParent.appendChild(target)

      this.saveStructure()
    } catch (err) {
      log.error(`[folderMove] Error: ${err}`)
    }
  }

  async getData(ids) {
    try {
      const result = await Folder.findAll({
        where: { folderID: ids },
        raw: true,
      })
      return result
    } catch (err) {
      log.error(`[folderRead] Error: ${err}`)
    }
  }

  //todo:バリデーションつける。レンダラー側にも
  async rename(folderID, name) {
    const targetFolderData = await Folder.findByPk(folderID)
    const targetFolderNode = this.root.getChildById(folderID)
    if (!targetFolderData || !targetFolderNode) return

    //structure上で名前を変更
    targetFolderNode.name = name
    this.saveStructure()
    //db上で名前を変更
    targetFolderData.name = name
    targetFolderData.save()
  }

  //フォルダを削除する(子フォルダ含む)
  async delete(folderID) {
    try {
      log.info(`[folderDelete] Deleting folder${folderID}`)
      //安全対策:rootフォルダを削除できないようにする
      if (Number(folderID) === 1) return

      const folderNode = this.root.getChildById(folderID)
      const parentNode = this.root.getChildById(folderNode.parentID)

      if (!folderNode || !parentNode) return

      const childrenIDs = folderNode.getAllAffiliatedID()

      //子孫フォルダ＋自身に属するコンテンツを削除
      //ごみ箱フォルダを設けてそこに移動する実装も検討するべき
      await this.deleteChildContents(childrenIDs)

      //DBから削除
      await Folder.destroy({
        where: {
          folderId: childrenIDs,
        },
      })

      //フォルダ構造から削除
      parentNode.deleteChild(folderID)
      this.saveStructure()
    } catch (err) {
      log.error(`[folderDelete] Error: ${err}`)
    }
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

  //指定フォルダのコンテンツをすべて削除
  async deleteChildContents(folderIDs) {
    const folderPaths = await Content.findAll({
      raw: true,
      where: {
        folderId: folderIDs,
      },
      attributes: ["folderPath"],
    })
    for await (const folder of folderPaths) {
      log.info(`[contentDelete] Deleting ${folder.folderPath}`)
      await fs.rmdir(folder.folderPath, { recursive: true })
    }
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
      children: [],
    },
  ],
}
const store = new Store({
  name: "folders",
  cwd: WORKING_SPACE,
  defaults,
})

export const folders = new FoldersManager()
