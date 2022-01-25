<template>
  <RecycleScroller
    :items="contentRows"
    class="scroller"
    key-field="id"
    :buffer="800"
    ref="scroller"
    @resize="setScrollerWidth"
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
        scrollerWidth: null,
        wrapperHeight: null
      }
    },

    computed: {
      selectMode() {
        return this.$store.state.isSelectMode
      },

      //コンテンツ表示の各行を準備する
      contentRows() {
        const rows = []
        let row = []
        let totalWithRatio = 0

        //行を作成
        for (let i=0; i<this.contents.length; i++) {
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

        //最後の行を追加。ここの処理きたない
        if (row.length) {
          rows.push(row)

          //高さが大きくなりすぎないようにダミーコンテンツを追加する
          while (totalWithRatio <= this.maxWidthRatio) {
            row.push({
              isDummy: true,
              contentID: "dummy-" + (row.length - 1)
            })
            totalWithRatio += 1
          }

          const currentRowNum = rows.length - 1
          rows[currentRowNum].id = currentRowNum
          rows[currentRowNum].size = this.getRowHeight(totalWithRatio, row.length)
        }
        return rows
      },

      viewContext() {
        return this.$store.state.viewContext
      },

      //各行が所有できる最大の横幅比率の合計
      maxWidthRatio() {
        return 10 / this.itemSize * this.scrollerWidth / 500
      },
    },

    watch: {
      //検索条件が変わった時コンテンツをロードし直す
      viewContext: {
        async handler(){
          await this.loadContents()
        },
        deep: true
      },

      wrapperHeight(afterHeight, beforeHeight) {
        console.log("aa")
        if (!beforeHeight) return
        const scroller = this.$refs.scroller.$el
        console.log(beforeHeight, afterHeight)
        console.log(afterHeight / beforeHeight)
        scroller.scrollTop = scroller.scrollTop * (afterHeight / beforeHeight)
      }
    },

    methods: {
      //コンテンツを読み込む。すべての検索はここで行われる
      async loadContents() {
        const query = this.viewContext
        this.contents = await this.$contents.search(query)
      },

      setScrollerWidth: debounce(function() {
        this.scrollerWidth = this.$refs.scroller.$el.clientWidth
        const itemWrapper = this.$refs.scroller.$el.getElementsByClassName("vue-recycle-scroller__item-wrapper")[0]
        this.wrapperHeight = itemWrapper.clientHeight
      }, 100),

      //各行の高さを算出する。かなりハードコーディングなので改善したい
      getRowHeight(totalWithRatio, contentNum) {
        //横マージンを考慮した場合に各画像が専有できる高さ
        const practicalWidth = this.scrollerWidth - (contentNum - 1) * 4 - 4
        return Math.ceil((practicalWidth / totalWithRatio) + 26)
      },
      
      //コンテンツIDから行の番号を取得する
      findContentRow(contentID) {
        for (let i=0; i < this.contentRows.length; i++) {
          if(this.contentRows[i].find(content => content.contentID === contentID)) {
            return i
          }
        }
      },

      scrollToRow(rowIndex) {
        const scroller = this.$refs.scroller
        scroller.scrollToItem(rowIndex)
      },

      scrollToContent(contentID) {
        const rowIndex = this.findContentRow(contentID)
        if (!rowIndex) return
        this.scrollToRow(rowIndex)
      },

      //現在表示中の行のうち最も上にあるものを取得する
      getCurrentRowPosition() {
        const rows = Array.from(this.$el.getElementsByClassName("vue-recycle-scroller__item-view"))
        const targetRow = rows.find(row => {
          const translateYPx = row.style.transform.match(/translateY\(([0-9]+px)/)
          if (!translateYPx) return
          const translateY = translateYPx[1].slice( 0, -2 )
          return translateY >= this.$el.scrollTop
        })
        return targetRow.getElementsByClassName("content-row-container")[0].dataset.rowIndex
      }

    },

    async created() {
      await this.loadContents()
    },

    mounted() {
      this.scrollerWidth = this.$refs.scroller.$el.clientWidth
    },

  }
</script>

<style scoped>
.scroller {
  height: calc(100vh - 32px);
}
.scroller::-webkit-scrollbar {
  overflow:visible;
  width: 8px;
}
.scroller::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,.3); 
  border-radius: 4px;
}
.content-row {
  width: 100%;
}
</style>