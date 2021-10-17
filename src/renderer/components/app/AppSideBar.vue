<template>
    <v-navigation-drawer
      app
      absolute
      permanent
      clipped-top
      id="sidebar"
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

    <div style="height: 300px;">あああ</div>
    <div style="height: 300px;">あああ</div>
    <div style="height: 300px;">あああ</div>
    <div style="height: 300px;">あああ</div>
    <div style="height: 300px;">あああ</div>
    <!--スクロールバーを隠すためのラッパー-->
    <div id="scrollbar-wrapper"></div>
    </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'SideBar',

    data: () => ({

    }),
  }
</script>

<style>
  #sidebar ::-webkit-scrollbar {
    overflow:visible;
    width: 6px;
  }

  #sidebar ::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,.2); 
    border-radius: 3px;
  }

  #scrollbar-wrapper {
  position: absolute;
  background: #fff;;
  height: 100%;  
  top: 0;
  right: 0;
  width: .4em;
  -webkit-transition: all .5s;
  transition: .5s;
  opacity: 1;
  }

  #scrollbar-wrapper:hover {
  -webkit-transition: all .5s;
  transition: .5s;
  opacity: 0;
  }
</style>
