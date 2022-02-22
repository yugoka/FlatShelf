<template>
  <v-card
    class="card"
    outlined
    ripple
    @click="clickCard"
  >

    <TagEditDialog
      ref="dialog"
    />

    <v-chip 
      v-for="tag in tags"
      :key="tag"

      class="me-1 mt-1"
      x-small
      ripple
    >
      {{tag}}
    </v-chip>
  </v-card>
</template>

<script>
  import TagEditDialog from "./TagEditDialog.vue"

  export default {

      name: "EditMenuTagEditBox",

      components: { 
        TagEditDialog
      },

      data() {
          return {
              tags: [
                  "えろい",
                  "えらい",
                  "えろじい",
                  "お気に入り",
                  "ちくわ丼"
              ]
          }
      },
      methods: {
          clickCard() {
              this.$refs.dialog.show(this.$store.state.edit.selectedIDs)
          }
      },
    
  }
</script>

<style scoped>
.card {
  height: 100px;
  padding: 5px;
  overflow: hidden;
}
</style>