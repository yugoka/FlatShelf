<template>
  <DialogCard
    ref="dialog"
    :maxWidth="300"
  >
    <div class="mx-2 my-1">
      <span class="body-2">
        {{this.contentIDs.length}}件のアイテムを移動
      </span>
      <Folders/>
    </div>
  </DialogCard>
</template>

<script>
import DialogCard from './DialogCard.vue'
import Folders from '../folders/Folders.vue'
export default {
  name: "FolderSelectWindow",

  components: {
    DialogCard,
    Folders 
  },

  data() {
    return {
      visible: false,
      contentIDs: []
    }
  },

  methods: {
    show(contentIDs) {
      this.contentIDs = contentIDs
      this.$refs.dialog.show()
    }
  }
}
</script>

<style>

</style>