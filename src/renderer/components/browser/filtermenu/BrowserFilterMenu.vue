<template>
  <v-toolbar
    class="filtermenu elevation-2"
    height="30"
    v-show="visible"
    rounded
  >
    <v-btn
      icon
      x-small
      @click="hide"
    >
      <v-icon>mdi-menu-up</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>

export default {
  data() {
    return {
      
    }
  },

  computed: {
    visible() {
      return this.$store.state.isFilterMenuShown
    }
  },

  methods: {
    hide() {
      this.$store.commit("toggleFilterMenu", false)
    }
  }
}

</script>

<style scoped>
</style>