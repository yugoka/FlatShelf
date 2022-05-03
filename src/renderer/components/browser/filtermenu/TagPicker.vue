<template>
  <div v-if="$store.state.isFilterMenuShown">
    <v-menu v-model="menu" :close-on-content-click="false" nudge-bottom="25">
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip bottom open-delay="300">
          <template v-slot:activator="{ on: tooltip }">
            <v-chip
              class="ms-10"
              small
              v-bind="{ attrs }"
              v-on="{ ...tooltip, ...menu }"
              label
              outlined
              ripple
              @click="show"
            >
              <v-chip x-small class="mx-1"> あああ </v-chip>
            </v-chip>
          </template>
          <span class="caption">タグで絞り込み</span>
        </v-tooltip>
      </template>
      <v-card>
        <span class="mx-10 my-10"> こんにちは </span>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
    }
  },
  methods: {
    show() {
      this.menu = true
    },
  },
}
</script>

<style scoped></style>
