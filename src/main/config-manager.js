const Store = require("electron-store")
const store = new Store()

export const config = {
  //メインプロセス
  main: {
    get(key) {
      return store.get(`main.${key}`)
    },
    set(key, value) {
      store.set(`main.${key}`, value)
    }
  },

  //レンダラープロセス
  renderer: {
    get(key) {
      return store.get(`renderer.${key}`)
    },
    set(key, value) {
      store.set(`renderer.${key}`, value)
    },
    getAll() {
      return store.get("renderer")
    }
  }
}
