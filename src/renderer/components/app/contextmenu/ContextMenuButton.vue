<template>
  <v-btn text tile block small :ripple="false" :color="color" @click="click">
    <slot />
    <v-spacer />
  </v-btn>
</template>

<script>
export default {
  props: {
    color: String,
  },
  methods: {
    click() {
      this.$emit("click")
    },
  },
}
</script>
