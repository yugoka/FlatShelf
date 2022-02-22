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
      class="card px-2 pb-2"
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
        @keydown.enter="setTag"
      />

      <v-divider class="mb-3"/>

      <div class="body-2">最近使用したタグ</div>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      input: "",
      contentIDs: []
    }
  },

  computed: {
    position() {
      return {
        x: window.innerWidth - this.$store.state.settings.renderer.app.editMenuWidth,
        y: window.innerHeight / 2
      }
    }
  },

  methods: {
    show(contentIDs) {
      this.contentIDs = (Array.isArray(contentIDs))
        ? contentIDs
        : [contentIDs]
      this.visible = true
    },

    async setTag() {
      const result = await this.$tags.set(this.contentIDs, this.input)
      console.log(result)
    }
  }
}
</script>

<style scoped>
.card {
  min-width: 200px;
}
</style>