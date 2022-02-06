<template>
  <v-btn
    :class="{
      'button': true,
      'button--select-mode': selectMode
    }"
    absolute
    icon
    dark
    @click.stop="click"
  >
    <v-icon
      :class="{
        'blue--text': selected,
        'button-icon': true,
        'button-icon--selected': selected,
      }"
    >
      {{icon}}
    </v-icon>
  </v-btn>
</template>

<script>
  export default {
    props: {
      selected: Boolean,
      selectMode: Boolean
    },

    computed: {
      icon() {
        if (this.selected || !this.selectMode) {
          return "mdi-check-circle"
        } else {
          return "mdi-checkbox-blank-circle-outline"
        }
      },
    },

    methods: {
      click() {
        this.$emit("activate")
      }
    }
  }
</script>

<style scoped>

.button {
  opacity: 0.65;
  top: 0px;
  left: 0px;
}
.button:hover {
  opacity: 0.95;
}
.button--select-mode {
  opacity: 0.8;
}
.button-icon {
  border-radius: 50%;
  background-clip: content-box;
  padding: 3px;
  transition-delay: 0.05s;
  transition: 0.1s;
  transition-property: background-color;
}
.button-icon--selected {
  background-color: #ffffff;
  transition-delay: 0s;
  transition-property: background-color;
}
</style>