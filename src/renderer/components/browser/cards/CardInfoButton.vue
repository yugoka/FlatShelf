<template>
  <v-btn absolute icon dark class="button" @click.stop="click">
    <v-icon>mdi-information</v-icon>
  </v-btn>
</template>

<script>
export default {
  data() {
    return {}
  },

  methods: {
    click() {},
  },
}
</script>

<style scoped>
.button {
  opacity: 0.65;
  top: 0px;
  right: 0px;
}
</style>
