import store from "../../../store"

//サイドバーの幅調整関連をまとめたクラス
class SideBarDragger {
  constructor() {
    this.width = 250
    //マウスによって指定されたwidthがこれ以下ならサイドメニューを閉じる
    this.closeWidth = 50
    //サイドメニュー幅の最大、最小
    this.minWidth = 125
    this.maxWidth = 600
    this.dragBar = null
    this.sideMenu = null
  }

  //AppSideBar.vueから呼び出されるメソッドはこれのみ
  startDragging() {
    this.sideMenu = document.querySelector("#sidebar")
    this.dragBar =
      this.dragBar ||
      document.querySelector("#sidebar .v-navigation-drawer__border")

    //マウス移動を検知。重かったらdebounceで頻度調整も視野に入れておく
    document.addEventListener("mousemove", this.resize, false)
    //↑のイベントを削除
    document.addEventListener("mouseup", () => this.endDragging(), {
      once: true
    })

    //ドラッグ中はv-navigation-drawerのtransitionを無効化する
    this.sideMenu.classList.add("no-transition")
    this.dragBar.classList.add("dragging")
  }

  endDragging() {
    document.removeEventListener("mousemove", this.resize)
    //v-navigation-drawerのtransitionを元に戻す
    this.sideMenu.classList.remove("no-transition")
    this.dragBar.classList.remove("dragging")
  }

  resize(e) {
    const currentWidth = e.clientX + 3
    if (self.minWidth < currentWidth && currentWidth < self.maxWidth) {
      //ドラッグ幅がしきい値以内ならサイズ変更する
      self.width = currentWidth
    } else if (currentWidth < self.closeWidth) {
      //幅が一定以下なら閉じる
      self.width = 250
      self.endDragging()
      store.dispatch("toggleSideMenu", false)
    }
  }
}

export const sideBar = new SideBarDragger()
const self = sideBar
