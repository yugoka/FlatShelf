//------------------------------------
// サイドバー幅調整関連処理
//------------------------------------

import store from "../../store"
import config from "../../managers/renderer-config-manager"
import debounce from "lodash.debounce"

export class SideMenuDragger {
  constructor({
    menuName = "sideMenu",
    menuID = "#sidemenu",
    defaultWidth = 250,
    minWidth = 125,
    maxWidth = 600,
    right = false,
  } = {}) {
    this.menuName = menuName
    this.width = defaultWidth
    //マウスによって指定されたwidthがこれ以下ならサイドメニューを閉じる
    this.closeWidth = 50
    //サイドメニュー幅の最大、最小
    this.minWidth = minWidth
    this.maxWidth = maxWidth
    this.right = right

    this.targetMenu = document.querySelector(menuID)
    this.dragBar = document.querySelector(
      `${menuID} .v-navigation-drawer__border`
    )

    //EventLister内でresize()が正常にthisを指定できるように変更
    this.resize = this.resize.bind(this)

    this.saveConfigWidth = debounce(this.saveConfigWidth, 500)
  }

  //AppSideBar.vueから呼び出されるメソッドはこれのみ
  startDragging() {
    //マウス移動を検知。重かったらdebounceで頻度調整も視野に入れておく
    document.addEventListener("mousemove", this.resize, false)
    //↑のイベントを削除
    document.addEventListener("mouseup", () => this.endDragging(), {
      once: true,
    })

    //ドラッグ中はv-navigation-drawerのtransitionを無効化する
    this.targetMenu.classList.add("no-transition")
    this.dragBar.classList.add("dragging")
  }

  endDragging() {
    document.removeEventListener("mousemove", this.resize, false)
    //v-navigation-drawerのtransitionを元に戻す
    this.targetMenu.classList.remove("no-transition")
    this.dragBar.classList.remove("dragging")
  }

  resize(e) {
    const currentWidth = this.right
      ? window.innerWidth - e.clientX - 3
      : e.clientX + 3
    if (this.minWidth < currentWidth && currentWidth < this.maxWidth) {
      //ドラッグ幅がしきい値以内ならサイズ変更する
      this.width = currentWidth
      //幅をstoreとconfigに保存する
      this.saveConfigWidth(currentWidth)
    } else if (currentWidth < this.closeWidth) {
      //幅が一定以下なら閉じる
      this.width = 250
      this.endDragging()
      if (this.menuName === "sideMenu") {
        store.dispatch("toggleSideMenu", false)
      } else if (this.menuName === "editMenu") {
        store.dispatch("endEditMode")
      }
    }
  }

  saveConfigWidth(width) {
    config.set(`renderer.app.${this.menuName}Width`, width)
  }
}
