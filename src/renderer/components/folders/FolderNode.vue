<template>
  <div class="folder-node">
    <div 
      class="folder-node-click-observer"
      @click.stop="click"
      @contextmenu.stop="rightClick"
      @drop.stop="onDrop($event)"
      @dragover.prevent
      @dragenter.prevent
    />
    {{folder.name}}
  </div>
</template>

<script>
export default {
  props: {
    folder: Object
  },

  methods: {
    click() {
      this.$emit("click", this.folder)
    },

    rightClick() {
      this.$emit("contextmenu", this.folder)
    },

    onDrop(event) {
      this.$emit("drop", { event, dropFolder: this.folder })
    },
  }
}
</script>

<style scoped>
.folder-node {
  position: static;
}
.folder-node-click-observer {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>