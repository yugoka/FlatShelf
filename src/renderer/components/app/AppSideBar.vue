<template>
    <v-navigation-drawer
      app
      absolute
      permanent
      clipped-top
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

    </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'SideBar',

    data: () => ({

    }),
  }
</script>
