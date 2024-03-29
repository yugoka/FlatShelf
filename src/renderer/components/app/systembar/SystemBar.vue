<template>
  <v-system-bar
    id="systembar"
    class="pb-0 pe-0"
    fixed
    height="30"
    color="systemBar"
  >
    <div class="group-wrapper">
      <span class="logo">
        FlatShelf
        <span v-show="$vuetify.breakpoint.width > 600">
          <v-icon x-small class="ms-1 me-0">mdi-beta</v-icon>
          {{ appVersion }}
        </span>
      </span>

      <SideMenuOpenButton class="clickable" />
    </div>

    <div class="group-wrapper clickable">
      <SortMenu />

      <SearchBar />

      <Slider class="systembar-slider" />
    </div>

    <div class="system-button-group">
      <v-btn icon small @click="openSettings" class="mx-1 clickable">
        <v-icon
          small
          class="mini-button-icon"
          :color="$route.name === 'Settings' ? 'primary' : null"
        >
          mdi-cog
        </v-icon>
      </v-btn>

      <SystemButton icon="mdi-minus" @click.native="minimizeWindow" />

      <SystemButton
        :icon="
          maximized
            ? 'mdi-checkbox-multiple-blank-outline'
            : 'mdi-checkbox-blank-outline'
        "
        @click.native="toggleMaximized"
      />

      <SystemButton icon="mdi-close" @click.native="quitApp" />
    </div>
  </v-system-bar>
</template>

<script>
import SystemButton from "./SystemButton.vue"
import SearchBar from "./search/SearchBar.vue"
import Slider from "./Slider.vue"
import SideMenuOpenButton from "./SideMenuOpenButton.vue"
import SortMenu from "./SortMenu.vue"

export default {
  name: "SystemBar",

  components: {
    SystemButton,
    SearchBar,
    Slider,
    SideMenuOpenButton,
    SortMenu,
  },

  data() {
    return {
      maximized: false,
      appVersion: require("../../../../../package.json").version,
    }
  },

  computed: {
    sideMenuWidth() {
      return this.$config.renderer().app.sideMenuWidth
    },
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
    },
    openSettings() {
      if (this.$route.name != "Settings") {
        this.$router.push({ name: "Settings" })
      }
    },
  },

  created() {
    window.ipc.onToggleMaximized(this.onToggleMaximized)
  },
}
</script>

<style scoped>
#systembar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  user-select: none;
  white-space: nowrap;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;
  max-width: 100%;
}

#systembar .clickable {
  user-select: none;
  -webkit-user-select: all;
  -webkit-app-region: no-drag;
}

#systembar .group-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  flex-shrink: 1;
}

#systembar .system-button-group {
  flex-shrink: 0;
}

#systembar .systembar-slider {
  flex-shrink: 1;
}

#systembar .mini-button-icon {
  margin: 0;
  padding: 0;
}
</style>
