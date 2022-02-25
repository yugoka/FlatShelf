<template> 
  <div ref="prepend" class="pa-1">
    <BrowserFolders/>
  </div>
</template>

<script>
import throttle from "lodash.throttle"
import BrowserFolders from "./BrowserFolders.vue"

export default {
  components: { BrowserFolders },
  data() {
    return {}
  },
  methods: {
    onResize: throttle(function () {
        if (!this.$refs.prepend) return 
        this.$emit("resize", this.$refs.prepend.offsetHeight)
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