<template>
  <TagPicker
    ref="picker"
    :viewContext="viewContext"
    :selectedTags="selectedTags"
    @update="onUpdate"
  />
</template>

<script>
import TagPicker from "../../tags/TagPicker.vue"
export default {
  props: {
    viewContext: Object,
  },

  components: { TagPicker },

  data() {
    return {
      selectedTags: [],
    }
  },

  watch: {
    async viewContext() {
      await this.syncWithViewContext()
    },
  },

  methods: {
    async syncWithViewContext() {
      if (Array.isArray(this.viewContext.tags)) {
        const selectedTags = await this.$tags.get({
          ids: this.viewContext.tags,
          idMode: true,
        })

        this.$refs.picker.setSelectedTags(selectedTags)
      } else {
        this.$refs.picker.setSelectedTags([])
      }
    },

    onUpdate(tags) {
      this.$store.commit("mergeContext", {
        tags: tags.map((tag) => tag.tagID),
      })
    },
  },

  async mounted() {
    await this.syncWithViewContext()
  },
}
</script>
