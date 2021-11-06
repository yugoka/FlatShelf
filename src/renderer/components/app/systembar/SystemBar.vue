<template>
  <v-system-bar
    id="systembar"
    fixed
    height="30"
    class="pb-0 pe-0"
    color="systemBar"
  >
    FlatShelf

    <v-spacer/>

    <SystemButton
      icon="mdi-minus"
      @click.native="minimizeWindow"
    />

    <SystemButton
      icon="mdi-checkbox-blank-outline"
      @click.native="maximizeWindow"
    />

    <SystemButton
      color="red"
      icon="mdi-close"
      @click.native="quitApp"
    />

  </v-system-bar>
</template>

<script>
  import SystemButton from "./SystemButton.vue"

  export default {
    name: 'SystemBar',

    components: {
      SystemButton
    },

    methods: {
      minimizeWindow() {
        window.ipc.minimizeMainWindow()
      },
      maximizeWindow() {
        window.ipc.maximizeMainWindow()
      },
      quitApp() {
        window.ipc.quitApp()
      }
    }
  }
</script>

<style>
#systembar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
</style>