<template>
  <v-menu v-model="menu" :close-on-content-click="false" nudge-left="80">
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom open-delay="300">
        <template v-slot:activator="{ on: tooltip }">
          <v-chip
            outlined
            small
            v-bind="{ attrs }"
            v-on="{ ...tooltip, ...menu }"
          >
            タイプで絞り込み
          </v-chip>
        </template>
        <span class="caption">検索対象</span>
      </v-tooltip>
    </template>
    <v-list dense width="180">
      <v-list-item>
        <v-list-item-title>
          タイプを選択
          <v-btn class="mb-1 ml-1" icon x-small @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <v-list-item-group
        color="primary"
        mandatory
        v-model="sortMethodSelect"
        @change="onChange"
      >
        <v-list-item v-for="type in types" :key="type.id">
          <v-list-item-title>
            <v-icon small class="me-1">{{ type.icon }}</v-icon>
            {{ type.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    top: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      menu: false,
      types: [
        {
          name: "タイトル",
          id: "name",
          icon: "mdi-pencil",
        },
        {
          name: "追加日",
          id: "createdAt",
          icon: "mdi-note-plus-outline",
        },
        {
          name: "更新日",
          id: "updatedAt",
          icon: "mdi-autorenew",
        },
        {
          name: "作者名",
          id: "author",
          icon: "mdi-account-circle-outline",
        },
      ],
      sortMethodSelect: null,
      sortDirectionSelect: null,
    }
  },

  computed: {
    type() {
      return this.$store.state.viewContext.type
    },
  },

  watch: {},

  methods: {
    close() {
      this.menu = false
    },

    onChange() {
      const sortMethod = this.sortMethods[this.sortMethodSelect].id
      const sortDirection = this.sortDirections[this.sortDirectionSelect].id
      this.$store.commit("mergeContext", {
        order: [[sortMethod, sortDirection]],
      })
    },

    getType() {},
  },
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
