<template>
  <v-chip 
    class="tag-chip me-1 mt-1 px-1"
    small
    ripple
    @click.stop="click"
  >
    {{tag.name}}
    <v-btn
      class="close-button"
      icon
      x-small
      @click.stop=""
    >
      <v-icon
        x-small
      >
        mdi-close
      </v-icon>
    </v-btn>
  </v-chip>
</template>

<script>
export default {
  name: "TagChip",

  props: {
    tag: Object,
  },

  data() {
    return {

    }
  },

  methods: {
    click() {
      console.log(this.tag.name)
    }
  }

}
</script>

<style scoped>

</style>