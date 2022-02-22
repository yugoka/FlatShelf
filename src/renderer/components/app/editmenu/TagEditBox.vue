<template>
  <v-card
    class="card"
    outlined
    ripple
    @click="clickCard"
  >

    <TagEditDialog
      ref="dialog"
      @update="onUpdate"
    />

    <TagChip
      v-for="tag in tags"
      :key="tag.tagID"
      :tag="tag"
    />

  </v-card>
</template>

<script>
  import TagEditDialog from "./TagEditDialog.vue"
  import TagChip from "./TagChip.vue"

  export default {

    name: "EditMenuTagEditBox",

    props: {
      contentIDs: Array
    },

    components: {
      TagEditDialog,
      TagChip
    },

    data() {
        return {
            tags: []
        }
    },

    watch: {
      async contentIDs() {
        await this.getCommonTags()
      }
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
      }
    },

    async created() {
      await this.getCommonTags()
    }
    
  }
</script>

<style scoped>
.card {
  min-height: 100px;
  padding: 5px;
  overflow: hidden;
}
</style>