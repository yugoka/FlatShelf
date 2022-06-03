<template>
  <div>
    <v-menu
      v-model="isMenuOpen"
      :close-on-content-click="false"
      nudge-bottom="25"
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip
          bottom
          open-delay="300"
          :disabled="isMenuOpen || disableToolTip"
        >
          <template v-slot:activator="{ on: tooltip }">
            <v-chip
              class="selector px-1"
              small
              v-bind="{ attrs }"
              v-on="{ ...tooltip, ...menu }"
              label
              outlined
              ripple
              @click="show"
            >
              <v-icon small class="selector-icon ms-1 me-1"
                >mdi-folder-outline</v-icon
              >

              <div class="selector-text">
                {{ isFolderSelected ? folder.name : "フォルダを選択" }}
              </div>

              <v-btn
                v-if="isFolderSelected"
                icon
                x-small
                class="selector-icon ms-1"
                @click.stop="unselect"
              >
                <v-icon small> mdi-close </v-icon>
              </v-btn>
            </v-chip>
          </template>
          <span class="caption">フォルダで絞り込み</span>
        </v-tooltip>
      </template>
      <v-card class="card">
        <div class="pt-2">
          <div class="menu-header mx-4 mb-1 body-2">
            <span class="mt-1 ms-3">フォルダを選択</span>
            <v-btn icon small @click="isMenuOpen = false">
              <v-icon small> mdi-close </v-icon>
            </v-btn>
          </div>
          <v-divider class="mx-1" />

          <div class="scroll-content py-2 my-1">
            <Folders
              syncWithViewContext
              ref="folderList"
              no-header
              @select="onSelect"
              :min-height="null"
            />
          </div>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import Folders from "./Folders.vue"
export default {
  components: { Folders },
  props: {
    folderID: Number,
  },

  data() {
    return {
      isMenuOpen: false,
      folder: {},
      disableToolTip: false,
    }
  },

  computed: {
    isFolderSelected() {
      return !!this.folder.folderID
    },
  },

  watch: {
    async folderID() {
      await this.getFolderData()
    },
  },

  methods: {
    show() {
      this.isMenuOpen = true
    },
    async getFolderData() {
      if (!this.folderID) {
        this.folder = {}
      } else {
        const folderData = await this.$folders.getData([this.folderID])
        this.folder = folderData[0]
      }
    },
    onSelect(folder) {
      this.$emit("select", folder)
      this.isMenuOpen = false
    },
    unselect() {
      this.$emit("unselect")
    },
  },

  async mounted() {
    await this.getFolderData()
  },
}
</script>

<style scoped>
.selector {
  display: flex;
  max-width: 200px;
}

.selector-text {
  flex-shrink: 1;
  overflow-x: scroll;
  text-overflow: fade;
}

.selector-icon {
  flex-shrink: 0;
}

.selector-text::-webkit-scrollbar {
  display: none;
}

.card {
  max-width: 250px;
}

.menu-header {
  display: flex;
  justify-content: space-between;
}

.scroll-content {
  max-height: 250px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.card ::-webkit-scrollbar {
  overflow: visible;
  width: 4px;
}
.card ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
</style>
