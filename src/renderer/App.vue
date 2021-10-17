<template>
  <v-app>
    <v-container>
      <v-btn @click="increment">{{count}}</v-btn>
    </v-container>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
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
