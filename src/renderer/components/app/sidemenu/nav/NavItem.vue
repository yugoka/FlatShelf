<template>
  <v-list-item class="sidebar-nav-item" :ripple="false" @click="redirect">
    <v-list-item-icon>
      <v-icon v-text="icon" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="title" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import search from "../../../../managers/renderer-search-manager"
export default {
  name: "SideMenuMainMenuItem",

  props: {
    title: String,
    icon: String,
    to: String,
    context: { type: Object, required: false, default: null },
  },

  methods: {
    redirect() {
      //行き先が検索画面の場合
      if (this.to === "Search") {
        search.redirect(this.context)
      } else {
        //ボタンに対し検索コンテキストが設定されているなら検索条件を変更
        if (this.context) {
          this.$store.commit("setContext", this.context)
        }

        //現在ページから遷移
        if (this.to && this.to != this.$route.name) {
          this.$router.push({ name: this.to })
        }
      }
    },
  },
}
</script>

<style scoped>
.sidebar-nav-item {
  height: 30px;
  margin: 1px 0px !important;
}
.sidebar-nav-item .v-list-item__icon {
  margin-bottom: 3px !important;
  margin-top: 3px !important;
}
</style>
