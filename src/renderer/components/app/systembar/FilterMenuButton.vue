<template>
  <div v-show="$route.name === 'Search'">
    <v-tooltip 
      bottom
      open-delay="300"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          small
          @click="click"

          v-bind="attrs"
          v-on="on"
        >
          <v-icon 
            small
            class="button-icon" 
            :color="isFilterMenuShown ? 'primary' : null"
          >
            mdi-filter
          </v-icon>
        </v-btn>
      </template>
      <span class="caption">フィルタメニューを{{isFilterMenuShown ? "隠す" : "表示"}}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  computed: {
    isFilterMenuShown() {
      return this.$store.state.isFilterMenuShown
    }
  },

  methods: {
    click() {
      //フィルターメニューの表示非表示を切り替える
      this.$store.commit("toggleFilterMenu")
    }
  },
}
</script>

<style scoped>
.button-icon {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
