<template>
<v-row
  no-gutters
  v-masonry
  class="mx-1 my-1"
>
    <v-col
      v-for="content in contents"
      :key="content.dataValues.contentID"
      cols="12"
      sm="6"
      md="4"
      lg="3"
      v-masonry-tile
      min-height="300"
    >
      <v-card class="mx-1 my-1">
        <v-img
        :src="`file://${content.dataValues.filePath}`"
        @load="redrawMasonry"
        />
        説明だよん
      </v-card>
    </v-col>
</v-row>
</template>

<script>
  import throttle from 'lodash/throttle'

  export default {

    name:"SearchContents",

    data() {
      return {
        contents: [],
        isActive: false
      }
    },

    methods: {
      redrawMasonry: throttle(function() {
        console.log("loaded")
        this.$redrawVueMasonry()
      }, 100)
    },

    computed: {
      sideMenuWidth() {
        return this.$store.state.settings.renderer.app.sideMenuWidth
      }
    },

    watch: {
      sideMenuWidth() {
        this.redrawMasonry()
      }
    },

    async mounted() {
      const query = { searchWord: "jpg" }
      const result = await this.$contents.search(query)
      this.contents = result
      //vue masonryの位置をリセット
      this.$nextTick(() => this.redrawMasonry())
    },

  }
</script>