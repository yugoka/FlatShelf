<template>
  <DynamicScroller
    :items="contentRows"
    :min-item-size="100"
    class="scroller"
    key-field="id"
    :buffer="1000"
    page-mode
    ref="scroller"
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
  import ContentsRow from './components/ContentsRow.vue'

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
      //コンテンツを読み込む。すべての検索はここで行われる
      async loadContents() {
        const query = this.viewContext
        this.contents = await this.$contents.search(query)
      }
    },

    computed: {
      sideMenuWidth() {
        return this.$store.state.settings.renderer.app.sideMenuWidth
      },

      contentRows() {
        const rows = []
        let row = []
        let totalWithRatio = 0
        //行の数を計算
        for (let i=0; i<this.contents.length-1; i++) {
          const content = this.contents[i]
          row.push(content)
          totalWithRatio += content.thumbnailWidth / content.thumbnailHeight
          if (totalWithRatio > 10) {
            rows.push(row)
            rows[rows.length - 1].id = rows.length - 1
            totalWithRatio = 0
            row = []
          }
        }
        console.log(rows)
        return rows
      },

      viewContext() {
        return this.$store.state.viewContext
      }
    },

    watch: {
      //検索条件が変わった時コンテンツをロードし直す
      viewContext: {
        async handler(){
          await this.loadContents()
          console.log(window)
          window.scrollTo(0, 0)
        },
        deep: true
      }
    },

    async created() {
      await this.loadContents()
    },

  }
</script>

<style scoped>
.content-row {
  width: 100%;
}
</style>