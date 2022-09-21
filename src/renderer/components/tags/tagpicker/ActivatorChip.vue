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

    <span v-show="!selectedTags.length" class="me-1 caption"> タグ </span>
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

<style scoped>
.picker {
  display: flex;
  max-width: 250px;
  cursor: pointer;
}
.picker-icon {
  flex-shrink: 0;
}
.picker-tagchips {
  pointer-events: none;
}
.picker-tagchips-group {
  flex-shrink: 1;
  overflow-x: scroll;
}
.picker-tagchips-group::-webkit-scrollbar {
  display: none;
}
</style>
