const Store = require("electron-store")
const store = new Store()

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
