const Store = require("electron-store")

//defaultsの読み込みを外部jsonにすることも検討
const defaults = {
  config: {
    //=======レンダラープロセス設定=======//
    renderer: {
      darkmode: false
    },

    //=======メインプロセス設定=======//
    main: {
      window: {
        size: [1200, 900],
        position: [360, 90]
      }
    }
  }
}

export const store = new Store({ defaults })
