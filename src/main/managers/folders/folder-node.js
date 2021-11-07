//------------------------------------
// フォルダ構造を構成するノードのclass
//------------------------------------

export class Node {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.parent = null
    this.children = []
  }

  appendChild(childNode) {
    this.children.push(childNode)
    childNode.parent = this
  }

  //structure再帰的に子要素を追加する
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