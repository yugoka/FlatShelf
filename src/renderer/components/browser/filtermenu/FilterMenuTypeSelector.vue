<template>
  <v-menu
    v-model="isMenuOpen"
    :close-on-content-click="false"
    nudge-bottom="25"
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom open-delay="700" :disabled="isMenuOpen">
        <template v-slot:activator="{ on: tooltip }">
          <v-chip
            outlined
            small
            label
            ripple
            v-bind="{ attrs }"
            v-on="{ ...tooltip, ...menu }"
            class="selector ps-1 pe-2"
          >
            <v-icon
              v-if="!isTypeSelected"
              small
              class="selector-icon ms-1 me-1"
              :color="isTypeSelected ? 'primary' : ''"
            >
              mdi-format-list-bulleted-type
            </v-icon>

            <span v-if="isTypeSelected">
              <span
                v-for="contentType in selectedTypes"
                :key="contentType.id"
                class="ms-1 caption"
              >
                <v-icon class="select-type-icon" small color="primary">{{
                  contentType.icon
                }}</v-icon>
                {{ contentType.name }}
              </span>
            </span>

            <span class="selector-text" v-else> 種類 </span>
          </v-chip>
        </template>
        <span class="caption">ファイルの種類で絞り込み</span>
      </v-tooltip>
    </template>
    <v-card>
      <div class="menu-header mx-2 body-2 pt-1">
        <span />
        <span class="mt-1">種類を選択</span>
        <v-btn icon small @click="close">
          <v-icon small> mdi-close </v-icon>
        </v-btn>
      </div>
      <v-divider />

      <v-list dense class="py-1">
        <v-list-item-group
          color="primary"
          v-model="selectedTypeIndex"
          @change="onChange"
          multiple
        >
          <v-list-item
            v-for="contentType in contentTypes"
            :key="contentType.id"
          >
            <template v-slot:default="{ active }">
              <v-list-item-icon class="me-1">
                <v-icon small>{{ contentType.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-title>
                {{ contentType.name }}
              </v-list-item-title>

              <v-list-item-icon>
                <v-expand-x-transition>
                  <v-icon v-show="active" small> mdi-check </v-icon>
                </v-expand-x-transition>
              </v-list-item-icon>
            </template>
          </v-list-item>
        </v-list-item-group>

        <v-divider class="my-1" />

        <v-list-item-group
          color="primary"
          @change="onSelectAll"
          v-model="selectAll"
        >
          <v-list-item>
            <template v-slot:default="{ active }">
              <v-list-item-icon class="me-1">
                <v-icon small>mdi-check-all</v-icon>
              </v-list-item-icon>

              <v-list-item-title> すべて </v-list-item-title>

              <v-list-item-icon>
                <v-expand-x-transition>
                  <v-icon v-show="active" small> mdi-check </v-icon>
                </v-expand-x-transition>
              </v-list-item-icon>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      isMenuOpen: false,
      contentTypes: [
        {
          name: "画像",
          id: "image",
          icon: "mdi-image-outline",
        },
        {
          name: "ブック",
          id: "book",
          icon: "mdi-book-open-variant",
        },
      ],
      selectedTypeIndex: [],
      selectAll: false,
    }
  },

  watch: {
    viewContextType() {
      this.getTypeSelects()
    },
  },

  computed: {
    viewContextType() {
      return this.$store.state.viewContext.types
    },

    selectedTypes() {
      return this.selectedTypeIndex.map((index) => this.contentTypes[index])
    },
    isTypeSelected() {
      return !!this.selectedTypeIndex.length
    },
  },

  methods: {
    close() {
      this.isMenuOpen = false
    },

    onChange() {
      this.selectAll = null

      const types = this.selectedTypeIndex.map(
        (index) => this.contentTypes[index].id
      )
      if (types.length) {
        this.$store.commit("mergeContext", { types })
      } else {
        this.$store.commit("mergeContext", { types: null })
      }
    },

    getTypeSelects() {
      if (!this.viewContextType || !this.viewContextType.length) {
        this.selectedTypeIndex = []
        this.selectAll = 0
        return
      }

      const typeIDs = Array.isArray(this.viewContextType)
        ? this.viewContextType
        : [this.viewContextType]

      this.selectedTypeIndex = []

      //ここO(N^2)
      for (const typeID of typeIDs) {
        if (typeof typeID != "string") continue

        const typeIndex = this.contentTypes.findIndex((type) => {
          return type.id === typeID
        })

        this.selectedTypeIndex.push(typeIndex)
      }
    },

    onSelectAll() {
      this.selectedTypeIndex = []
      this.onChange()
      this.$nextTick(() => {
        this.selectAll = 0
      })
    },
  },

  created() {
    this.getTypeSelects()
  },
}
</script>

<style scoped>
.selector {
  display: flex;
  max-width: 200px;
  cursor: pointer;
}

.selector-text {
  flex-shrink: 1;
  overflow-x: scroll;
  text-overflow: fade;
}

.selector-text::-webkit-scrollbar {
  display: none;
}

.selector-icon {
  flex-shrink: 0;
}

.select-type-icon {
  margin-bottom: 2px;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  min-width: 150px;
}
</style>
