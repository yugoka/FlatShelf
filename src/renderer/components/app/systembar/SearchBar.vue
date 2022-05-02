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
            class="mx-1"
            small
            label
            outlined
            v-bind="{ attrs }"
            v-on="{ ...tooltip, ...menu }"
            @click="click"
          > 
            <div class="search-chip-text-wrapper">
              <v-icon>mdi-magnify</v-icon>
              {{context.word ? context.word : "検索"}}
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
          :persistent-placeholder="!context.word.length"

          v-model="context.word"
          @keypress.enter="executeSearch"
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

  components: {  },

  data() {
    return {
      menu: false,
      cardNudgeLeft: 0,
      context: {
        word: ""
      }
    }
  },

  computed: {
    //現在検索対象のフォルダ
    searchFolder() {
      return this.$store.state.viewContext.folder
    }
  },

  watch: {
    searchFolder() {
      this.context = {word: ""}
    }
  },

  methods: {
    click() {
      
    },

    executeSearch() {
      if (this.menu) {

        //検索画面に居るならシンプルに検索
        if (this.$route.name === "Search") {
          this.$search.mergeContext(this.context)

        //検索画面でないなら検索画面に飛ぶ
        } else {
          this.$search.setContext(this.context)
          this.$router.push({ name: "Search"})
        }

        this.menu = false
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