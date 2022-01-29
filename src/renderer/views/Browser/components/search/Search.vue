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
        :key="card.content.contentID"
        :card="card"
      />
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
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
      }
    },

    computed: {
      selectMode() {
        return this.$store.state.isSelectMode
      },

      viewContext() {
        return this.$store.state.viewContext
      },

      visibleCards() {
        if (!this.layouts) return []
        return this.layouts.boxes.reduce((array, value, index) => {
          if(this.scrollTop - this.buffer < value.top && value.top < this.scrollTop + 1000 + this.buffer) {
            const card = value
            card.content = this.contents[index]
            array.push(card)
          }
          return array
        }, [])
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
      getLayouts() {
        this.layouts =  justifiedLayout(
          this.contents.map(data => data.thumbnailWidth / (data.thumbnailHeight)),
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
        console.log(this.layouts)
      },

      onResize: debounce(function() {
        if (!this.$refs.scroller) return
        this.scrollerWidth = this.$refs.scroller.getBoundingClientRect().width
        this.getLayouts()
      }, 50),

      onScroll: debounce(function() {
        this.scrollTop = this.$refs.scroller.scrollTop
        console.log("stop")
      }, 20),
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