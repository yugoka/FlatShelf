<template>
  <v-card class="card" outlined ripple @click="clickCard">
    <TagEditDialog ref="dialog" @update="onUpdate" :selectedTags="tags" />

    <TagChip
      v-for="tag in tags"
      :key="tag.tagID"
      :tag="tag"
      @delete="removeTag(tag.tagID)"
    />
  </v-card>
</template>

<script>
import TagEditDialog from "./TagEditDialog.vue"
import TagChip from "../../tags/TagChip.vue"

export default {
  name: "EditMenuTagBox",

  props: {
    contentIDs: Array,
  },

  components: {
    TagEditDialog,
    TagChip,
  },

  data() {
    return {
      tags: [],
    }
  },

  watch: {
    async contentIDs() {
      await this.getCommonTags()
    },
  },

  methods: {
    clickCard() {
      this.$refs.dialog.show(this.contentIDs)
    },

    async onUpdate() {
      await this.getCommonTags()
    },

    //メインプロセスに問い合わせて選択されたコンテンツ全てに共通するタグを抽出する
    async getCommonTags() {
      this.tags = await this.$tags.getCommonTags(this.contentIDs)
    },

    async removeTag(tagID) {
      await this.$tags.removeByID(this.contentIDs, tagID)
      await this.getCommonTags()
    },
  },

  async created() {
    await this.getCommonTags()
  },
}
</script>

<style scoped>
.card {
  min-height: 100px;
  max-height: 200px;
  padding: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
