<template>
  <v-toolbar
    class="filtermenu elevation-2"
    height="30"
    v-show="visible"
    rounded
  >
    <v-btn icon x-small @click="hide">
      <v-icon>mdi-menu-up</v-icon>
    </v-btn>

    <FilterMenuTagPicker :viewContext="viewContext" />
  </v-toolbar>
</template>

<script>
import FilterMenuTagPicker from "./FilterMenuTagPicker.vue"

export default {
  components: {
    FilterMenuTagPicker,
  },

  data() {
    return {}
  },

  computed: {
    visible() {
      return this.$store.state.isFilterMenuShown
    },
    viewContext() {
      return this.$store.state.viewContext
    },
  },

  methods: {
    hide() {
      this.$store.commit("toggleFilterMenu", false)
    },
  },
}
</script>

<style scoped></style>
