//------------------------------------
// 検索コンテキスト管理 for レンダラープロセス
//------------------------------------
import store from "../store"
import router from "../router"

class RendererSearchManager {
  //検索コンテキストの変更
  set(context) {
    store.commit("setContext", context)
  }

  //コンテキストを変更して検索ページへ飛ぶ(再検索時も使用)
  redirect(context = null) {
    //コンテンツの選択状態をリセット
    this.resetSelectedItems()

    if (context) {
      this.set(context)
    }

    if (router.currentRoute.name != "Search") {
      router.push({ name: "Search" })
    }
  }

  resetSelectedItems() {
    store.commit("setSelectMode", false)
    store.commit("setSelectedItems", [])
    console.log(store.state)
  }
}

const searchManager = new RendererSearchManager()

export default searchManager
