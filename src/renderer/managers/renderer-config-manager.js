import store from "../store"

class RendererConfigManager {
  constructor() {}

  async initSettings() {
    const settings = await window.ipc.getAllSettings()
    store.commit("setConfigAll", settings)
  }

  //設定を変更する。変更するためには事前に値が設定されている必要があるため注意
  async set(key, value) {
    const result_ok = await window.ipc.setConfig(key, value)
    //保存に成功したらレンダラーにも反映する
    if (result_ok) {
      //設定をすべて持ってくる。若干非効率かも
      this.initSettings()
    } else {
      console.log(`設定の保存に失敗しました：${key}:${value}`)
    }
  }
}

const configManager = new RendererConfigManager()

export default configManager
