<template>
  <v-col cols="6" sm="4" md="3" lg="2">
    <v-card class="folder-card text-center" @click="onClick">
      <div>
        <v-img
          v-if="folder.firstImage"
          :src="`file://${folder.firstImage.dir}`"
          class="rounded folder-img"
        />
        <v-icon x-large v-else class="card-img">mdi-folder</v-icon>
      </div>
      <div class="caption mx-1">
        <v-icon color="info" small class="card-icon">
          {{ isImageCollection ? "mdi-book-open-variant" : "mdi-folder" }}
        </v-icon>
        {{ folder.name }}
      </div>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: {
    folder: Object,
  },

  computed: {
    //対象のフォルダの中身が画像の集合であるかどうか
    isImageCollection() {
      return (
        this.folder.imagesCount &&
        !this.folder.foldersCount &&
        !this.folder.pdfCount
      )
    },
  },

  methods: {
    onClick() {
      this.$emit("click")
    },
  },
}
</script>

<style scoped>
.card-icon {
  padding-bottom: 1px;
}
</style>
