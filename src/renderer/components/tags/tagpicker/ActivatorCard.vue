<template>
  <v-card outlined ripple class="card mx-2 pa-1">
    <TagChip
      v-for="tag in selectedTags"
      :key="tag.tagID"
      :tag="tag"
      @delete="toggleTag(tag)"
    >
      {{ tag.name }}
    </TagChip>

    <div v-if="!isTagSelected" class="body-2 no-tag-message">
      <div>
        <v-icon small>mdi-cursor-default-click-outline</v-icon>
        タグを選択
      </div>
    </div>
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
    toggleTag(tag) {
      this.$emit("toggleTag", tag)
    },
  },
}
</script>

<style scoped>
.card {
  height: 100px;
  overflow-y: scroll;
  overflow-x: hidden;
  cursor: pointer;
}
.no-tag-message {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>
