<template>
<v-tooltip 
  bottom
  open-delay="300"
>
  <template v-slot:activator="{ on, attrs }">
    <v-btn
      icon
      small
      class="ms-auto folder-create-button"
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
  methods: {
    click() {
      this.$emit("click")
    }
  }
}
</script>

<style scoped>
#side-menu-folders-wrapper .folder-create-button {
  opacity: 0;
}
#side-menu-folders-wrapper:hover .folder-create-button {
  opacity: 1;
}
</style>