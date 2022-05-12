<template>
  <div class="pt-1 px-4 pb-3">
    <v-checkbox
      dense
      hide-details
      v-model="includeDecendantFolders"
      color="primary"
      label="サブフォルダも含めて検索する"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      includeDecendantFolders:
        this.$config.renderer().search.query.includeDecendantFolders,
    }
  },
  watch: {
    includeDecendantFolders() {
      this.$config.set(
        "renderer.search.query.includeDecendantFolders",
        this.includeDecendantFolders
      )
    },
  },
}
</script>
