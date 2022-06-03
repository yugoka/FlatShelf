<template>
  <v-checkbox
    color="primary"
    :label="data.label"
    v-model="check"
    @change="onChange"
  />
</template>

<script>
export default {
  props: {
    data: Object,
  },

  data() {
    return {
      check: null,
    }
  },

  methods: {
    onChange() {
      this.$config.set(this.data.id, this.check)
    },
  },

  mounted() {
    this.check = this.$config.get(this.data.id)
  },
}
</script>
