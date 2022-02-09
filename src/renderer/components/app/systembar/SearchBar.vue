<template>
  <v-menu
    content-class="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-left="cardNudgeLeft"
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip
        bottom
        open-delay="300"
      >
        <template v-slot:activator="{ on: tooltip }">
          <v-chip
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
      ref="card"
      class="menu-card px-1 pb-3 text-center"
    >
      <div ref="input">
        <v-text-field
          autofocus
          flat
          solo
          dense
          hide-details

          prepend-inner-icon="mdi-magnify"
          placeholder="検索してみよう"
          :persistent-placeholder="!searchWord.length"

          v-model="searchWord"
          @keydown.enter="executeSearch"
        />
      </div>
      <v-divider class="mb-3"/>
      <div>
        <span class="caption">ここに検索設定やタグ設定を入れる</span>
      </div>
    </v-card>
  </v-menu>
</template>

<script>

import debounce from 'lodash.debounce'

export default {
  data() {
    return {
      menu: false,
      searchWord: "",
      cardNudgeLeft: 0
    }
  },

  methods: {
    click() {
      
    },

    executeSearch() {
      if (this.menu) {
        this.$search.mergeContext({word: this.searchWord})
        this.menu = false
        this.searchWord = ""
      }
    },

    getCardNudgeLeft: debounce(function () {
      let cardWidth = window.innerWidth * 0.4
      if (cardWidth > 600) cardWidth = 600
      this.cardNudgeLeft = (cardWidth / 2) - 86.5
    }, 500)
  },

  mounted() {
    this.getCardNudgeLeft()
    window.addEventListener('resize', this.getCardNudgeLeft)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.getCardNudgeLeft)
  }
}
</script>

<style scoped>
.menu {
  top: 5px !important;
  width: 40%;
  max-width: 600px;
  transform: translateX(100);
}
.menu-card {
  width: 100%;
}
.menu-input-field {
  border: none !important;
}
.search-chip-text-wrapper {
  margin-inline-end: 100px;
}
</style>