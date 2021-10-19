const { screen } = require("electron")

export const getWindowCenterPosition = DEFAULT_SIZE => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const x = Math.floor((width - DEFAULT_SIZE.width) / 2)
  const y = Math.floor((height - DEFAULT_SIZE.height) / 2)
  return [x, y]
}
