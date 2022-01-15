<template>
  <v-card
    v-if="!content.isDummy"
    class="content-card text-center elevation-2"
    ripple
    :style="{
      width: width,
      flexGrow: flexGrow, 
    }"
  >
    <v-btn
      class="content-card-select-button"
      absolute
      icon
    >
      <v-icon>
        mdi-check-circle
      </v-icon>
    </v-btn>

    <v-responsive
      :aspect-ratio="flexGrow"
      v-show="!showImg"
      class="content-card-img-placeholder"
    />

    <v-img
      class="rounded"
      eager
      draggable

      :src="`file://${content.thumbnailPath}`"
      v-show="showImg"
      @load="showImg=true"
    />

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
        showImg: false
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
  top: 10px;
  left: 10px;
}
</style>