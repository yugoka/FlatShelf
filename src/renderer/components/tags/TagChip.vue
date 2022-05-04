<template>
  <v-chip
    :class="{
      'tag-chip me-1 mt-1 ps-3': true,
      'pe-1': !selectMode,
      'pe-3': selectMode,
    }"
    :small="size === 'small'"
    ripple
    @click.stop="click"
    :color="highlighted ? 'primary' : null"
  >
    <v-expand-x-transition>
      <v-icon v-if="highlighted" class="me-1" small> mdi-check-circle </v-icon>
    </v-expand-x-transition>

    <span>
      {{ customText ? customText : tag.name }}
    </span>

    <v-btn
      v-if="!selectMode"
      class="close-button"
      icon
      small
      @click.stop="clickDeleteButton"
    >
      <v-icon x-small> mdi-close </v-icon>
    </v-btn>
  </v-chip>
</template>

<script>
export default {
  name: "TagChip",

  props: {
    tag: Object,
    size: {
      type: String,
      default: "small",
    },
    selectMode: {
      type: Boolean,
      default: false,
    },
    selectedTags: {
      type: Array,
      default: () => [],
    },
    customText: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      selected: false,
    }
  },

  computed: {
    highlighted() {
      return this.selected && this.selectMode
    },
  },

  methods: {
    click() {
      this.$emit("click")
    },
    clickDeleteButton() {
      this.$emit("delete")
    },
    //タグが選択されているかどうかを確認する
    checkSelected() {
      this.selected = !!this.selectedTags.find(
        (tag) => tag.tagID === this.tag.tagID
      )
    },
  },

  watch: {
    selectedTags() {
      if (this.selectMode) {
        this.checkSelected()
      }
    },
  },

  created() {
    if (this.selectMode) {
      this.checkSelected()
    }
  },
}
</script>

<style scoped>
.tag-chip {
  display: inline-block;
  transition: width 1s !important;
}
</style>
