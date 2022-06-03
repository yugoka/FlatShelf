<template>
  <v-btn :fixed="type === 'fixed'" icon large @click="back" class="back-button">
    <v-icon>mdi-close</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "fixed",
    },
  },
  methods: {
    back() {
      this.$search.redirect()
    },
  },
}
</script>
