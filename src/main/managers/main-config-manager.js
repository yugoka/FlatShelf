const { store } = require("../initializers/init-config")

//------------------------------------
// configの読み込み/書き込み for メインプロセス
//------------------------------------
class ConfigManager {
  getAll() {
    return store.get(`config`)
  }
  get(key) {
    return store.get(`config.${key}`)
  }
  set(key, value) {
    try {
      store.set(`config.${key}`, value)
    } catch (error) {
      console.log(`設定の変更に失敗しました：${error}`)
      return false
    }
    return true
  }
}

export const config = new ConfigManager()
