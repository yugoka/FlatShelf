<template>
    <div class="content-row-container">
      <ContentCard
        v-for="content in contents"
        :key="content.contentID"
        :content="content"
      />
    </div>
</template>

<script>
import ContentCard from "./ContentCard.vue"

  export default {
    name: "ContentsRow",

    components: {
    ContentCard
},

    props: {
        contents: Array,
        colSize: Number
    },
    methods: {},
}
</script>

<style scoped>
.content-row-container {
  display: flex;
}
</style>