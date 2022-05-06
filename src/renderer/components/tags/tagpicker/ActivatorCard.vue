<template>
  <v-card outlined ripple class="card mx-2 pa-1">
    <TagChip v-for="tag in selectedTags" :key="tag.tagID" :tag="tag">
      {{ tag.name }}
    </TagChip>
  </v-card>
</template>

<script>
import TagChip from "../TagChip.vue"
export default {
  components: { TagChip },
  props: {
    selectedTags: Array,
  },
  computed: {
    isTagSelected() {
      return !!this.selectedTags.length
    },
  },
  methods: {
    unselect() {
      this.$emit("unselect")
    },
  },
}
</script>

<style scoped>
.card {
  height: 100px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
