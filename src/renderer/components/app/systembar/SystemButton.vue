<template>
    <v-btn
      height="30"
      tile
      text
      :color="color"
    >
      <v-icon>{{icon}}</v-icon>
    </v-btn>
</template>

<script>
  export default {
    name: 'SystemButton',

    props: {
      color: String,
      icon: String
    },
  }
</script>

<style>
</style>