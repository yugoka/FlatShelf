<template>
  <RecycleScroller
    :items="contentRows"
    class="scroller"
    key-field="id"
    :buffer="1000"
    page-mode
    ref="scroller"
    @resize="getScrollerWidth"
  >
    <template v-slot="{ item }">
      <ContentsRow 
        :contents="item"
      />
    </template>
  </RecycleScroller>
</template>

<script>
  import debounce from 'lodash.debounce'
  import { RecycleScroller } from 'vue-virtual-scroller'
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
  import ContentsRow from './components/ContentsRow.vue'

  export default {

    name:"SearchContents",

    components: {
      RecycleScroller,
      ContentsRow
    },

    data() {
      return {
        contents: [],
        isActive: false,
        itemSize: 3,
        scrollerWidth: 500
      }
    },

    methods: {
      //コンテンツを読み込む。すべての検索はここで行われる
      async loadContents() {
        const query = this.viewContext
        this.contents = await this.$contents.search(query)
      },
      
      //スクローラーの幅を取得
      getScrollerWidth: debounce(function() {
        this.scrollerWidth = this.$refs.scroller.$el.clientWidth
      }, 200),

      //各行の高さを算出する。かなりハードコーディングなので改善したい
      getRowHeight(totalWithRatio, contentNum) {
        //横マージンを考慮した場合に各画像が専有できる高さ
        const practicalWidth = this.scrollerWidth - (contentNum - 1) * 4 - 4
        return (practicalWidth / totalWithRatio) + 26
      }
    },

    computed: {

      //コンテンツ表示の各行を準備する
      contentRows() {
        const rows = []
        let row = []
        let totalWithRatio = 0
        //行の数を計算
        for (let i=0; i<this.contents.length-1; i++) {
          const content = this.contents[i]
          row.push(content)
          totalWithRatio += content.thumbnailWidth / content.thumbnailHeight
          if (totalWithRatio > this.maxWidthRatio) {
            rows.push(row)

            const currentRowNum = rows.length - 1
            rows[currentRowNum].id = currentRowNum
            rows[currentRowNum].size = this.getRowHeight(totalWithRatio, row.length)
            totalWithRatio = 0
            row = []
          }
        }
        console.log(rows)
        return rows
      },

      viewContext() {
        return this.$store.state.viewContext
      },

      maxWidthRatio() {
        return 10 / this.itemSize
      }
    },

    watch: {
      //検索条件が変わった時コンテンツをロードし直す
      viewContext: {
        async handler(){
          await this.loadContents()
        },
        deep: true
      }
    },

    async created() {
      await this.loadContents()
    },

    mounted() {
      this.getScrollerWidth()
    }

  }
</script>

<style scoped>
.content-row {
  width: 100%;
}
</style>