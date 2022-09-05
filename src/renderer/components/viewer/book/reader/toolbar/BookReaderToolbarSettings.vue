<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    open-on-hover
    close-delay="300"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon large v-bind="attrs" v-on="on">
        <v-icon :color="menu ? 'primary' : ''">mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-card class="card px-3 pt-1 pb-2">
      <div class="body-2 mt-1">ビューワ設定</div>

      <v-divider class="mt-1" />

      <v-switch
        class="mb-2"
        dense
        hide-details
        v-model="pageInversion"
        color="primary"
        label="ページ順を反転する"
      />
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
      pageInversion:
        this.$store.state.settings.renderer.viewer.book.pageInversion,
    }
  },

  watch: {
    menu() {
      this.$emit("toggleMenu", this.menu)
    },

    pageInversion() {
      this.$config.set("renderer.viewer.book.pageInversion", this.pageInversion)
    },
  },
}
</script>

<style scoped>
.card {
  min-width: 200px;
}
</style>
