<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    auto
    eager
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip
        bottom
        open-delay="300"
      >
        <template v-slot:activator="{ on: tooltip }">
          <v-chip
            class="text-left"
            small
            label
            outlined
            v-bind="{ attrs }"
            v-on="{ ...tooltip, ...menu }"
            @click="click"
          > 
            <div class="search-chip-text-wrapper">
              <v-icon>mdi-magnify</v-icon>
              検索
            </div>
          </v-chip>
        </template>
        <span class="caption">アイテムを検索</span>
      </v-tooltip>
    </template>
    <v-card 
      class="px-5 py-5 text-center"
    >
      <div ref="input">
        <v-text-field
          v-model="searchWord"
          dense
          @blur="executeSearch"
          @keydown.enter="executeSearch"
        />
      </div>
      <span>検索してみよう</span>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
      searchWord: ""
    }
  },

  methods: {
    click() {
      this.$nextTick(() => {
        setTimeout(() => {
          const searchField = this.$refs.input.querySelector('input:not([type=hidden]),textarea:not([type=hidden])')
          searchField.focus()
          searchField.select()
        }, 100)
      })
    },

    executeSearch() {
      if (this.menu) {
        this.$search.mergeContext({word: this.searchWord})
        this.menu = false
      }
    }
  },
}
</script>

<style scoped>
.search-chip-text-wrapper {
  margin-inline-end: 100px;
}
</style>