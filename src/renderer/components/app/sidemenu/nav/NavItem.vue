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
      this.$search.redirect(this.context)
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
