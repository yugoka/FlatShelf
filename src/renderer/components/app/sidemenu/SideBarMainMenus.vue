<template>
  <v-list 
    nav
    dense
  >
    <v-list-item-group
      v-model="selectedItem.item"
      color="primary"
      mandatory
    >
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>ホーム</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider/>

      <v-list-item
        v-for="item in menuItems"
        :key="item.type"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon"/>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"/>
        </v-list-item-content>
      </v-list-item>

    </v-list-item-group>
  </v-list>
</template>

<script>
  export default {
    name: 'SideBarMainMenus',

    props: {
      selectedItem: Object
    },

    data() {
      return {
        menuItems: [
          {
            title: "未分類",
            icon: "mdi-archive-outline",
            type: "uncategolized"
          },
          {
            title: "タグなし",
            icon: "mdi-archive-outline",
            type: "no-tags"
          }
        ]
      }
    }
  }

</script>

<style>
</style>
