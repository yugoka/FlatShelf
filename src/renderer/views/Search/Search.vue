<template>
  <div class="main-browser-wrapper">
    <BrowserFileDropArea/>
    <SearchContents/>
  </div>
</template>

<script>
  import BrowserFileDropArea from "./components/BrowserFileDropArea"
  import SearchContents from "./components/contents/Contents"

  export default {

    name:"Search",

    components: {
      BrowserFileDropArea,
      SearchContents
    },

    data() {

      return {
      }
    },


  }

</script>

<style scoped>
</style>