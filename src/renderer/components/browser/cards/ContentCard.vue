<template>
  <div
    :class="{
      'content-card': true,
      'rounded': true,
      'text-center': true,
      'elevation-2': true,
      'content-card--highlighted': selected || highlighted,
    }"
    :style="{
      width: card.width + 'px',
      height: cardHeight + 'px',
      top: card.top + 'px',
      left: card.left + 'px'
    }"

    v-ripple
    draggable
    @mouseenter="onHover"
    @mouseleave="hover=false"
    @click="clickCard"
    @contextmenu="showContextMenu"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >

    <div 
      :class="{
        'top-gradient': true,
        'top-gradient--show': showSelectButton
      }"
    />

    <SelectButton
      v-if="showSelectButton || highlighted"
      :selected="selected"
      :editMode="editMode"
      @activate="onClickSelectButton"
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
      card: Object
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
        highlighted: false,
        sources: {
          small: this.$contents.getThumbnail(this.card.content, "small"),
          medium: this.$contents.getThumbnail(this.card.content, "medium"),
        },
      }
    },

    computed: {
      showSelectButton() {
        return this.showImg && (this.hover || this.selected)
      },
      editMode() {
        return this.$store.state.edit.editMode
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
      selectedIDs() {
        return this.$store.state.edit.selectedIDs
      },
    },

    watch: {
      editMode() {
        if (this.editMode) {
          this.checkSelected()
        } else {
          //他の要因で選択モードがオフになった時自身の選択を解除する
          this.selected = false
          this.highlighted = false
        }
      },

      selectedIDs() {
        this.checkSelected()
      }
    },

    methods: {
      onHover() {
        this.hover = true
        this.$emit("hover")
      },

      onClickSelectButton() {
        this.selected = !this.selected
        this.$emit(
          "setContentSelect",
          {
            contentID: this.card.content.contentID, 
            isSelected: this.selected,
            cardIndex: this.card.index
          }
        )
      },
      clickCard() {
        //選択モードなら画像クリックで選択追加
        if (this.editMode) {
          this.onClickSelectButton()
        }
      },

      checkSelected() {
        this.selected = this.selectedIDs.includes(this.card.content.contentID)
      },

      showContextMenu() {
        this.$emit("contextMenu", this.card.content.contentID)
      },

      onDragStart(e) {
        //ドラッグ操作の対象
        const targets = this.selected
          ? this.selectedIDs
          : [this.card.content.contentID]
        
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'
        e.dataTransfer.setDragImage(new Image(), 0, 0)
        e.dataTransfer.setData('type', 'content')
        e.dataTransfer.setData('targetContents', JSON.stringify(targets))
        this.$emit('dragstart', this.card.content)
      },

      onDragEnd() {
        this.$emit('dragend')
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
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

.content-card--highlighted {
  border: 1px solid rgba(33, 150, 243, 1);
}

.content-card-img {
  vertical-align: top;
  object-fit: cover;
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