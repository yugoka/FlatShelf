<template>
  <v-card
    :class="{
      'content-card': true,
      'text-center': true,
      'elevation-2': !selected,
      'elevation-1': selected,
    }"
    :style="{
      width: card.width + 'px',
      height: card.height + 'px',
      top: card.top + 'px',
      left: card.left + 'px'
    }"

    ripple
    @mouseenter="hover=true"
    @mouseleave="hover=false"
    @click="clickCard"
  >

    <v-responsive
      v-if="!showImg"
      class="content-card-img-placeholder"
    />

    <div 
      :class="{
        'top-gradient': true,
        'top-gradient--show': showSelectButton
      }"
    />

    <img
      v-show="showImg"
      class="content-card-img rounded"
      :src="`file://${card.content.thumbnailPath}`"
      @load="showImg=true"
    />

    <v-btn
      v-if="showSelectButton"
      :class="{
        'content-card-select-button': true,
        'content-card-select-button--select-mode': selectMode
      }"
      absolute
      icon
      dark
      @click.stop="clickSelectButton"
    >
      <v-icon
        :class="{
          'blue--text': selected,
          'content-card-select-button-icon': true,
          'content-card-select-button-icon--selected': selected,
        }"
      >
        {{selectButtonIcon}}
      </v-icon>
    </v-btn>
  </v-card>
</template>

<script>


  export default {

    name:"ContentsThumbnail",

    props: {
      card: Object,
    },

    data() {
      return {
        width: "",
        flexGrow: 0,
        showImg: false,
        hover: false,
        selected:false,
      }
    },

    computed: {
      showSelectButton() {
        return this.showImg && (this.selectMode || this.hover || this.selected)
      },
      selectMode() {
        return this.$store.state.isSelectMode
      },
      selectButtonIcon() {
        if (this.selected || !this.selectMode) {
          return "mdi-check-circle"
        } else {
          return "mdi-checkbox-blank-circle-outline"
        }
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
      }
    },

    created() {
      //選択されたコンテンツにこれが含まれるなら表示時に選択
      this.checkSelected()
    }

  }
</script>

<style scoped>
.content-card {
  position: absolute;
  min-width: 0;
  cursor: pointer;
}

.content-card-img {
  width: 100%;
  margin: 0;
  vertical-align:top;
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