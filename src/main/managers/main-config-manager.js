const Store = require("electron-store")
const store = new Store()
const { initConfig } = require("../initializers/init-config")

initConfig()

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
      return false
    }

    return true
  }
}

export const config = new ConfigManager()
