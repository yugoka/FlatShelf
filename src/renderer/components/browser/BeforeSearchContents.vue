<template> 
  <div ref="prepend" class="pa-1">
    <BrowserFolders
      :width="width"
    />
  </div>
</template>

<script>
import debounce from "lodash.debounce"
import BrowserFolders from "./BrowserFolders.vue"

export default {
  components: { BrowserFolders },
  data() {
    return {
      width:0,
      height: 0
    }
  },
  methods: {
    onResize: debounce(function () {
        if (!this.$refs.prepend) return 
        this.width = this.$refs.prepend.offsetWidth
        this.height = this.$refs.prepend.offsetHeight
        this.$emit("resize", this.height)
    }, 50)
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(this.onResize)
      .observe(this.$refs.prepend)
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.$refs.prepend)
    }
  },
}
</script>