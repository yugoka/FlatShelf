<template>
  <div 
    class="scroller"
    ref="scroller"
  >

    <SearchContextMenu
      ref="contextMenu"
    />

    <div 
      class="contents-wrapper"
      :style="{ height: this.containerHeight + 'px' }"
    >
      <ContentCard
        class="card"
        v-for="card in visibleCards"
        :key="card.content.contentID"
        :card="card"
        @contextMenu="openContextMenu($event)"
      />
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import ContentCard from './cards/ContentCard'
  import SearchContextMenu from './SearchContextMenu'
  import layoutManager from './scripts/layout-manager'

  export default {

    name:"SearchContents",

    components: {
      ContentCard,
      SearchContextMenu
    },

    data() {
      return {
        buffer: 2000,
        contents: [],
        isActive: false,
        scrollerWidth: null,
        scrollerHeight: null,
        contentsHeight: null,
        scrollTop: 0,
        layouts: null,
        visibleCards: []
      }
    },

    computed: {
      itemSize() {
        return this.$store.state.settings.renderer.search.itemSize
      },

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

      itemSize() {
        this.getLayouts()
      },


      //コンテンツ合計の高さが変化した時スクロール位置を保持する
      contentsHeight(after, before) {
        if (before <= 0) return
        this.scrollTop = this.scrollTop * after / before
        this.$nextTick(() => {
          this.$refs.scroller.scrollTop = this.scrollTop
        })
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
        this.layouts = layoutManager.getLayouts("brick", this.contents, this.scrollerWidth, this.itemSize)
        this.contentsHeight = this.layouts.containerHeight
        this.$nextTick(() => {
          this.getVisibleCards()
        })
      },



      onResize: debounce(function() {
        if (!this.$refs.scroller) return
        const scrollerRect = this.$refs.scroller.getBoundingClientRect()
        this.scrollerWidth = scrollerRect.width
        this.scrollerHeight = scrollerRect.height
        this.getLayouts(!!this.layouts.boxes.length)
      }, 50),

      onScroll: debounce(function() {
        this.scrollTop = this.$refs.scroller.scrollTop
        this.getVisibleCards()
      }, 30),

      getVisibleCards() {
        if (!this.layouts) return

        this.visibleCards = this.layouts.boxes.filter((box) => {
          return (
            this.scrollTop - this.buffer < box.top &&
            box.top < this.scrollTop + this.scrollerHeight + this.buffer
          )
        })
      },

      openContextMenu(contentID) {
        this.$refs.contextMenu.show(contentID)
      }
    },

    async created() {
      await this.loadContents()
    },

    mounted() {
      this.resizeObserver = new ResizeObserver(this.onResize)
        .observe(this.$refs.scroller)
      
      this.$refs.scroller.addEventListener('scroll', this.onScroll)
      
      //これでコンテンツのupdateを検知してるけどあんまりいい実装じゃなさそう
      window.addEventListener('reloadContents', this.loadContents)
    },

    beforeDestroy () {
      if (this.resizeObserver) {
        this.resizeObserver.unobserve(this.$refs.scroller)
      }

      this.$refs.scroller.removeEventListener('scroll', this.onScroll)
      window.removeEventListener('reloadContents', this.loadContents, false)
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