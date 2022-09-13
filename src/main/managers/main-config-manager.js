const { store } = require("../initializers/init-config")
const { set } = require("lodash")

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

      return set({}, key, value)
    } catch (error) {
      console.error(`設定の変更に失敗しました：${error}`)
      return false
    }
  }
}

export const config = new ConfigManager()
