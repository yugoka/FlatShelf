<template>
  <v-btn
    icon
    large
    @click="click"
    fixed
    class="button"
    :color="editMode ? 'primary' : null"
  >
    <v-icon>mdi-pencil</v-icon>
  </v-btn>
</template>

<script>
export default {
  methods: {
    click() {
      this.$emit("click")
    },
  },

  computed: {
    editMode() {
      return this.$store.state.edit.editMode
    },
  },
}
</script>

<style scoped>
.button {
  margin-top: 80px;
}
</style>
