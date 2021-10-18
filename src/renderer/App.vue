<template>
  <v-app>

    <SystemBar/>

    <SideBar class="window-contents"/>

    <div class="window-contents">
      <v-main>
        <router-view/>
      </v-main>
    </div>

  </v-app>
</template>

<script>

import SideBar from "./components/app/AppSideBar"
import SystemBar from "./components/app/SystemBar"

export default {
  name: 'App',

  components: {
    SideBar,
    SystemBar
  },

  data() {
    return {

    }
  },

  methods: {
    increment() { this.$store.commit('increment') }
  },

  computed: {
    count() {
      return this.$store.state.count
    }
  }

};
</script>

<style>
body { 
overflow: hidden; 
} 
.window-contents {
  padding-top: 25px;
}
</style>