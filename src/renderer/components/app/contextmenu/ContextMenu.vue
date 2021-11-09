<template>
  <v-menu
    v-model="showMenu"
    :position-x="x"
    :position-y="y"
    absolute
    offset-y

    content-class="elevation-1 app-context-menu"
    transition="false"
    rounded="true"
  >
    <v-list
      dense
    >
      <!--呼び出し元からここにv-list-itemなどを追記する-->
      <slot/>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    data() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
      }
    },

    methods: {
      show () {
        this.showMenu = false
        this.x = window.event.clientX
        this.y = window.event.clientY
        this.$nextTick(() => {
          this.showMenu = true
        })
      },
    },
  }
</script>

<style>
  .app-context-menu .v-sheet {
    padding: 3px 0;
  }
</style>