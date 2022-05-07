<template>
  <v-list nav dense>
    <v-list-item @click="toggleExpand">
      <v-list-item-content>
        <v-list-item-title class="caption">
          <span>検索結果に含める： </span>
          <span class="selector-text primary--text">
            <span
              v-for="column in selectedColumnsData"
              :key="column.id"
              class="me-1"
            >
              <v-icon x-small>{{ column.icon }}</v-icon>
              {{ column.name }}
            </span>

            <span v-if="isAllSelected"> すべて </span>
          </span>
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-action>
        <RotatingIcon small :up="expanded" icon="mdi-chevron-down" />
      </v-list-item-action>
    </v-list-item>

    <v-expand-transition>
      <div v-show="expanded" class="">
        <v-divider class="mb-1" />

        <v-list-item-group color="primary" multiple v-model="columnSelect">
          <v-list-item v-for="column in columns" :key="column.id">
            <template v-slot:default="{ active }">
              <v-list-item-icon class="me-1">
                <v-icon small> {{ column.icon }} </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> {{ column.name }} </v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon>
                <v-expand-x-transition>
                  <v-icon v-show="active" small> mdi-check </v-icon>
                </v-expand-x-transition>
              </v-list-item-icon>
            </template>
          </v-list-item>
        </v-list-item-group>

        <v-divider class="my-1" />

        <v-list-item-group color="primary" v-model="columnAllSelect">
          <v-list-item @click="onClickAllSelect">
            <template v-slot:default="{ active }">
              <v-list-item-icon class="me-1">
                <v-icon small> mdi-check-all</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> すべて </v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon>
                <v-expand-x-transition>
                  <v-icon v-show="active" small> mdi-check </v-icon>
                </v-expand-x-transition>
              </v-list-item-icon>
            </template>
          </v-list-item>
        </v-list-item-group>
      </div>
    </v-expand-transition>
  </v-list>
</template>

<script>
import RotatingIcon from "../../miniparts/RotatingIcon.vue"
export default {
  components: { RotatingIcon },
  data() {
    return {
      expanded: false,
      columnSelect: [],
      columnAllSelect: 0,
      columns: [
        {
          column: "name",
          name: "タイトル",
          icon: "mdi-pencil",
        },
        {
          column: "description",
          name: "説明",
          icon: "mdi-note-text-outline",
        },
        {
          column: "author",
          name: "作者名",
          icon: "mdi-account-circle-outline",
        },
      ],
    }
  },

  computed: {
    isAllSelected() {
      return !this.columnSelect.length
    },
    selectedColumnsData() {
      return this.columnSelect.map((index) => this.columns[index])
    },
  },

  watch: {
    isAllSelected() {
      if (this.isAllSelected) {
        this.columnAllSelect = 0
      } else {
        this.columnAllSelect = null
      }
    },
    selectedColumnsData() {
      const selectedColumns = this.columnSelect.length
        ? this.selectedColumnsData
        : this.columns

      this.$emit("select", selectedColumns)
    },
  },

  methods: {
    toggleExpand() {
      this.expanded = !this.expanded
    },
    onClickAllSelect() {
      this.columnSelect = []
      this.$nextTick(() => {
        this.columnAllSelect = 0
      })
    },
  },
}
</script>

<style scoped>
.selector-text {
  white-space: nowrap;
}
</style>
