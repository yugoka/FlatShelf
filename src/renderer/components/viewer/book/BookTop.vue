<template>
  <v-row class="booktop-wrapper mx-2">
    <v-col
      :cols="imageExists ? 3 : 12"
      :sm="imageExists ? 5 : 12"
      :md="imageExists ? 6 : 12"
      :lg="imageExists ? 7 : 12"
      class="buttons-wrapper"
    >
      <div class="text-center">
        <div class="my-3 text-h5">{{ folderName }}</div>

        <div class="mb-5 text-body-2" v-if="imageExists">
          {{ folderInfo.images.length }}ページ
        </div>

        <v-btn
          v-if="imageExists"
          @click="view"
          color="primary"
          class="text-subtitle-1"
          large
        >
          最初から読む
        </v-btn>
      </div>
    </v-col>

    <v-col cols="9" sm="7" md="6" lg="5" v-if="imageExists">
      <v-card @click="view" outlined>
        <v-img class="rounded" :src="topImage" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    folderInfo: Object,
    content: Object,
  },

  computed: {
    imageExists() {
      return (
        Array.isArray(this.folderInfo.images) && this.folderInfo.images.length
      )
    },

    topImage() {
      if (!this.imageExists) return null
      return `file://${this.folderInfo.images[0].dir}`
    },

    folderName() {
      if (!this.folderInfo.dir) return

      //ルートフォルダの場合
      if (this.folderInfo.dir === this.content.folderPath) {
        return this.content.name
      }

      const dir = this.folderInfo.dir.split("/")
      if (!dir.length) return
      return dir[dir.length - 1]
    },
  },

  methods: {
    view(page = 0) {
      this.$emit("view", page)
    },
  },
}
</script>

<style scoped>
.buttons-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100px;
}
</style>
