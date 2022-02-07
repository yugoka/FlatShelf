<template>
  <v-system-bar
    id="systembar"
    class="pb-0 pe-0"
    fixed
    height="30"
    color="systemBar"
  >
    <span>FlatShelf</span>
    
    <div>
      <SearchBar/>
    </div>
    
    <div>
      <SystemButton
        icon="mdi-minus"
        @click.native="minimizeWindow"
      />

      <SystemButton
        :icon="maximized ? 'mdi-checkbox-multiple-blank-outline' : 'mdi-checkbox-blank-outline'"
        @click.native="toggleMaximized"
      />

      <SystemButton
        color="red"
        icon="mdi-close"
        @click.native="quitApp"
      />
    </div>

  </v-system-bar>
</template>

<script>
import SystemButton from "./SystemButton.vue"
import SearchBar from "./SearchBar.vue"

export default {
  name: 'SystemBar',

  components: {
    SystemButton,
    SearchBar
  },

  data() {
    return {
      maximized: false
    }
  },

  computed: {
    sideMenuWidth() {
      return this.$config.renderer().app.sideMenuWidth
    }
  },

  methods: {
    minimizeWindow() {
      window.ipc.minimizeMainWindow()
    },
    toggleMaximized() {
      window.ipc.toggleMaximized()
    },
    quitApp() {
      window.ipc.quitApp()
    },
    onToggleMaximized(isMaximized) {
      this.maximized = isMaximized
    }
  },

  created() {
    window.ipc.onToggleMaximized(this.onToggleMaximized)
  }
}
</script>

<style scoped>
#systembar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;
}

#systembar .clickable {
  user-select: none;
  -webkit-user-select: all;
  -webkit-app-region: no-drag;
}

</style>