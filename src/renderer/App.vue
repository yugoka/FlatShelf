<template>
  <v-app>

    <SystemBar/>

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
.main-contents {
  padding-top: 30px;
}
</style>