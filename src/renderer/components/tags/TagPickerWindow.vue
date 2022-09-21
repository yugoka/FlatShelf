<template>
  <v-card
    class="card"
    :class="{ opacity: isUsing }"
    @mouseleave="onMouseLeave"
    @mouseenter="onMouseEnter"
  >
    <v-text-field
      autofocus
      flat
      solo
      dense
      hide-details
      prepend-inner-icon="mdi-tag-outline"
      placeholder="タグ名を入力"
      :persistent-placeholder="!word.length"
      v-model="word"
      @keypress.enter="onEnter"
      @input="onInput"
    >
      <template v-slot:append>
        <v-btn icon x-small @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-divider />

    <div class="scroll-content py-3 mx-2">
      <div>
        <div class="body-2">
          {{ searchReady ? "検索結果" : "最近使用したタグ" }}
        </div>
        <TagChip
          v-for="tag in showingTags"
          :key="tag.tagID"
          :tag="tag"
          selectMode
          :selectedTags="selectedTags"
          @click="toggleTag"
        />
      </div>

      <div v-if="!showingTags.length" class="text-center caption mt-4 mb-2">
        タグが見つかりませんでした
      </div>
    </div>
  </v-card>
</template>

<script>
import TagChip from "./TagChip.vue"
import debounce from "lodash.debounce"

export default {
  components: { TagChip },

  props: {
    selectedTags: Array,
    visible: Boolean,
  },

  data() {
    return {
      word: "",
      recentUsedTags: [],
      tagSearchResult: [],
      exactNameTag: null,
      //検索が終わった後trueになり、ウィンドウを閉じるかword.length===0になるとfalseになる
      searchReady: false,
      waitingClose: false,
      closeTimeoutID: null,
      //ウィンドウ表示後一度でもマウスオーバーするとtrueになる
      isUsing: false,
    }
  },

  computed: {
    showingTags() {
      return this.searchReady ? this.tagSearchResult : this.recentUsedTags
    },
  },

  watch: {
    //ウィンドウが表示される度に最近使用されたタグを読み込み直す
    async visible() {
      if (this.visible) {
        await this.getRecentUsedTags()
      } else {
        this.word = ""
        this.searchReady = false
        setTimeout(() => {
          this.isUsing = false
        }, 250)
      }
    },
  },

  methods: {
    onMouseLeave() {
      clearTimeout(this.closeTimeoutID)
      if (!this.word) {
        this.waitingClose = true
        this.closeTimeoutID = setTimeout(() => {
          if (this.waitingClose) {
            this.$emit("close")
          }
        }, 2000)
      }
    },

    onMouseEnter() {
      this.waitingClose = false
      this.isUsing = true
    },

    onInput: debounce(async function () {
      if (!this.word.length) {
        this.tagSearchResult = []
        this.searchReady = false
        return
      } else {
        this.tagSearchResult = await this.$tags.get({
          order: [["lastUsed", "DESC"]],
          word: this.word,
        })

        this.searchReady = true
        //検索ワードと全く同じ名前のタグは先頭に移動
        this.getExactNameTag()
      }
    }, 200),

    //検索窓に対してエンターキーが押された時、
    //1. 検索結果が　1件だけの場合
    //2. 検索ワードと完全に一致するタグ名がある場合
    //以上の場合で対象のタグを自動追加する
    async onEnter() {
      if (
        this.searchReady &&
        (this.exactNameTag || this.tagSearchResult.length === 1)
      ) {
        await this.toggleTag(this.tagSearchResult[0])
        this.word = ""
        this.searchReady = false
      }
    },

    close() {
      if (this.word.length) {
        this.word = ""
      } else {
        this.$emit("close")
      }
    },
    async getRecentUsedTags() {
      this.recentUsedTags = await this.$tags.get({
        order: [["lastUsed", "DESC"]],
        limit: 20,
      })
    },
    async toggleTag(data) {
      this.$emit("toggle-tag", data)
      if (this.word.length) {
        await this.getRecentUsedTags()
      }
    },

    getExactNameTag() {
      //検索ワードと全く同じ名前を持つタグを抽出し、検索結果の先頭に移動する
      const exactNameTagIndex = this.tagSearchResult.findIndex(
        (tag) => tag.name === this.word
      )
      if (exactNameTagIndex != -1) {
        this.exactNameTag = this.tagSearchResult.splice(exactNameTagIndex, 1)[0]

        this.tagSearchResult.unshift(this.exactNameTag)
      } else {
        this.exactNameTag = null
      }
    },
  },

  async mounted() {
    await this.getRecentUsedTags()
  },
}
</script>

<style scoped>
.card {
  width: 250px;
}

.card.opacity {
  opacity: 0.6;
  transition: 0.2s;
  transition-delay: 0.2s;
}

.card.opacity:hover {
  transition-delay: 0s;
  opacity: 1;
}

.scroll-content {
  max-height: 250px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.card ::-webkit-scrollbar {
  overflow: visible;
  width: 4px;
}
.card ::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 2px;
}
</style>
