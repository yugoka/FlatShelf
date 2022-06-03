<template>
  <input
    class="input"
    ref="input"
    type="file"
    accept="image/jpeg, image/jpg, image/png, image/webp, "
    @change="onInput"
    multiple
  />
</template>

<script>
export default {
  methods: {
    activate() {
      this.$refs.input.click()
    },
    onInput() {
      const files = this.$refs.input.files
      const context = this.$store.state.viewContext
      const folderID = context.folder ? context.folder : 1

      this.$contents.create({
        files,
        folderID,
      })
    },
  },
}
</script>

<style scoped>
.input {
  display: none;
}
</style>
