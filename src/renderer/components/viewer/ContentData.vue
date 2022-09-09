<template>
  <div class="secondary--text">
    <div class="text-body-2">タグ</div>
    <div class="mb-3">
      <TagChip
        v-for="tag in tags"
        :key="tag.tagID"
        :tag="tag"
        no-close-button
        color="primary"
        @click="jumpToTagSearch(tag)"
      />
      <span v-if="!tags.length" class="text-caption">まだタグがありません</span>
    </div>

    <div v-for="data in datas" :key="data.column" class="mb-2">
      <div class="text-subtitle-2">{{ data.name }}</div>
      <div
        class="caption mb-2 content-text"
        v-text="content[data.column] || '未記入'"
      />
    </div>

    <div class="text-body-2 mb-1">フォルダ</div>
    <v-chip small tile outlined @click="jumpToFolderSearch">
      <v-icon class="me-2">mdi-folder</v-icon>
      {{ folder.name }}
    </v-chip>
  </div>
</template>

<script>
import TagChip from "../tags/TagChip.vue"
export default {
  components: { TagChip },
  props: {
    content: Object,
  },
  data() {
    return {
      tags: [],
      folder: {},
      datas: [
        {
          column: "name",
          name: "タイトル",
          icon: "mdi-note-text-outline",
        },
        {
          column: "description",
          name: "説明",
          icon: "mdi-note-text-outline",
        },
        {
          column: "author",
          name: "作者名",
          icon: "mdi-account-circle-outline",
        },
      ],
    }
  },

  watch: {
    async content() {
      await this.getContentData()
    },
  },

  methods: {
    async getContentData() {
      this.getTags()
      this.getFolder()
    },
    async getTags() {
      this.tags = await this.$tags.getTagsByContentIDs(this.content.contentID)
    },
    async getFolder() {
      const result = await this.$folders.getData([this.content.folderID])
      this.folder = result[0]
    },
    jumpToTagSearch(tag) {
      this.$search.redirect({
        tags: [tag.tagID],
      })
    },
    jumpToFolderSearch() {
      this.$search.redirect({
        folder: this.content.folderID,
      })
    },
  },

  async created() {
    window.addEventListener("onTagUpdate", this.getTags)
    await this.getContentData()
  },

  beforeDestroy() {
    window.removeEventListener("onTagUpdate", this.getTags, false)
  },
}
</script>

<style scoped>
.content-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
