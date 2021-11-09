<template>
  <v-btn
    text
    tile
    block
    small
    :ripple="false"
    :color="color"
  >
    <slot/>
    <v-spacer/>
  </v-btn>
</template>

<script>

export default {
  props: {
    color: String
  }
}
</script>
