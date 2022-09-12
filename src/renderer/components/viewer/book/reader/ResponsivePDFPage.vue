<template>
  <div ref="canvasWrapper" class="canvas-wrapper">
    <canvas ref="canvas" class="pdf-canvas" />
  </div>
</template>

<script>
import debounce from "lodash.throttle"

export default {
  props: {
    pageNum: Number,
    pdf: Object,
  },

  data() {
    return {
      currentPage: null,
      resizeObserver: null,
      renderContext: null,
    }
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
  },

  methods: {
    async getPage() {
      this.currentPage = await this.pdf.getPage(this.pageNum)
    },

    async renderPage() {
      await this.currentPage.render(this.renderContext)
    },

    async initPage() {
      //canvas本体のdom要素を取得
      const canvas = this.$refs.canvas
      const canvasWrapper = this.$refs.canvasWrapper

      //一度pdf自体の幅を取得し、親divの幅から表示スケールを計算
      const pdfWidth = this.currentPage.getViewport({ scale: 1 }).width
      const scale = canvasWrapper.clientWidth / pdfWidth
      const viewport = this.currentPage.getViewport({ scale })

      //高DPI環境をサポート
      const outputScale = window.devicePixelRatio || 1

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

    onResize: debounce(async function () {
      await this.initPage()
      await this.renderPage()
    }, 300),
  },

  async mounted() {
    await this.getPage()
    await this.initPage()
    this.resizeObserver = new ResizeObserver((entries) => {
      this.onResize()
    })

    this.resizeObserver.observe(this.$refs.canvasWrapper)
  },

  beforeDestroy() {
    const canvasWrapper = this.$refs.canvasWrapper
    this.resizeObserver.unobserve(canvasWrapper)
  },
}
</script>

<style scoped></style>
