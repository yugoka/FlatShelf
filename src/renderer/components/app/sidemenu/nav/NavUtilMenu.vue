<template>
  <v-list-group prepend-icon="mdi-menu" no-action v-model="expand">
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>メニュー</v-list-item-title>
      </v-list-item-content>
    </template>

    <v-divider class="my-1" />

    <v-list-item class="sidebar-nav-item" @click="click">
      <v-list-item-content>
        <v-list-item-title>こども</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script>
import RotatingIcon from "../../miniparts/RotatingIcon.vue"

export default {
  data() {
    return {
      expand: false,
    }
  },
  methods: {
    toggle() {
      this.expand = !this.expand
    },
    click() {
      console.log("click")
    },
  },
}
</script>

<style scoped>
.sidebar-nav-item .v-list-item__icon {
  margin-bottom: 3px !important;
  margin-top: 3px !important;
}
</style>
