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
          open-delay="700"
          :disabled="isMenuOpen || disableToolTip"
        >
          <template v-slot:activator="{ on: tooltip }">
            <div v-bind="{ attrs }" v-on="{ ...tooltip, ...menu }">
              <ActivatorChip
                v-if="mode === 'chip'"
                :selectedTags="selectedTags"
                @unselect="unselect"
              />
              <ActivatorCard
                v-else
                :selectedTags="selectedTags"
                @unselect="unselect"
              />
            </div>
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
import TagPickerWindow from "../TagPickerWindow.vue"
import ActivatorCard from "./ActivatorCard.vue"
import ActivatorChip from "./ActivatorChip.vue"

export default {
  components: { TagPickerWindow, ActivatorChip, ActivatorCard },

  props: {
    //mode="chip"ならアクティベーターが小さなチップに、mode="box"ならアクティベーターがカードになる
    mode: {
      type: String,
      default: "chip",
    },
  },

  data() {
    return {
      isMenuOpen: false,
      disableToolTip: false,
      selectedTags: [],
    }
  },

  methods: {
    hide() {
      this.isMenuOpen = false
    },
    //親コンポーネントから呼び出し。
    //選択中のタグ一覧を上書きする
    setSelectedTags(tags) {
      this.selectedTags = tags
    },
    async unselect() {
      this.selectedTags = []
      this.disableToolTip = true
      this.$emit("update", this.selectedTags)
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
