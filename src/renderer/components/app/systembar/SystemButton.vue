<template>
  <v-btn class="clickable" height="30" tile text :color="color">
    <v-icon small>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "SystemButton",

  props: {
    color: String,
    icon: String,
  },
}
</script>

<style scoped>
.clickable {
  user-select: none;
  -webkit-user-select: all;
  -webkit-app-region: no-drag;
}
</style>
