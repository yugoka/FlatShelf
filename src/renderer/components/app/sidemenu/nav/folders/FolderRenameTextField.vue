<template>
  <div ref="input">
    <v-text-field
      class="folder-rename-text-field"
      full-width
      @blur="endRenaming"
      @keydown.enter="endRenaming"
      v-model="inputValue"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: null
    }
  },
  methods: {
    endRenaming() {
      this.$emit("end", this.inputValue)
    }
  },
  mounted() {
    this.$nextTick(() => {
      const inputTextArea = this.$refs.input
      const inputForm = inputTextArea.querySelector('input:not([type=hidden]),textarea:not([type=hidden])')
      if (inputForm) {
        setTimeout(() => {
          inputForm.focus()
        }, 0)
      }
    })
  }
}
</script>


<style scoped>
.folder-rename-text-field {
  margin-top: 0px;
  padding-top: 0px;
  font-size: 14px;
  height: 16px;
}
</style>