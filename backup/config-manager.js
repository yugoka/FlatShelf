const Store = require("electron-store")
const store = new Store()
//const { ipcMain } = require("electron")

const ConfigManager = class {
  constructor() {}

  //このget, setは外部用なので注意。内部処理はstore.get/setを使おう
  get(key) {
    return store.get(key)
  }
  set(key, value) {
    store.set(key, value)
  }
  getMain(key) {
    return store.get(`main.${key}`)
  }
  setMain(key, value) {
    store.set(`main.${key}`, value)
  }
  getRenderer(key) {
    return store.get(`renderer.${key}`)
  }
  setRenderer(key, value) {
    store.set(`renderer.${key}`, value)
  }

  getRendererSettings() {
    return store.get("renderer")
  }
}

export const config = new ConfigManager()
