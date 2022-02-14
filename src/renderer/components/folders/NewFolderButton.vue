<template>
<v-tooltip 
  bottom
  open-delay="300"
>
  <template v-slot:activator="{ on, attrs }">
    <v-btn
      icon
      small
      :class="{
        'ms-auto': true,
        'button': true,
        'visible': visible
      }"
      @click="click"

      v-bind="attrs"
      v-on="on"
    >
      <v-icon small>mdi-plus</v-icon>
    </v-btn>
  </template>
  <span class="caption">フォルダを作成</span>
</v-tooltip>
</template>

<script>
export default {

  props: {
    visible: Boolean
  },

  methods: {
    click() {
      this.$emit("click")
    }
  }
}
</script>

<style scoped>
.button {
  opacity: 0;
}

.button.visible {
  opacity: 1;
}
</style>