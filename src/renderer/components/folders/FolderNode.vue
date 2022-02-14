<template>
  <div class="folder-node">
    <div 
      :class="{
        'folder-node-click-observer': true,
        highlighted: highlighted
      }"
      @click.stop="click"
      @contextmenu.stop="rightClick"
      @drop.stop="onDrop($event)"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    />
      {{folder.name}}
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'

  export default {
    props: {
      folder: Object
    },

    data() {
      return {
        highlighted: false
      }
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

      onDragOver() {
        this.unHighlight()
        this.highlighted = true
      },

      onDragLeave() {
        this.highlighted = false
      },

      unHighlight: debounce(function() {
        this.highlighted = false
      }, 100)
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

.folder-node-click-observer.highlighted {
  background-color: rgba(33, 150, 243, .1)
}
</style>