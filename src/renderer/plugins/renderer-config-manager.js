import store from "../store"
class RendererConfigManager {
  constructor() {}

  async getAllSettings() {
    const settings = await window.ipc.getRendererSettings()
    store.commit("setConfigAll", settings)
    return settings
  }
}

const configManager = new RendererConfigManager()

export default configManager
