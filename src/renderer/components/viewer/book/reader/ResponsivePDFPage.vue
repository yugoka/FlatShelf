<template>
  <div ref="canvasWrapper" class="canvas-wrapper">
    <canvas ref="canvas" class="pdf-canvas" />
  </div>
</template>

<script>
import debounce from "lodash.throttle"
import * as pdfjs from "pdfjs-dist"
pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry")

export default {
  data() {
    return {
      pdf: "C:/Users/watas/Downloads/a.pdf",
      pageNum: 1,
      page: null,
      resizeObserver: null,
    }
  },

  methods: {
    async getPage() {
      const pdf = await pdfjs.getDocument({
        url: this.pdf,
      }).promise

      this.page = await pdf.getPage(this.pageNum)
    },

    async renderPage() {
      //canvas本体のdom要素を取得
      const canvas = this.$refs.canvas
      const canvasWrapper = this.$refs.canvasWrapper

      //一度pdf自体の幅を取得し、親divの幅から表示スケールを計算
      const pdfWidth = this.page.getViewport({ scale: 1 }).width
      const scale = canvasWrapper.clientWidth / pdfWidth
      const viewport = this.page.getViewport({ scale })

      //高DPI環境をサポート
      const outputScale = window.devicePixelRatio || 1

      const context = canvas.getContext("2d")
      canvas.width = Math.floor(viewport.width * outputScale)
      canvas.height = Math.floor(viewport.height * outputScale)
      canvas.style.width = Math.floor(viewport.width) + "px"
      canvas.style.height = Math.floor(viewport.height) + "px"

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport,
      }
      await this.page.render(renderContext)
    },

    onResize: debounce(async function () {
      await this.renderPage()
    }, 300),
  },

  async mounted() {
    const canvasWrapper = this.$refs.canvasWrapper
    await this.getPage()
    await this.renderPage()
    this.resizeObserver = new ResizeObserver((entries) => {
      this.onResize()
    })

    this.resizeObserver.observe(canvasWrapper)
  },

  beforeDestroy() {
    const canvasWrapper = this.$refs.canvasWrapper
    this.resizeObserver.unobserve(canvasWrapper)
  },
}
</script>

<style scoped></style>
