<template>
  <div 
    class="scroller"
    ref="scroller"
  >
    <div 
      class="contents-wrapper"
      :style="{height: this.containerHeight + 'px'}"
    >
      <ContentCard
        class="card"
        v-for="card in visibleCards"
        :key="card.index"
        :card="card"
      />
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import throttle from 'lodash.throttle'
  import justifiedLayout from 'justified-layout'
  import ContentCard from './components/ContentCard'

  export default {

    name:"SearchContents",

    components: {
      ContentCard
    },

    data() {
      return {
        itemSize: 100,
        buffer: 1000,
        contents: [],
        isActive: false,
        scrollerWidth: null,
        scrollTop: 0,
        layouts: null,
        visibleCards: [],
        visibleCardIndex: 0
      }
    },

    computed: {

      viewContext() {
        return this.$store.state.viewContext
      },

      containerHeight() {
        if (!this.layouts) return 0
        return this.layouts.containerHeight
      }
    },

    watch: {
      //検索条件が変わった時コンテンツをロードし直す
      viewContext: {
        async handler(){
          await this.loadContents()
        },
        deep: true
      },

      scrollTop(after, before) {
        const direction = (before <= after) ? 1 : -1
        this.updateVisibleCards(direction)
      }

    },

    methods: {
      //コンテンツを読み込む。すべての検索はここで行われる
      async loadContents() {
        const query = this.viewContext
        this.contents = await this.$contents.search(query)
        this.getLayouts()
      },

      //レイアウトを更新する
      getLayouts() {
        this.layouts =  justifiedLayout(
          this.getAspectRatios(),
          {
            containerWidth: this.scrollerWidth,
            boxSpacing: 3,
            targetRowHeight: this.itemSize,
            containerPadding: {
              top: 0,
              right: 12,
              left: 5,
              bottom: 0
            }
          }
        )
        //コンテンツをboxに紐付ける
        for (let i=0; i < this.layouts.boxes.length; i++) {
          this.layouts.boxes[i].content = this.contents[i]
          this.layouts.boxes[i].index = i
        }
        console.log(this.layouts)
        this.updateVisibleCards()
      },

      getAspectRatios() {
        const result = []
        for (let i=0; i < this.contents.length; i++) {
          result[i] = this.contents[i].thumbnailWidth / this.contents[i].thumbnailHeight
        }
        return result
      },

      //表示対象のカードを更新
      updateVisibleCards(direction=1) {
        if (!this.layouts) return
        const cards = this.layouts.boxes
        const result = []
        const searchStartIndex = (direction === 1)
          ? this.visibleCardIndex 
          : this.visibleCardIndex + this.visibleCards.length

        for (let i=searchStartIndex; 0<=i && i<cards.length; i+=direction) {
          if(this.checkVisible(cards[i])) {
            result[result.length] = cards[i]
          } else if (result.length) {
            break
          }
        }

        if (result.length) {
          this.visibleCardIndex = (direction === 1)
          ? result[0].index
          : result[result.length-1].index
        }
        
        this.visibleCards = result
      },

      checkVisible(card) {
        return this.scrollTop - this.buffer < card.top && card.top < this.scrollTop + 1000 + this.buffer
      },

      onResize: debounce(function() {
        if (!this.$refs.scroller) return
        this.scrollerWidth = this.$refs.scroller.getBoundingClientRect().width
        this.getLayouts()
      }, 50),

      onScroll: throttle(function() {
        this.scrollTop = this.$refs.scroller.scrollTop
      }, 100),
    },

    async created() {
      await this.loadContents()
    },

    mounted() {
      this.resizeObserver = new ResizeObserver(this.onResize)
        .observe(this.$refs.scroller)
      
      this.$refs.scroller.addEventListener('scroll', this.onScroll)
    },

    beforeDestroy () {
      if (this.resizeObserver) {
        this.resizeObserver.unobserve(this.$refs.scroller)
      }

      this.$refs.scroller.removeEventListener('scroll', this.onScroll)
    }

  }
</script>

<style scoped>
.scroller {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  position: relative;
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