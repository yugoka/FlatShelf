<template>
    <v-navigation-drawer
      app
      stateless
      id="sidebar"
      v-model="isSideMenuShown"
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

      <span>{{isSideMenuShown}}</span>
      <div style="height: 300px;">あああ</div>
      <div style="height: 300px;">あああ</div>
      <div style="height: 300px;">あああ</div>
      <div style="height: 300px;">あああ</div>
      <div style="height: 300px;">あああ</div>

    </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'SideBar',

    data() {
      return {

      }
    },
    computed: {
      isSideMenuShown: {
        get() {
          return this.$store.state.isSideMenuShown
        },
        set(sideBarStatus) {
          this.$store.dispatch('toggleSideMenu', sideBarStatus)
        }
      }
    },
    methods: {

    },
  }
</script>

<style>
  #sidebar {
    margin-top: 25px;
  }

  #sidebar ::-webkit-scrollbar {
    overflow:visible;
    width: 4px;
    display: none;
  }
  #sidebar ::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,.15); 
    border-radius: 2px;
    display: none;
  }
  #sidebar:hover ::-webkit-scrollbar {
    display: block;
  }
  #sidebar:hover ::-webkit-scrollbar-thumb {
    display: block;
  }
  
</style>
