<template>
  <div v-show="$route.name === 'Search'">
    <v-menu
      :content-class="top ? 'top' : ''"
      v-model="menu"
      :close-on-content-click="false"
      nudge-left="80"
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip
          bottom
          open-delay="300"
        >
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              icon
              small
              v-bind="{ attrs }"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon
                small 
                class="button-icon"
              >
                mdi-sort
              </v-icon>
            </v-btn>
          </template>
          <span class="caption">並び替え</span>
        </v-tooltip>
      </template>
      <v-list
        dense
        width="180"
      >
        <v-list-item>
          <v-list-item-title>
            並び替え方法を選択
            <v-btn
              class="mb-1 ml-1"
              icon
              x-small
              @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-title>
        </v-list-item>

        <v-divider/>

        <v-list-item-group
          color="primary"
          mandatory
          v-model="sortMethodSelect"
          @change="onChange"
        >
          <v-list-item
            v-for="sort in sortMethods"
            :key="sort.id"
          >
            <v-list-item-title>
              <v-icon small class="me-1">{{sort.icon}}</v-icon>
              {{sort.name}}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>

        <v-divider
          class="my-1"
        />

        <v-list-item-group
          color="primary"
          mandatory
          v-model="sortDirectionSelect"
          @change="onChange"
        >
          <v-list-item
            v-for="direction in sortDirections"
            :key="direction.id"
          >
            <v-list-item-title>
              <v-icon small class="me-1">{{direction.icon}}</v-icon>
              {{direction.name}}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    top: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      menu: false,
      sortMethods: [
        { 
          name: "タイトル",
          id: "name",
          icon: "mdi-rename-box"
        },
        { 
          name: "追加日",
          id: "createdAt",
          icon: "mdi-note-plus-outline"
        },
        { 
          name: "更新日",
          id: "updatedAt",
          icon: "mdi-autorenew"
         },
        { 
          name: "作者名",
          id: "author",
          icon: "mdi-account-circle-outline"
        }
      ],
      sortDirections: [
        {
          name: "昇順",
          id: "ASC",
          icon: "mdi-sort-ascending"
        },
        {
          name: "降順",
          id: "DESC",
          icon: "mdi-sort-descending"
        },
      ],
      sortMethodSelect: null,
      sortDirectionSelect: null
    }
  },

  computed: {
    order() {
      return this.$store.state.viewContext.order[0]
    }
  },

  watch: {
  },

  methods: {
    close() {
      this.menu = false
    },
    
    checkCurrentSortMethod() {
      //現在選択されている並び替えデータをリスト選択に反映する
      for (const [index, method] of this.sortMethods.entries()) {
        if(method.id === this.order[0]) {
          this.sortMethodSelect = index
          break
        }
      }

      for (const [index, direction] of this.sortDirections.entries()) {
        if(direction.id === this.order[1]) {
          this.sortDirectionSelect = index
          break
        }
      }
    },

    onChange() {
      const sortMethod = this.sortMethods[this.sortMethodSelect].id
      const sortDirection = this.sortDirections[this.sortDirectionSelect].id
      this.$store.commit("mergeContext", {
        order: [[
          sortMethod, sortDirection
        ]]
      })
    }
  },

  created() {
    this.checkCurrentSortMethod()
  }
}
</script>

<style scoped>
.top {
  top: 5px !important;
}
.button-icon {
  margin: 0;
  padding: 0;
}
</style>