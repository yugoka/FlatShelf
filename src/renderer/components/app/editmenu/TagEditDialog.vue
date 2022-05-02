<template>
  <v-menu
    v-model="visible"
    :position-x="position.x"
    :position-y="position.y"
    left
    content-class="elevation-2"
    :close-on-content-click="false"
  >
    <v-card
      class="card px-2"
    >
      <v-text-field
        autofocus
        flat
        solo
        dense
        hide-details

        prepend-inner-icon="mdi-tag-plus-outline"
        placeholder="タグを追加または検索"
        :persistent-placeholder="!input.length"

        v-model="input"
        @keypress.enter="setTagByInput"
        @input="onInput"
      />

      <v-divider/>

      <div class="scroll-content pb-3">
        <div 
          v-if="!searchReady"
          class="mt-3"
        >
          <div class="body-2">最近使用したタグ</div>
          <TagChip
            v-for="tag in recentUsedTags"
            :key="tag.tagID"
            :tag="tag"
            :selectMode="true"
            :selectedTags="selectedTags"
            @click="toggleTag(tag)"
          />
        </div>

        <div
          v-else
          class="mt-3"
        >

          <TagCreateButton
            v-if="!exactNameTag"
            :input="input"
            @click="setTagByInput"
          />

          <div 
            v-if="tagSearchResult.length"
            class="body-2"
          >
            検索結果
          </div>

          <TagChip
            v-for="tag in tagSearchResult"
            :key="tag.tagID"
            :tag="tag"
            :selectMode="true"
            :selectedTags="selectedTags"
            @click="toggleTag(tag)"
          />
        </div>

      </div>
    </v-card>
  </v-menu>
</template>

<script>
  import debounce from "lodash.debounce"
  import TagChip from "./TagChip.vue"
  import TagCreateButton from "./TagCreateButton.vue"
  export default {

    components: { TagChip, TagCreateButton },
    
    props: {
      selectedTags: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        visible: false,
        input: "",
        contentIDs: [],
        recentUsedTags: [],
        tagSearchResult: [],
        //検索ワードと全く同じ名前を持つタグが存在するかどうか
        exactNameTag: null,
        searchReady: false
      }
    },

    computed: {
      position() {
        return {
          x: window.innerWidth - this.$store.state.settings.renderer.app.editMenuWidth,
          y: window.innerHeight / 2
        }
      },
    },

    methods: {
      async show(contentIDs) {
        this.input = ""
        this.contentIDs = (Array.isArray(contentIDs))
          ? contentIDs
          : [contentIDs]
        this.visible = true
        await this.getRecentUsedTags()
      },

      //入力バーから得られた文字をそのままタグとして登録する
      async setTagByInput() {
        if (!this.input.length) return
        await this.$tags.set(this.contentIDs, this.input)
        this.input = ""
        this.$emit("update")
        await this.getRecentUsedTags()
        this.searchReady = false
      },

      async toggleTag(targetTag) {
        //タグが選択されている場合は選択解除
        if (this.selectedTags.find(selectedTag => selectedTag.tagID === targetTag.tagID )) {
          await this.$tags.removeByID(this.contentIDs, targetTag.tagID)
        //タグが選択されていない場合は新規選択
        } else {
          await this.$tags.setByID(this.contentIDs, targetTag.tagID)
        }
        this.$emit("update")
      },

      async getRecentUsedTags() {
        this.recentUsedTags = await this.$tags.get({
          order: [["lastUsed", "DESC"]],
          limit: 15
        })
      },

      async getTagsByWord() {
        if (!this.input.length) {
          this.tagSearchResult = []
          this.searchReady = false
        } else {
          this.tagSearchResult = await this.$tags.get({
            order: [["lastUsed", "DESC"]],
            word: this.input
          })
          this.getExactNameTag()
          //検索結果を表示可能にする
          this.searchReady = true
        }
      },

      getExactNameTag() {
        //検索ワードと全く同じ名前を持つタグを抽出し、検索結果の先頭に移動する
        const exactNameTagIndex = this.tagSearchResult.findIndex(tag => tag.name === this.input)
        if (exactNameTagIndex != -1) {
          this.exactNameTag = this.tagSearchResult.splice(exactNameTagIndex, 1)[0]
          this.tagSearchResult.unshift(this.exactNameTag)
        } else {
          this.exactNameTag = null
        }
      },
 
      onInput: debounce(async function() {
        await this.getTagsByWord()
      }, 200),


    },
  }
</script>

<style scoped>
.card {
  width: 250px;
}

.scroll-content {
  max-height: 250px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.card ::-webkit-scrollbar {
  overflow:visible;
  width: 4px;
}
.card ::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,.15); 
  border-radius: 2px;
}
</style>