<template>
  <v-app>

    <Header/>

    <SideBar class="main-contents"/>

    <div class="main-contents">
      <v-main>
        <v-container>
          <v-btn @click="increment">{{count}}</v-btn>
        </v-container>
      </v-main>
    </div>
    
  </v-app>
</template>

<script>

import SideBar from "./components/app/AppSideBar"
import Header from "./components/app/AppHeader"

export default {
  name: 'App',

  components: {
    SideBar,
    Header
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
.main-contents {
  padding-top: 30px;
}
</style>