<template>
  <v-btn fixed icon large @click="back" class="back-button">
    <v-icon>mdi-close</v-icon>
  </v-btn>
</template>

<script>
export default {
  methods: {
    back() {
      this.$search.redirect()
    },
  },
}
</script>
