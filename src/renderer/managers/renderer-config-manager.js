//------------------------------------
// 設定管理 for レンダラープロセス
//------------------------------------
import store from "../store"

class RendererConfigManager {
  constructor() {}

  //設定ロード処理
  //main.jsからVueの生成前に同期的に1度呼ばれる
  async initSettings() {
    const settings = await window.ipc.getAllSettings()
    store.commit("setConfig", settings)
  }

  async set(key, value) {
    const result = await window.ipc.setConfig(key, value)
    //保存に成功したらレンダラーにも反映する
    if (result) {
      //resultで帰ってきたsettingsでstateを上書きする
      store.commit("setConfig", result)

      //検索結果に関連する設定が変更された時、ViewContextにも同様の変更を反映する
      if (key.slice(0, 21) === "renderer.search.query") {
        this.mirrorSearchConfigToContext()
      }

    } else {
      console.log(`設定の保存に失敗しました：${key}:${value}`)
    }
  }

  //config.renderer.search.queryの内容をviewContext.configに反映する
  //要するに永続設定を検索クエリにミラーリングするよ
  mirrorSearchConfigToContext() {
    store.commit(
      "mergeContext", 
      { config: store.state.settings.renderer.search.query }
    )
  }

  renderer() {
    return store.state.settings.renderer
  }

  main() {
    return store.state.settings.main
  }
}

const configManager = new RendererConfigManager()

export default configManager
