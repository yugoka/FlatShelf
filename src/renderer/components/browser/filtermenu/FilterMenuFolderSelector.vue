<template>
  <div>
    <FolderSelector
      :folderID="folderID"
      @select="onSelect"
      @unselect="onUnselect"
      highlight
    />
  </div>
</template>

<script>
import FolderSelector from "../../folders/FolderSelector.vue"
export default {
  components: { FolderSelector },
  props: {
    folderID: Number,
  },
  methods: {
    onSelect(folder) {
      this.$store.commit("mergeContext", { folder: folder.id })
    },
    onUnselect() {
      this.$store.commit("mergeContext", { folder: null })
    },
  },
}
</script>
