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
        ref="cards"
        class="card"
        v-for="card in visibleCards"
        :key="card.content.contentID"
        :card="card"
        @contextMenu="openContextMenu($event)"
        @setContentSelect="setContentSelect"
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
        visibleCards: [],
        selectStartIndex: null,
        keys: {
          Shift: false,
          Ctrl: false
        }
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
      },

      contentIDs() {
        return this.contents.map(content => content.contentID)
      }
    },

    watch: {
      //検索条件が変わった時コンテンツをロードし直す
      viewContext: {
        async handler(){
          this.setScrollTop(0)
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
        this.setScrollTop(this.scrollTop * after / before)
      }
    },

    methods: {
      //コンテンツを読み込む。すべての検索はここで行われる
      async loadContents() {
        const query = this.viewContext
        this.contents = await this.$contents.search(query)
        this.getLayouts()
        this.selectStartIndex = null
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

      setScrollTop(scrollTop) {
        this.scrollTop = scrollTop
        this.$nextTick(() => {
          this.$refs.scroller.scrollTop = this.scrollTop
        })
      },

      openContextMenu(contentID) {
        this.$refs.contextMenu.show(contentID)
      },

      setContentSelect({ contentID, cardIndex, isSelected }) {
        //選択解除の場合
        if (!isSelected) {
          this.$store.dispatch("removeSelectedItems", contentID)
          return
        }

        //新規選択の場合
        if (!this.keys.Shift || this.selectStartIndex === null) {
          this.$store.dispatch("addSelectedItems", contentID)
        } else {
          const newSelectItem = this.selectStartIndex < cardIndex
            ? this.contentIDs.slice(this.selectStartIndex, cardIndex + 1)
            : this.contentIDs.slice(cardIndex, this.selectStartIndex + 1)
          this.$store.dispatch("addSelectedItems", newSelectItem)
        }
        this.selectStartIndex = cardIndex
      },

      onKeyUp(e) {
        for (const keyName in this.keys) {
          if (e.key === keyName) this.keys[keyName] = false
        }
      },

      onKeyDown(e) {
        for (const keyName in this.keys) {
          if (e.key === keyName) {
            this.keys[keyName] = true
          } 
        }
      },
    },

    async created() {
      await this.loadContents()

      //これでコンテンツのupdateを検知してるけどあんまりいい実装じゃなさそう
      window.addEventListener('reloadContents', this.loadContents)
      window.addEventListener("keydown", this.onKeyDown)
      window.addEventListener("keyup", this.onKeyUp)
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

      this.$refs.scroller.removeEventListener('scroll', this.onScroll, false)

      window.removeEventListener('reloadContents', this.loadContents, false)
      window.removeEventListener("keydown", this.onKeyDown)
      window.removeEventListener("keyup", this.onKeyUp)
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