<template>
  <v-list 
    nav
    dense
    class="pt-1"
  >
    <v-list-item-group
      v-model="selectedItem.item"
      color="primary"
      mandatory
    >
      <NavItem 
        title="ホーム"
        icon="mdi-home"
      />

      <v-divider
        class="my-1"  
      />

      <NavItem 
        title="未分類"
        icon="mdi-archive-outline"
      />

      <NavItem 
        title="タグなし"
        icon="mdi-archive-outline"
      />

      <NavItem 
        title="最近追加"
        icon="mdi-archive-outline"
      />

      <v-divider
        class="my-1"  
      />

    </v-list-item-group>
  </v-list>
</template>

<script>
  import NavItem from "./NavItem.vue"

  export default {
    name: 'SideMenuMainMenus',

    props: {
      selectedItem: Object
    },

    components: {
      NavItem
    },
  }

</script>

<style scoped>

</style>
