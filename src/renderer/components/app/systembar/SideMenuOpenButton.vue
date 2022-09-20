<template>
  <v-tooltip bottom open-delay="500" v-model="showToolTip">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-show="!isSideMenuShown"
        class="ms-1 me-2 button"
        :class="[{ 'animate__animated animate__swing': shakeButton }]"
        icon
        small
        v-bind="attrs"
        v-on="on"
        @click="click"
      >
        <v-icon class="button-icon" small> mdi-menu </v-icon>
      </v-btn>
    </template>
    <span class="caption">
      {{ hintMessage }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: "SystemBarSideMenuOpenButton",

  data() {
    return {
      showToolTip: false,
      shakeButton: false,
      hintMessage: "サイドメニューを開く",
      hint: true,
    }
  },

  computed: {
    isSideMenuShown() {
      return this.$store.state.isSideMenuShown
    },
    disableHint() {
      return this.$store.state.settings.renderer.tips.openSideMenuAgain
    },
  },

  methods: {
    click() {
      this.$store.dispatch("toggleSideMenu")
      if (!this.disableHint) {
        //ヒントを無効化する
        this.$config.set("renderer.tips.openSideMenuAgain", true)
      }
    },
    showHint() {
      if (!this.disableHint) {
        this.hintMessage = "もう一度メニューを開く"
        this.showToolTip = true
        this.shakeButton = true
        setTimeout(() => {
          this.showToolTip = false
          this.shakeButton = false
          setTimeout(() => (this.hintMessage = "メニューを開く"), 500)
        }, 4000)
      }
    },
  },

  watch: {
    isSideMenuShown() {
      if (!this.isSideMenuShown && this.hint) {
        setTimeout(() => {
          this.showHint()
          this.hint = false
        }, 500)
      }
    },
  },
}
</script>

<style scoped>
.button {
  user-select: none;
  -webkit-user-select: all;
  -webkit-app-region: no-drag;
}
.button-icon {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
