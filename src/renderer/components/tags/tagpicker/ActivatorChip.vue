<template>
  <v-chip class="picker px-1" small label outlined ripple>
    <v-icon
      small
      :color="isTagSelected ? 'primary' : null"
      class="mx-1 picker-icon"
      >mdi-tag{{ isTagSelected ? "" : "-outline" }}</v-icon
    >

    <div class="picker-tagchips-group">
      <v-chip
        v-for="tag in selectedTags"
        :key="tag.tagID"
        x-small
        class="picker-tagchips mx-1 px-2"
      >
        {{ tag.name }}
      </v-chip>
    </div>

    <v-btn
      v-if="isTagSelected"
      class="picker-icon"
      icon
      x-small
      @click.stop="unselect"
    >
      <v-icon small color="secondary">mdi-close</v-icon>
    </v-btn>

    <span v-show="!selectedTags.length" class="mx-1 caption"> タグを選択 </span>
  </v-chip>
</template>

<script>
export default {
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
