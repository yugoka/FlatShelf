<template>
  <v-btn icon large @click="back" fixed :color="highlight ? 'primary' : null">
    <v-icon>mdi-arrow-u-left-bottom</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    highlight: {
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

<style scoped></style>
