<template>
  <div 
    class="scroller"
    ref="scroller"
  >
    <div 
      class="contents-wrapper"
      :style="{ height: this.containerHeight + 'px' }"
    >
      <ContentCard
        class="card"
        v-for="card in visibleCards"
        :key="card.content.contentID"
        :card="card"
      />
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import ContentCard from './components/ContentCard'
  import layoutManager from './layout-manager'

  export default {

    name:"SearchContents",

    components: {
      ContentCard
    },

    data() {
      return {
        itemSize: 100,
        buffer: 2000,
        contents: [],
        isActive: false,
        scrollerWidth: null,
        scrollerHeight: null,
        scrollTop: 0,
        layouts: null,
        visibleCards: []
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
    },

    methods: {
      //コンテンツを読み込む。すべての検索はここで行われる
      async loadContents() {
        const query = this.viewContext
        this.contents = await this.$contents.search(query)
        this.getLayouts()
      },

      //レイアウトを更新する
      getLayouts(calculateVisibleCards=true) {
        this.layouts = layoutManager.getLayouts("brick", this.contents, this.scrollerWidth, this.itemSize)
        if (calculateVisibleCards) this.getVisibleCards()
      },



      onResize: debounce(function() {
        if (!this.$refs.scroller) return
        const scrollerRect = this.$refs.scroller.getBoundingClientRect()
        this.scrollerWidth = scrollerRect.width
        this.scrollerHeight = scrollerRect.height
        if (this.layouts) {
          const scrollerHeightCache = this.layouts.containerHeight
          this.getLayouts(false)
          this.getVisibleCards(this.$refs.scroller.scrollTop * this.layouts.containerHeight / scrollerHeightCache)
        } else {
          this.getVisibleCards()
        }
      }, 50),

      onScroll: debounce(function() {
        this.scrollTop = this.$refs.scroller.scrollTop
        this.getVisibleCards()
      }, 30),

      getVisibleCards(scrollTop) {
        if (!this.layouts) return
        if (scrollTop) {
          this.$refs.scroller.scrollTop = scrollTop
          this.scrollTop = scrollTop
        }
        this.visibleCards = this.layouts.boxes.filter((box) => {
          return (
            this.scrollTop - this.buffer < box.top &&
            box.top < this.scrollTop + this.scrollerHeight + this.buffer
          )
        })
      }
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