<template>
  <div class="scroller" ref="scroller">
    <CardDragGhost ref="dragGhost" />

    <SearchContextMenu ref="contextMenu" />

    <!-- 検索結果の前に表示される要素 -->
    <BeforeSearchContents @resize="onResizePrependElements" />

    <ItemNotFound v-if="!contents.length" />

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
        @hover="onHoverCard(card.index)"
        @dragstart="onCardDragStart"
        @dragend="onCardDragEnd"
      />
    </div>
  </div>
</template>

<script>
import debounce from "lodash.debounce"
import throttle from "lodash.throttle"

import ContentCard from "./cards/ContentCard"
import SearchContextMenu from "./SearchContextMenu"
import layoutManager from "./scripts/layout-manager"
import CardDragGhost from "./cards/CardDragGhost.vue"
import BeforeSearchContents from "./BeforeSearchContents.vue"
import ItemNotFound from "./ItemNotFound.vue"
import { throws } from "assert"

export default {
  name: "SearchContents",

  components: {
    ContentCard,
    SearchContextMenu,
    CardDragGhost,
    BeforeSearchContents,
    ItemNotFound,
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
      hoverCardIndex: null,
      prependHeight: 0,
      keys: {
        Shift: false,
        Meta: false,
        Control: false,
      },
      keyDownBinds: {
        Shift: [this.highlightCards],
        a: [this.selectAll],
      },
      keyUpBinds: {
        Shift: [this.endHighlight],
      },
      tips: {
        selectMany: true,
      },
    }
  },

  computed: {
    itemSize() {
      return this.$store.state.settings.renderer.search.itemSize
    },

    viewContext() {
      return this.$store.getters.viewContext
    },

    editMode() {
      return this.$store.state.edit.editMode
    },

    containerHeight() {
      if (!this.layouts) return 0
      const containerHeight = this.layouts.containerHeight - this.prependHeight

      //最小値を0としてコンテナの高さを設定
      if (containerHeight >= 0) {
        return containerHeight
      } else {
        return 0
      }
    },

    contentIDs() {
      return this.contents.map((content) => content.contentID)
    },
  },

  watch: {
    //検索条件が変わった時コンテンツをロードし直す
    viewContext: {
      async handler() {
        await this.loadContents()
        this.setScrollTop(0)
      },
      deep: true,
    },

    itemSize() {
      this.getLayouts()
    },

    //コンテンツ合計の高さが変化した時スクロール位置を保持する
    contentsHeight(after, before) {
      if (before <= 0) return
      this.setScrollTop((this.scrollTop * after) / before)
    },

    contentIDs() {
      this.$store.commit("setSearchResult", this.contentIDs)
    },
  },

  methods: {
    //storeに格納されたcontextに従ってコンテンツを読み込む。Browser上すべての検索はここで行われる
    async loadContents({ getLayouts = true } = {}) {
      this.contents = await this.$search.execute(this.viewContext)
      //毎回リロード問題のせいで選択開始位置がリセットされてしまう。。。
      this.selectStartIndex = null
      if (getLayouts) {
        this.$nextTick(() => {
          this.getLayouts()
        })
      }
    },

    //レイアウトを更新する
    getLayouts() {
      if (!Array.isArray(this.contents)) return

      this.layouts = layoutManager.getLayouts({
        contents: this.contents,
        scrollerWidth: this.scrollerWidth,
        itemSize: this.itemSize,
      })

      this.contentsHeight = this.layouts.containerHeight
      this.$nextTick(() => {
        this.getVisibleCards()
      })
    },

    getScrollerSize() {
      const scrollerRect = this.$refs.scroller.getBoundingClientRect()
      this.scrollerWidth = scrollerRect.width
      this.scrollerHeight = scrollerRect.height
    },

    getVisibleCards() {
      if (!this.layouts) {
        this.visibleCards = []
        return
      }
      const minScrollTop = this.scrollTop - this.buffer - this.prependHeight
      const maxScrollTop =
        this.scrollTop + this.scrollerHeight + this.buffer - this.prependHeight

      this.visibleCards = this.layouts.boxes.filter((box) => {
        return minScrollTop < box.top && box.top < maxScrollTop
      })
    },

    //------------------------------------
    // スクロール/検索要素制御
    //------------------------------------
    setScrollTop(scrollTop) {
      this.scrollTop = scrollTop
      this.$nextTick(() => {
        if (this.$refs.scroller) {
          this.$refs.scroller.scrollTop = this.scrollTop
        }
      })
    },

    openContextMenu(contentID) {
      this.$refs.contextMenu.show(contentID)
    },

    hideContextMenu() {
      this.$refs.contextMenu.hide()
    },

    //アイテムを選択した時
    setContentSelect({ contentID, cardIndex, isSelected }) {
      if (this.tips.selectMany) {
        this.$store.commit("setNotice", {
          message:
            "Shiftキーを押しながらクリックすると、一度に複数アイテムを選択できます",
          position: "left",
          timeout: 5000,
        })
        this.tips.selectMany = false
      }

      //選択解除の場合
      if (!isSelected) {
        this.$store.dispatch("removeSelectedItems", contentID)
        return
      }

      //新規選択の場合
      if (!this.keys.Shift || this.selectStartIndex === null) {
        this.$store.dispatch("addSelectedItems", contentID)
      } else {
        const newSelectItem =
          this.selectStartIndex < cardIndex
            ? this.contentIDs.slice(this.selectStartIndex + 1, cardIndex + 1)
            : this.contentIDs.slice(cardIndex, this.selectStartIndex)
        this.$store.dispatch("addSelectedItems", newSelectItem)
      }
      this.selectStartIndex = cardIndex
    },

    //Shiftを押している場合に複数選択対象のカードをハイライトする
    highlightCards() {
      if (
        !this.keys.Shift ||
        !this.editMode ||
        this.hoverCardIndex === null ||
        this.selectStartIndex === null
      )
        return

      const upperIndex = Math.max(this.selectStartIndex, this.hoverCardIndex)
      const lowerIndex = Math.min(this.selectStartIndex, this.hoverCardIndex)

      for (const card of this.$refs.cards) {
        if (lowerIndex <= card.card.index && card.card.index <= upperIndex) {
          card.highlighted = true
        } else {
          card.highlighted = false
        }
      }
    },

    endHighlight() {
      if (!this.editMode) return
      for (const card of this.$refs.cards) {
        card.highlighted = false
      }
    },

    selectAll() {
      if (!this.keys.Control && !this.keys.Meta) return
      this.$store.dispatch("setSelectedItems", this.contentIDs)
      this.$nextTick(() => {
        window.getSelection().removeAllRanges()
      })
    },

    //------------------------------------
    // イベント制御
    //------------------------------------
    onCardDragStart(content) {
      this.$refs.dragGhost.show(content)
    },

    onCardDragEnd() {
      this.$refs.dragGhost.hide()
    },

    onResizePrependElements: debounce(function (height) {
      this.prependHeight = height
      this.getLayouts()
    }, 100),

    onResize: debounce(function () {
      if (!this.$refs.scroller) return
      this.getScrollerSize()
      this.getLayouts()
    }, 50),

    onHoverCard(index) {
      this.hoverCardIndex = index
      if (this.keys.Shift) this.highlightCards()
    },

    onScroll: throttle(function () {
      this.scrollTop = this.$refs.scroller.scrollTop
      this.getVisibleCards()
      this.hideContextMenu()
    }, 300),

    onKeyUp(e) {
      for (const keyName in this.keys) {
        if (e.key === keyName) this.keys[keyName] = false
      }
      this.executeShortCuts(e.key, this.keyUpBinds)
    },

    onKeyDown(e) {
      for (const keyName in this.keys) {
        if (e.key === keyName) {
          this.keys[keyName] = true
        }
      }

      //各ショートカットを実行する
      this.executeShortCuts(e.key, this.keyDownBinds)

      //Ctrl+Aで全画面選択をしないようにする
      if ((this.keys.Meta || this.keys.Control) && e.key === "a") {
        e.preventDefault()
      }
    },

    //特定のキーに指定されているメソッドを全て実行
    executeShortCuts(keyName, binds) {
      if (!binds[keyName]) return

      for (const func of binds[keyName]) {
        func.bind(this)
        func()
      }
    },
  },

  async created() {
    await this.loadContents({ getLayouts: false })

    //これでコンテンツのupdateを検知してるけどあんまりいい実装じゃなさそう
    window.addEventListener("reloadContents", this.loadContents)
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
  },

  mounted() {
    this.getScrollerSize()

    this.resizeObserver = new ResizeObserver(this.onResize).observe(
      this.$refs.scroller
    )

    this.$refs.scroller.addEventListener("scroll", this.onScroll)
  },

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.$refs.scroller)
    }

    this.$refs.scroller.removeEventListener("scroll", this.onScroll, false)

    window.removeEventListener("reloadContents", this.loadContents, false)
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
  },
}
</script>

<style scoped>
.scroller {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  user-select: none;
}

.contents-wrapper {
  position: relative;
}

.scroller::-webkit-scrollbar {
  overflow: visible;
  width: 8px;
}
.scroller::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}
.content-row {
  width: 100%;
}
</style>
