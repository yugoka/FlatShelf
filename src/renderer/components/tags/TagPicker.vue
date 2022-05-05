<template>
  <div v-if="$store.state.isFilterMenuShown">
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
              class="picker mx-2 px-1"
              small
              v-bind="{ attrs }"
              v-on="{ ...tooltip, ...menu }"
              label
              outlined
              ripple
              @click="show"
            >
              <v-icon small color="secondary" class="mx-1 picker-icon"
                >mdi-tag-outline</v-icon
              >

              <div class="picker-tagchips-group">
                <v-chip
                  v-for="tag in selectedTags"
                  :key="tag.tagID"
                  x-small
                  class="picker-tagchips mx-1 px-1"
                >
                  {{ tag.name }}
                </v-chip>
              </div>

              <v-btn
                v-if="selectedTags.length"
                class="picker-icon"
                icon
                x-small
                @click.stop="unselect"
              >
                <v-icon small color="secondary">mdi-close</v-icon>
              </v-btn>

              <span v-show="!selectedTags.length" class="caption mx-1">
                タグを選択
              </span>
            </v-chip>
          </template>
          <span class="caption">タグで絞り込み</span>
        </v-tooltip>
      </template>
      <TagPickerWindow
        :visible="isMenuOpen"
        :selectedTags="selectedTags"
        @close="hide"
        @toggle-tag="toggleTag"
      />
    </v-menu>
  </div>
</template>

<script>
import TagPickerWindow from "./TagPickerWindow.vue"

export default {
  components: { TagPickerWindow },

  data() {
    return {
      isMenuOpen: false,
      disableToolTip: false,
      selectedTags: [],
    }
  },
  methods: {
    show() {
      this.isMenuOpen = true
    },
    hide() {
      this.isMenuOpen = false
    },
    //親コンポーネントから呼び出し。
    //選択中のタグ一覧を上書きする
    setSelectedTags(tags) {
      this.selectedTags = tags
    },
    async unselect() {
      this.$store.commit("mergeContext", {
        tags: [],
      })
      this.selectedTags = []
      this.disableToolTip = true
    },
    async toggleTag(tag) {
      //選択中のタグに含まれるかどうかの判定
      const tagIndex = this.selectedTags.findIndex(
        (selectedTag) => selectedTag.tagID === tag.tagID
      )

      if (tagIndex > -1) {
        this.selectedTags.splice(tagIndex, 1)
      } else {
        await this.$tags.setTimeStamp(tag.tagID)
        this.selectedTags.push(tag)
      }

      //親コンポーネントに選択の更新があったことを通知する
      this.$emit("update", this.selectedTags)
    },
  },
}
</script>

<style scoped>
.picker {
  display: flex;
  max-width: 250px;
}
.picker-icon {
  flex-shrink: 0;
}
.picker-tagchips {
  pointer-events: none;
}
.picker-tagchips-group {
  flex-shrink: 1;
  overflow-x: scroll;
}
.picker-tagchips-group::-webkit-scrollbar {
  display: none;
}
</style>
