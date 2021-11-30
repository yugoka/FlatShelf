<template>
  <v-card
    class="content-card mx-1 my-1 text-center elevation-2"
    ripple
    :style="{
      width: width,
      flexGrow: flexGrow, 
    }"
    v-show="showCard"
  >
    <v-responsive
      :aspect-ratio="flexGrow"
      v-show="!showImg"
      class="content-card-img-placeholder"
    />

    <v-img
      class="rounded"
      ripple
      eager

      :src="`file://${content.filePath}`"
      :transition="false"
      v-show="showImg"
      @load="showImg=true"
    />

    <v-card-text class="py-0 text-truncate">
      {{content.name}}
    </v-card-text>
  </v-card>
</template>

<script>


  export default {

    name:"ContentsThumbnail",

    props: {
      content: Object,
    },

    data() {
      return {
        width: "",
        flexGrow: 0,
        showCard: false,
        showImg: false
      }
    },

    methods: {
      loadImage(src) {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = (e) => reject(e)
          img.src = src
        })
      },

    },

    async created() {
      const res = await this.loadImage(this.content.filePath)
      this.flexGrow = res.width / res.height
      this.width = (res.width / res.height) + "px"
      this.showCard = true
    }

  }
</script>

<style scoped>
.content-card {
  min-width: 0;
}

.content-card-img-placeholder {
  background-color: #fafafa;
}
</style>