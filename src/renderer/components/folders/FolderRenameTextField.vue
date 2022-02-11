<template>
  <div ref="input">
    <v-text-field
      primary
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
  props: {
    currentName: String
  },
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
  //リネーム開始時に呼ばれる
  mounted() {
    this.$nextTick(() => {
      this.inputValue = this.currentName
      const inputTextArea = this.$refs.input
      const inputForm = inputTextArea.querySelector('input:not([type=hidden]),textarea:not([type=hidden])')
      if (inputForm) {
        setTimeout(() => {
          inputForm.focus()
          inputForm.select()
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