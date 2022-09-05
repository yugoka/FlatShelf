<template>
  <v-switch
    color="primary"
    :label="data.label"
    v-model="status"
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
      status: null,
    }
  },

  methods: {
    onChange() {
      this.$config.set(this.data.id, this.status)
    },
  },

  mounted() {
    this.status = this.$config.get(this.data.id)
  },
}
</script>
