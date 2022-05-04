<template>
  <div v-if="$store.state.isFilterMenuShown">
    <v-menu
      v-model="isMenuOpen"
      :close-on-content-click="false"
      nudge-bottom="25"
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip bottom open-delay="300" :disabled="isMenuOpen">
          <template v-slot:activator="{ on: tooltip }">
            <v-chip
              class="picker mx-2 px-1"
              small
              v-bind="{ attrs }"
              v-on="{ ...tooltip, ...menu }"
              label
              outlined
              ripple
              @click="show"
            >
              <v-icon small color="secondary" class="mx-1"
                >mdi-tag-outline</v-icon
              >

              <v-chip
                x-small
                class="mx-1 px-1"
                v-for="tag in selectedTags"
                :key="tag.tagID"
              >
                {{ tag.name }}
              </v-chip>

              <span v-if="!selectedTags.length" class="caption mx-1">
                タグを選択
              </span>
            </v-chip>
          </template>
          <span class="caption">タグで絞り込み</span>
        </v-tooltip>
      </template>
      <TagPickerWindow
        :viewContext="viewContext"
        :visible="isMenuOpen"
        :selectedTags="selectedTags"
        @close="hide"
        @toggleTag="toggleTag"
      />
    </v-menu>
  </div>
</template>

<script>
import TagPickerWindow from "./TagPickerWindow.vue"

export default {
  components: { TagPickerWindow },

  props: {
    viewContext: Object,
  },

  data() {
    return {
      isMenuOpen: false,
      selectedTags: [],
    }
  },
  watch: {
    async viewContext() {
      if (
        !Array.isArray(this.viewContext.tags) ||
        !this.viewContext.tags.length
      )
        return

      await this.getSelectedTags()
    },
  },
  methods: {
    show() {
      this.isMenuOpen = true
    },
    hide() {
      this.isMenuOpen = false
    },
    async getSelectedTags() {
      this.selectedTags = await this.$tags.get({
        ids: this.viewContext.tags,
        idMode: true,
      })
    },
    async toggleTag(tag) {
      const selectedTags = this.selectedTags

      //選択中のタグに含まれるかどうかの判定
      const tagIndex = selectedTags.findIndex(
        (selectedTag) => selectedTag.tagID === tag.tagID
      )

      if (tagIndex > -1) {
        selectedTags.splice(tagIndex, 1)
      } else {
        await this.$tags.setTimeStamp(tag.tagID)
        selectedTags.push(tag)
      }

      this.$store.commit("mergeContext", {
        tags: selectedTags.map((tag) => tag.tagID),
      })
    },
  },

  async mounted() {
    await this.getSelectedTags()
  },
}
</script>

<style scoped>
.picker {
  max-width: 250px;
  overflow: scroll;
}
</style>
