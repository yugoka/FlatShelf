import store from "../../../../store"
import justifiedLayout from "justified-layout"

class LayoutManager {
  constructor() {
    this.contents = []
    this.layouts = []
    this.scrollerWidth = null
    this.itemSize = null
  }

  getLayouts(layoutName, contents, scrollerWidth, itemSize) {
    this.contents = contents
    this.scrollerWidth = scrollerWidth
    this.itemSize = itemSize

    this.layouts = this.brickLayout()

    for (let i = 0; i < this.layouts.boxes.length; i++) {
      this.layouts.boxes[i].content = this.contents[i]
      this.layouts.boxes[i].index = i
    }

    return this.layouts
  }

  brickLayout() {
    const settings = {
      containerWidth: this.scrollerWidth,
      boxSpacing: {
        horizontal: 3,
        vertical: 3,
      },
      targetRowHeight: this.itemSize,
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

    return justifiedLayout(this.getAspectRatios(), settings)
  }

  getAspectRatios() {
    const result = []
    for (let i = 0; i < this.contents.length; i++) {
      result[i] = this.contents[i].thumbnailAspectRatio
    }
    return result
  }
}

export default new LayoutManager()
