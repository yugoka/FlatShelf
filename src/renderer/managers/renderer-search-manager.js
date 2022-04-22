//------------------------------------
// 検索コンテキスト管理 for レンダラープロセス
//------------------------------------
import store from "../store"
import router from "../router"
import config from "./renderer-config-manager"

class RendererSearchManager {
  //検索の実行
  async execute(query) {
    const result = await window.ipc.searchContent(query)
    return result
  }

  //検索コンテキストの変更
  mergeContext(context) {
    store.commit("mergeContext", context)
  }

  setContext(context) {
    store.commit("setContext", context)
  }

  reset() {
    store.commit("overwriteContext", { folder: 1 })
  }

  //コンテキストを変更して検索ページへ飛ぶ
  redirect(context = null) {
    //コンテンツの選択状態をリセット
    store.dispatch("endEditMode")

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
