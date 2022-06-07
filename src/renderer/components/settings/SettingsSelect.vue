<template>
  <v-select 
    color="primary" 
    class="my-4 selector"
    dense
    :label="data.label"
    :append-icon="data.icon"
    :items="data.selects" 
    v-model="select"
    @change="onChange"
    item-text="label"
    item-value="value"
  />
</template>

<script>
export default {
  props: {
    data: Object,
  },

  data() {
    return {
      select: null,
    }
  },

  methods: {
    onChange() {
      this.$config.set(this.data.id, this.select)
    },
  },

  mounted() {
    this.select = this.$config.get(this.data.id)
  },
}
</script>

<style scoped>
.selector {
  max-width: 300px;
}
</style>