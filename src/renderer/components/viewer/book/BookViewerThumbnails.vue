<template>
  <div v-if="Array.isArray(images) && images.length">
    <div class="mb-2 text-h6">途中から読む</div>
    <v-row dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="2"
        v-for="image in images"
        :key="image.name"
      >
        <v-lazy>
          <v-card elevation="5" @click="showPage(image)">
            <img :src="`file://${image.dir}`" class="rounded card-img" />
            <div v-if="showImgName" class="text-center caption">
              {{ image.name }}
            </div>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    images: Array,
  },

  computed: {
    showImgName() {
      return this.$store.state.settings.renderer.viewer.book.showImgName
    },
  },

  methods: {
    showPage(image) {
      const index = this.images.findIndex((img) => img === image)
      if (index != -1) {
        this.$emit("view", index)
      }
    },
  },
}
</script>

<style scoped>
.card-img {
  object-fit: cover;
  width: 100%;
}
</style>
