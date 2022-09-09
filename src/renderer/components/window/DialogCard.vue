<template>
  <v-dialog
    class="dialog"
    v-model="visible"
    :persistent="persistent"
    :max-width="maxWidth"
    scrollable
  >
    <v-card class="card" :max-height="maxHeight">
      <v-card-title class="body-1">
        <span v-if="title">
          {{ title }}
        </span>

        <v-spacer />

        <v-btn v-if="showCloseButton" icon small @click="hide">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-subtitle v-if="caption" class="pb-1 primary--text">
        <span class="caption">
          {{ caption }}
        </span>
      </v-card-subtitle>

      <v-divider />
      <slot />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "WindowRoot",

  props: {
    persistent: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: Number,
      default: 500,
    },
    maxHeight: {
      type: Number,
      default: 500,
    },
    title: {
      type: String,
      default: null,
      required: false,
    },
    caption: {
      type: String,
      default: null,
      required: false,
    },
    showCloseButton: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      visible: false,
    }
  },

  methods: {
    show() {
      this.visible = true
    },

    hide() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
.card ::-webkit-scrollbar {
  overflow: visible;
  width: 4px;
}
.card ::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 2px;
}
</style>
