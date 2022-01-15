<template>
  <v-card
    v-if="!content.isDummy"
    class="content-card text-center elevation-2"
    ripple
    :style="{
      width: width,
      flexGrow: flexGrow, 
    }"
    @mouseenter="hover=true"
    @mouseleave="hover=false"
  >

    <v-responsive
      :aspect-ratio="flexGrow"
      v-if="!showImg"
      class="content-card-img-placeholder"
    />

    <v-img
      v-show="showImg"
      class="rounded"
      eager
      draggable

      :src="`file://${content.thumbnailPath}`"
      @load="showImg=true"
    >
      <div 
        :class="{'fill-height': true, 'top-gradient': true, 'top-gradient--show': showSelectButton}"
      />
    </v-img>

    <v-btn
      v-if="showSelectButton"
      class="content-card-select-button"
      absolute
      icon
      dark
      @click="selected=!selected"
    >
      <v-icon
        :class="{'blue--text': selected}"
      >
        mdi-check-circle
      </v-icon>
    </v-btn>

    <v-card-text class="py-0 text-truncate">
      {{content.name}}
    </v-card-text>
  </v-card>

  <div
    v-else
    class="content-card-dummy"
  />
</template>

<script>


  export default {

    name:"ContentsThumbnail",

    props: {
      content: Object,
    },

    data() {
      return {
        width: "",
        flexGrow: 0,
        showImg: false,
        hover: false,
        selected:false
      }
    },

    computed: {
      showSelectButton() {
        return this.hover || this.selected
      }
    },

    methods: {

    },

    async created() {
      const res = this.content
      this.flexGrow = res.thumbnailWidth / res.thumbnailHeight
      this.width = (res.thumbnailWidth / res.thumbnailHeight) + "px"
    }

  }
</script>

<style scoped>
.content-card {
  min-width: 0;
  cursor: pointer;
  margin: 2px;
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
  opacity: 0.8;
  top: 0px;
  left: 0px;
}

.top-gradient {
  opacity: 0;
  transition: 0.1s;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 20%);
}
.top-gradient--show {
  opacity: 1;
}
</style>