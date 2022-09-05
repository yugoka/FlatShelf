<template>
  <v-toolbar
    class="filtermenu elevation-2"
    height="30"
    v-show="visible"
    rounded
    ref="toolbar"
  >
    <v-slide-group show-arrows class="slider">
      <FilterMenuTagPicker
        class="me-2"
        :viewContext="viewContext"
        v-if="visible"
      />
      <FilterMenuFolderSelector
        class="me-2"
        :folderID="viewContext.folder"
        v-if="visible"
      />

      <v-spacer />

      <FilterMenuUnselectButton @click="unselectContents" :show="editMode" />
    </v-slide-group>
  </v-toolbar>
</template>

<script>
import FilterMenuFolderSelector from "./FilterMenuFolderSelector.vue"
import FilterMenuTagPicker from "./FilterMenuTagPicker.vue"
import FilterMenuUnselectButton from "./FilterMenuUnselectButton.vue"

export default {
  components: {
    FilterMenuTagPicker,
    FilterMenuFolderSelector,
    FilterMenuUnselectButton,
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
    editMode() {
      return this.$store.state.edit.editMode
    },
  },

  methods: {
    hide() {
      this.$store.commit("toggleFilterMenu", false)
    },

    unselectContents() {
      this.$store.dispatch("endEditMode")
    },
  },
}
</script>

<style scoped>
.slider {
  width: 100%;
}
</style>
