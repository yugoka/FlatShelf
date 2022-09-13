<template>
  <v-list-group prepend-icon="mdi-menu" no-action v-model="expand">
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>メニュー</v-list-item-title>
      </v-list-item-content>
    </template>

    <DummyFileInput ref="fileInput" />

    <v-divider />
    <v-list-item
      v-for="menu in menus"
      :key="menu.id"
      @click="menu.action()"
      class="sidebar-nav-item mt-1 pl-5"
      color="primary"
    >
      <v-list-item-icon>
        <v-icon>{{ menu.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ menu.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script>
import DummyFileInput from "../../miniparts/DummyFileInput.vue"

export default {
  components: { DummyFileInput },
  data() {
    return {
      expand: false,
      menus: [
        {
          id: "new-item",
          name: "新規ファイル",
          icon: "mdi-file-plus-outline",
          action: this.newFile,
        },
        {
          id: "help",
          name: "ヘルプ",
          icon: "mdi-help-circle-outline",
          action: this.openHelp,
        },
        {
          id: "feedback",
          name: "要望を送る",
          icon: "mdi-email-outline",
          action: this.feedBack,
        },
        {
          id: "settings",
          name: "設定",
          icon: "mdi-cog",
          action: this.openSettings,
        },
      ],
    }
  },
  methods: {
    toggle() {
      this.expand = !this.expand
    },
    openSettings() {
      if (this.$route.name != "Settings") {
        this.$router.push({ name: "Settings" })
      }
    },
    newFile() {
      this.$refs.fileInput.activate()
    },
    openHelp() {
      console.log("たーすけてー！！")
    },
    feedBack() {
      console.log("feedback")
    },
  },
}
</script>

<style scoped></style>
