<template>
  <v-icon :small="small" class="icon" :class="{ rotate: up }">
    {{ icon }}
  </v-icon>
</template>

<script>
export default {
  props: {
    up: Boolean,
    small: Boolean,
    icon: {
      type: String,
      default: "mdi-chevron-down",
    },
  },
}
</script>

<style scoped>
.icon {
  transition: transform 0.2s ease-in-out !important;
}

.icon.rotate {
  transform: rotate(-180deg);
}
</style>
