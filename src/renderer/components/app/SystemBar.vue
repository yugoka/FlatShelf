<template>
  <v-system-bar
    fixed
    height="25"
    id="systembar"
  >
    FlatShelf
  </v-system-bar>
</template>

<script>
  export default {
    name: 'SystemBar',

    data: () => ({

    }),
  }
</script>

<style>
#systembar {
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
</style>