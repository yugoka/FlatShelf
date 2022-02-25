//------------------------------------
// フォルダ構造を構成するノードのclass
//------------------------------------

export class Node {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.parentID = null
    this.children = []
  }

  appendChild(childNode) {
    this.children.push(childNode)
    childNode.parentID = this.id
  }

  deleteChild(id) {
    this.children = this.children.filter((child) => {
      return child.id != id
    })
  }

  getChildrenIDs() {
    return this.children.map((child) => child.id)
  }

  //子孫フォルダのIDをすべて取得する
  getAllDecendantsID() {
    const decendants = []
    for (const child of this.children) {
      decendants.push(child.id)
      const childDecendants = child.getAllDecendantsID()
      decendants.push(...childDecendants)
    }
    return decendants
  }

  //自分のID+子孫フォルダのIDすべてを取得する
  getAllAffiliatedID() {
    return [this.id, ...this.getAllDecendantsID()]
  }

  //子孫フォルダの中から指定IDのフォルダnodeを取得する
  //頻繁に呼ぶ重い処理なのでキャッシュ化することも検討するべき
  getChildById(id) {
    if (this.id === id) return this
    //末端ノードかつ検索対象でないならfalseを返す
    if (!this.children.length) return false

    //少しでも高速化するために通常のfor文を使用
    for (let i = 0; i < this.children.length; i++) {
      const result = this.children[i].getChildById(id)
      //IDが一致したらそのオブジェクトを返す
      if (result) return result
    }

    return false
  }

  //structureを参照して再帰的に子要素を追加し、Nodeインスタンスによるツリー構造を作る
  appendAllChildren(structure) {
    if (structure.children) {
      for (const childStructure of structure.children) {
        const child = new Node(childStructure.id, childStructure.name)
        this.appendChild(child)
        child.appendAllChildren(childStructure)
      }
    }
  }
}
