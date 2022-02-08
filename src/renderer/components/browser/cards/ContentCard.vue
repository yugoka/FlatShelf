<template>
  <div
    :class="{
      'content-card': true,
      'text-center': true,
      'elevation-2': true,
      'content-card--selected': selected,
    }"
    :style="{
      width: card.width + 'px',
      height: cardHeight + 'px',
      top: card.top + 'px',
      left: card.left + 'px'
    }"

    v-ripple
    @mouseenter="hover=true"
    @mouseleave="hover=false"
    @click="clickCard"
    @contextmenu="showContextMenu"
  >

    <div 
      :class="{
        'top-gradient': true,
        'top-gradient--show': showSelectButton
      }"
    />

    <SelectButton
      v-if="showSelectButton"
      :selected="selected"
      :selectMode="selectMode"
      @activate="clickSelectButton"
    />

    <img
      v-show="showImg"
      class="content-card-img rounded"
      :src="imgSrc"
      @load="showImg=true"
      :width="card.width"
      :height="card.height"
    />
    <span 
      :class="(card.height < 300) ? 'caption' : 'body--2'"
      v-if="showItemName"
    >
      {{card.content.name}}
    </span>
  </div>
</template>

<script>
  import SelectButton from "./SelectButton"

  export default {

    name:"ContentsCard",

    props: {
      card: Object,
    },

    components: {
      SelectButton
    },

    data() {
      return {
        width: "",
        flexGrow: 0,
        showImg: false,
        hover: false,
        selected: false,
        sources: {
          small: `file://${this.card.content.folderPath}/${this.card.content.thumbnailSmall}`,
          medium: `file://${this.card.content.folderPath}/${this.card.content.thumbnailMedium}`,
        }
      }
    },

    computed: {
      showSelectButton() {
        return this.showImg && (this.hover || this.selected)
      },
      selectMode() {
        return this.$store.state.isSelectMode
      },
      showItemName() {
        return this.$store.state.settings.renderer.search.showItemName
      },
      cardHeight() {
        if (this.showItemName) {
          return this.card.height + 26
        } else {
          return this.card.height
        }
      },
      imgSrc() {
        return (this.card.height <= 200)
          ? this.sources.small
          : this.sources.medium
      },
    },

    watch: {
      selectMode() {
        //他の要因で選択モードがオフになった時自身の選択を解除する
        if (!this.selectMode) this.selected = false
      }
    },

    methods: {
      clickSelectButton() {
        this.selected = !this.selected
        this.$store.commit("setSelectMode", true)

        if (this.selected) {
          this.$store.commit("addSelectedItem", this.card.content.contentID)
        } else {
          this.$store.commit("removeSelectedItem", this.card.content.contentID)
        }
      },
      clickCard() {
        //選択モードなら画像クリックで選択追加
        if (this.selectMode) {
          this.clickSelectButton()
        }
      },

      checkSelected() {
        this.selected = this.$store.state.selectedItems.includes(this.card.content.contentID)
      },

      showContextMenu() {
        this.$emit("contextMenu", this.card.content.contentID)
      }
    },

    created() {
      //選択されたコンテンツにこれが含まれるなら表示時に選択
      this.checkSelected()
    },

  }
</script>

<style scoped>
.content-card {
  position: absolute;
  min-width: 0;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content-card--selected {
  border: 1px solid rgba(33, 150, 243, 1);
}

.content-card-img {
  vertical-align: top;
  object-fit: contain;
}

.content-card-img-placeholder {
  background-color: #fafafa;
}

.content-card-dummy {
  width: 1;
  flex-grow: 1;
  pointer-events: none;
}

.content-card-select-button {
  opacity: 0.65;
  top: 0px;
  left: 0px;
}
.content-card-select-button:hover {
  opacity: 0.95;
}
.content-card-select-button--select-mode {
  opacity: 0.8;
}
.content-card-select-button-icon {
  border-radius: 50%;
  background-clip: content-box;
  padding: 3px;
  transition-delay: 0.05s;
  transition: 0.1s;
  transition-property: background-color;
}
.content-card-select-button-icon--selected {
  background-color: #ffffff;
  transition-delay: 0s;
  transition-property: background-color;
}

.top-gradient {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  opacity: 0;
  transition: 0.1s;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 20%);
}
.top-gradient--show {
  opacity: 1;
}
</style>