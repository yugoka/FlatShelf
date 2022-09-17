<template>
  <div
    v-if="allowLoad"
    :class="{
      'drag-ghost': true,
      visible: visible,
    }"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
    }"
  >
    <div class="drag-ghost-img-wrapper">
      <v-chip
        v-if="multipleSelect"
        x-small
        pill
        class="count-chip"
        color="primary"
      >
        {{ $store.state.edit.selectedIDs.length }}
      </v-chip>
      <img class="drag-ghost-img" :src="imgSrc" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      content: null,
      imgSrc: null,
      position: {
        x: -999,
        y: -999,
      },
      allowLoad: false,
    }
  },

  computed: {
    //複数選択の場合
    multipleSelect() {
      return (
        this.$store.state.edit.selectedIDs.length >= 2 &&
        this.$store.state.edit.selectedIDs.includes(this.content.contentID)
      )
    },
  },

  methods: {
    show(content) {
      this.content = content
      this.imgSrc = this.$contents.getThumbnail(this.content, "small")
      this.allowLoad = true
      document.addEventListener("drag", this.setMousePosition)
      setTimeout(() => (this.visible = true), 10)
    },

    hide() {
      this.visible = false
      this.allowLoad = false
      this.imgSrc = null
      this.position = {
        x: -999,
        y: -999,
      }
      document.removeEventListener("drag", this.setMousePosition)
    },

    setMousePosition(e) {
      if (e.clientX === 0 && e.clientY === 0) return
      this.position.x = e.clientX - 80
      this.position.y = e.clientY
    },
  },

  created() {
    this.setMousePosition = this.setMousePosition.bind(this)
  },

  beforeDestroy() {
    document.removeEventListener("drag", this.setMousePosition)
  },
}
</script>

<style scoped>
.drag-ghost {
  display: flex;
  pointer-events: none;
  width: 160px;
  height: 150px;
  justify-content: center;
  position: fixed;
  z-index: 100;
  opacity: 0;
  transition: opacity 0s;
}

.drag-ghost-img-wrapper {
  display: flex;
  position: relative;
  padding: 5px 10px;
}

.drag-ghost-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: top center;
}

.visible {
  opacity: 0.7;
}

.count-chip {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
