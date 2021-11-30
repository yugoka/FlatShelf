<template>
  <v-card
    class="card mx-1 my-1"
    ripple
    :style="{
      width: width,
      flexGrow: flexGrow, 
    }"
  >
      <v-img
        :src="`file://${content.filePath}`"
        eager
      />
      aaa
  </v-card>
</template>

<script>

  export default {

    name:"ContentsThumbnail",

    props: {
      content: Object
    },

    data() {
      return {
        width: "",
        flexGrow: 0
      }
    },

    methods:{
    loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
        img.src = src
      })
    },
    },

    async mounted() {
      const res = await this.loadImage(this.content.filePath)
      this.flexGrow = res.width/res.height
      this.width = (res.width/res.height) + 'px'
    }

  }
</script>

<style scoped>
.card {
  min-width: 0;
}
</style>