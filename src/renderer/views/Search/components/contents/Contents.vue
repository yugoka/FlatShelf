<template>
  <DynamicScroller
    :items="contentRows"
    :min-item-size="100"
    class="scroller"
    key-field="id"
    :buffer="1000"
    page-mode
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
        <ContentsRow 
          :contents="item"
        />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<script>
  import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
  import ContentsRow from './ContentsRow.vue'

  export default {

    name:"SearchContents",

    components: {
    DynamicScroller,
    DynamicScrollerItem,
    ContentsRow
},

    data() {
      return {
        contents: [],
        isActive: false,
        columns: 4
      }
    },

    methods: {

    },

    computed: {
      sideMenuWidth() {
        return this.$store.state.settings.renderer.app.sideMenuWidth
      },

      contentRows() {
        //行の数を計算
        const rowsNum = Math.ceil(this.contents.length / this.columns)
        const rows = []
        for (let i=0; i<rowsNum; i++) {
          rows.push(this.contents.slice(i*this.columns, (i+1)*this.columns))
          rows[i].id = i
        }
        return rows
      },
    },

    async mounted() {
      const query = { searchWord: "." }
      const result = await this.$contents.search(query)
      console.log(result)
      this.contents = result
    },

  }
</script>

<style scoped>
.content-row {
  width: 100%;
}
</style>