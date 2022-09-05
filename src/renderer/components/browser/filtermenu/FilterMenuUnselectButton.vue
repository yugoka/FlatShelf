<template>
  <v-slide-x-reverse-transition>
    <v-chip
      v-show="show"
      small
      label
      outlined
      ripple
      @click="click"
      color="info"
    >
      <v-icon small class="me-1">mdi-select-off</v-icon>
      選択を解除
    </v-chip>
  </v-slide-x-reverse-transition>
</template>

<script>
export default {
  props: {
    show: Boolean,
  },
  methods: {
    click() {
      this.$emit("click")
    },
  },
}
</script>
