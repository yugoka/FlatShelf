<template>
  <DynamicScroller
    :items="contentColumns"
    :min-item-size="400"
    class="scroller"
    key-field="id"
    :buffer="300"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[
          //アイテムの高さに関わる変数
          item[0].filePath
        ]"
        :data-index="index"
      >
        <v-row
          no-gutters
        >
          <v-col
            :cols="cols"
            v-for="content in item"
            :key="content.contentID"
          >
            <v-card
              class="mx-1 my-1"
              ripple
              height="400"
            >
              <v-img
                height="300"
                :src="`file://${content.filePath}`"
                eager
              />
              {{content.name}}
            </v-card>
          </v-col>
        </v-row>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<script>
  import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

  export default {

    name:"SearchContents",

    components: {
      DynamicScroller,
      DynamicScrollerItem
    },

    data() {
      return {
        contents: [],
        isActive: false,
        rows: 6
      }
    },

    methods: {

    },

    computed: {
      sideMenuWidth() {
        return this.$store.state.settings.renderer.app.sideMenuWidth
      },

      contentColumns() {
        //行の数を計算
        const columnsNum = Math.ceil(this.contents.length / this.rows)
        console.log(columnsNum)
        const columns = []
        for (let i=0; i<columnsNum; i++) {
          columns.push(this.contents.slice(i*this.rows, (i+1)*this.rows))
          columns[i].id = i
        }
        console.log(columns)
        return columns
      },

      cols() {
        return 12 / this.rows
      }
    },

    async mounted() {
      const query = { searchWord: "jpg" }
      const result = await this.$contents.search(query)
      console.log(result)
      this.contents = result
    },

  }
</script>

<style scoped>
.scroller {
  height: 100%;
}
.content-row {
  width: 100%;
}
</style>