import store from "../../../store"
import justifiedLayout from "justified-layout"

class LayoutManager {
  getLayouts(data) {
    const settings = {
      containerWidth: data.scrollerWidth,
      boxSpacing: {
        horizontal: 3,
        vertical: 3,
      },
      targetRowHeight: data.itemSize,
      containerPadding: {
        top: 0,
        right: 12,
        left: 5,
        bottom: 0,
      },
    }

    if (store.state.settings.renderer.search.showItemName) {
      settings.boxSpacing.vertical = 30
    }

    const layouts = this.switchLayouts(data, settings)

    for (let i = 0; i < layouts.boxes.length; i++) {
      layouts.boxes[i].content = data.contents[i]
      layouts.boxes[i].index = i
    }

    return layouts
  }

  switchLayouts(data, settings) {
    if (data.layoutName === "brick") {
      return this.getBrickLayout(data, settings)
    } else {
      return this.getGridLayout(data, settings)
    }
  }

  getBrickLayout(data, settings) {
    return justifiedLayout(this.getAspectRatios(data.contents), settings)
  }

  getGridLayout(data, settings) {
    return justifiedLayout(this.getAspectRatios(data.contents), {
      ...settings,
      forceAspectRatio: 1,
    })
  }

  getAspectRatios(contents) {
    const result = []
    for (let i = 0; i < contents.length; i++) {
      result[i] = contents[i].thumbnailAspectRatio
    }
    return result
  }
}

export default new LayoutManager()
