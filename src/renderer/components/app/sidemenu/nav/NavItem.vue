<template>
  <v-list-item 
    class="sidebar-nav-item"
    :ripple="false"
  >
    <v-list-item-icon>
      <v-icon v-text="icon"/>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="title"/>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  export default {
    name: 'SideMenuMainMenuItem',

    props: {
      title: String,
      icon: String
    },
  }

</script>

<style scoped>
.sidebar-nav-item {
  height: 30px !important;
  min-height: 30px !important;
  margin: 1px 0px !important;
}
.sidebar-nav-item .v-list-item__icon {
  margin-bottom: 3px !important;
  margin-top: 3px !important;
}
</style>
