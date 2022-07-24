<template>
  <v-btn 
    icon 
    large 
    @click="back" 
    fixed 
    class="mt-10" 
    :color="isSubDirectory ? 'primary' : null"
  >
    <v-icon>mdi-arrow-u-left-bottom</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    isSubDirectory: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    back() {
      this.$emit("click")
    },
  },
}
</script>

<style scoped>
</style>