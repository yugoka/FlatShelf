<template>
  <div class="fill-height">
    <BookReaderSpread
      v-if="viewMode === 'spread'"
      :folderInfo="folderInfo"
      @back="back"
    />
  </div>
</template>

<script>
import BookReaderSpread from "./BookReaderSpread.vue"
export default {
  components: { BookReaderSpread },
  data() {
    return {
      viewMode: "spread",
    }
  },

  props: {
    folderInfo: Object,
  },

  methods: {
    back() {
      this.$emit("back")
    },
  },
}
</script>
