<template>
  <div ref="canvasWrapper" class="canvas-wrapper" :class="pagePosition">
    <canvas ref="canvas" class="pdf-canvas" :class="pagePosition" />
  </div>
</template>

<script>
import debounce from "lodash.debounce"

export default {
  props: {
    pageNum: Number,
    pdf: Object,
    pagePosition: String,
  },

  data() {
    return {
      currentPage: null,
      resizeObserver: new ResizeObserver((entries) => {
        this.onResize()
      }),
      renderContext: null,
      //pdf.render()のタスク。複数のタスクが同時に起こらないようにする
      renderingTask: null,

      onResize: debounce(async function () {
        await this.initPage()
        await this.renderPage()
      }, 300),
    }
  },

  computed: {
    pageAspectRatio() {
      if (!this.currentPage) return null
      return this.currentPage.view[2] / this.currentPage.view[3]
    },
  },

  watch: {
    async pageNum() {
      if (this.renderContext) {
        await this.getPage()
        await this.renderPage()
      } else {
        await this.initPage()
      }
    },

    async pageAspectRatio() {
      this.initPage()
    },
  },

  methods: {
    async getPage() {
      this.currentPage = await this.pdf.getPage(this.pageNum)
    },

    async renderPage() {
      //既にレンダリングが実行中ならキャンセル
      if (this.renderingTask) {
        await this.renderingTask.cancel()
        this.renderingTask = null
      }

      this.renderingTask = this.currentPage.render(this.renderContext)
      this.renderingTask.promise.then = () => {
        this.renderingTask = null
      }
      await this.renderingTask.promise
    },

    initPage() {
      //canvas本体のdom要素を取得
      const canvas = this.$refs.canvas
      //高DPI環境をサポート
      const outputScale = window.devicePixelRatio || 1
      //ビューポートのサイズを計算＆取得
      const viewport = this.getViewPort()

      const context = canvas.getContext("2d")

      canvas.width = Math.floor(viewport.width * outputScale)
      canvas.height = Math.floor(viewport.height * outputScale)
      canvas.style.width = Math.floor(viewport.width) + "px"
      canvas.style.height = Math.floor(viewport.height) + "px"

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null

      this.renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport,
      }
    },

    getViewPort() {
      const wrapperWidth = this.$refs.canvasWrapper.clientWidth
      const wrapperHeight = this.$refs.canvasWrapper.clientHeight
      //一度pdf自体の幅を取得し、親divの幅から表示スケールを計算
      const scale = wrapperWidth / this.currentPage.view[2]
      const viewport = this.currentPage.getViewport({ scale })

      if (viewport.height <= wrapperHeight) {
        return viewport
        //画面サイズに収まらない場合
      } else {
        return this.currentPage.getViewport({
          scale: (scale * wrapperHeight) / viewport.height,
        })
      }
    },
  },

  async mounted() {
    await this.getPage()
    this.initPage()

    this.resizeObserver.observe(this.$refs.canvasWrapper)
  },

  beforeDestroy() {
    this.resizeObserver.unobserve(this.$refs.canvasWrapper)
  },
}
</script>

<style scoped>
.canvas-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.pdf-canvas {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

.pdf-canvas.right {
  margin: auto auto auto 0;
}

.pdf-canvas.left {
  margin: auto 0 auto auto;
}
</style>
