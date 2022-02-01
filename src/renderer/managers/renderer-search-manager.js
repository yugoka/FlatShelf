//------------------------------------
// 検索コンテキスト管理 for レンダラープロセス
//------------------------------------
import store from "../store"
import router from "../router"

class RendererSearchManager {
  //検索コンテキストの変更
  mergeContext(context) {
    store.commit("mergeContext", context)
  }

  setContext(context) {
    store.commit("setContext", context)
  }

  reset() {
    store.commit("overwriteContext", { folders: [1] })
  }

  //コンテキストを変更して検索ページへ飛ぶ
  redirect(context = null) {
    //コンテンツの選択状態をリセット
    store.dispatch("endSelectMode")

    if (context) {
      this.setContext(context)
    }

    if (router.currentRoute.name != "Search") {
      router.push({ name: "Search" })
    }
  }
}

const searchManager = new RendererSearchManager()

export default searchManager
