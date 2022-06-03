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
    } else {
      console.log(`設定の保存に失敗しました：${key}:${value}`)
    }
  }

  get(key) {
    const keyParse = key.split(".")
    try {
      let target = store.state.settings
      for (const key of keyParse) {
        target = target[key]
      }
      return target
    } catch (err) {
      console.error(`設定取得に失敗しました: ${err}`)
      return null
    }
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
