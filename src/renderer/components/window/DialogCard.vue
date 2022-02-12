<template>
  <v-dialog
    v-model="visible"
    :persistent="persistent"
    scrollable
    :max-width="maxWidth"
  >
    <v-card>
      <slot/>
    </v-card>
  </v-dialog>
</template>

<script>
export default {

  name: "WindowRoot",

  props: {
    persistent: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: Number,
      default: 500
    },
  },

  data() {
    return {
      visible: false
    }
  },

  methods: {
    show() {
      this.visible = true
    }
  }
  

}
</script>

<style>

</style>