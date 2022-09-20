const Store = require("electron-store")
const path = require("path")
const global_settings = new Store({ name: "global_config" })

if (!global_settings.has("config.workingSpace")) {
  const { app } = require("electron")
  global_settings.set(
    "config.workingSpace",
    path.join(app.getPath("pictures"), "flatshelf")
  )
}

const getWorkingSpace = () => {
  if (process.env.NODE_ENV === "production") {
    return global_settings.get("config.workingSpace")
  } else {
    if (global_settings.has("config.devWorkingSpace")) {
      return global_settings.get("config.devWorkingSpace")
    } else {
      return global_settings.get("config.workingSpace")
    }
  }
}

export const WORKING_SPACE = getWorkingSpace()
