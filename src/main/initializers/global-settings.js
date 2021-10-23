const Store = require("electron-store")

const global_settings = new Store({ name: "global_config" })

if (!global_settings.has("config.workingSpace")) {
  const { app } = require("electron")
  global_settings.set("config.workingSpace", app.getPath("userData"))
}

export const WORKING_SPACE = global_settings.get("config.workingSpace")
